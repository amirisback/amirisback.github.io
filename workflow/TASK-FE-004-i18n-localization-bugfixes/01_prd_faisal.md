# 01_prd_faisal.md — PRD & Alignment: Perbaikan Bug Terjemahan Bahasa Indonesia & English

**Task ID**: `TASK-FE-004-i18n-localization-bugfixes`  
**Author**: Faisal (`faisal_pm`)  
**Status**: Approved & Frozen  
**Date**: 2026-10-06  

---

## 1. Product Overview & User Stories

### Overview
Pengguna melaporkan adanya inkonsistensi bahasa dan bug terjemahan di situs portofolio (`amirisback.github.io`). Terdapat teks yang tetap berbahasa Inggris saat mode Bahasa Indonesia aktif (misal: "I am a", "I'm", tombol CTA Hero, teks biografi Tentang Saya, judul media sosial Footer, dan kalimat "Dibuat dengan ❤️ in Indonesia"). Sebaliknya, saat mode English aktif, ditemukan string bahasa Indonesia yang belum disesuaikan (misal: singkatan bulan "Des", "Mei", nama wilayah "Jawa Barat", serta typo). Selain itu, terdapat istilah non-baku KBBI pada kamus Bahasa Indonesia seperti "Projek" dan "Progressive".

### User Stories
- **US-01**: Sebagai pengunjung berbahasa Indonesia, saya ingin melihat seluruh antarmuka dan konten utama (Hero, Tentang Saya, Proyek, Pengalaman, Kontak, Footer) tersaji dalam Bahasa Indonesia yang baku dan alami, tanpa ada teks bahasa Inggris yang bocor.
- **US-02**: Sebagai pengunjung internasional berbahasa Inggris, saya ingin melihat seluruh tanggal, lokasi, judul, dan informasi portofolio dalam Bahasa Inggris yang akurat tanpa istilah lokal Indonesia yang tidak diterjemahkan.
- **US-03**: Sebagai pemilik portofolio, saya ingin sistem lokalisasi terstruktur rapi di `dictionaries/id.json` dan `dictionaries/en.json` serta konten dwibahasa di `content.json`, tanpa merusak routing dan arsitektur Next.js 16 yang sudah ada.

---

## 2. Acceptance Criteria (AC)

- [x] **AC-01 (Kamus Baku & Bebas Slop)**: Kamus `id.json` dan `en.json` diselaraskan. Kata "Progressive" di `id.json` diganti menjadi "Progresif", "Projek" diganti menjadi "Proyek", "Projek Keren" menjadi "Proyek Pilihan", dan "Lihat Projek" menjadi "Lihat Proyek". Sesuai antislop R-02, em dash (`—`) dilarang dalam copy teks.
- [x] **AC-02 (Hero Localization)**: Komponen Hero menampilkan sapaan ("Saya" vs "I'm"), awalan status ("Saya seorang" vs "I am a"), dan tombol aksi ("Lihat CV Amir" / "Ikuti GitHub Amir" vs "View Amir's CV" / "Follow Amir's GitHub") sesuai bahasa aktif.
- [x] **AC-03 (Biografi Tentang Saya Dwibahasa)**: Deskripsi diri pada section "Tentang Saya" menampilkan narasi Bahasa Indonesia ketika locale `id` aktif, dan Bahasa Inggris ketika locale `en` aktif.
- [x] **AC-04 (Footer & Lokasi Presisi)**: Teks footer tidak lagi mencampurkan bahasa ("Dibuat dengan ❤️ di Indonesia" untuk ID, dan "Made with ❤️ in Indonesia" untuk EN). Header media sosial menampilkan "Terhubung di Media Sosial" (ID) / "Connect on Socials" (EN).
- [x] **AC-05 (Pengalaman Kerja & Normalisasi Tanggal)**: Timeline pengalaman kerja menerjemahkan "Now" menjadi "Sekarang" (ID) / "Present" (EN), bulan "Des" menjadi "Dec" (EN), "Mei" menjadi "May" (EN), serta memperbaiki typo lokasi ("IndonesiaBandung" -> "Indonesia", "Chat Aja Messeger" -> "Chat Aja Messenger").
- [x] **AC-06 (Deskripsi Proyek Dwibahasa)**: Item proyek memiliki deskripsi Bahasa Indonesia yang jelas dan baku saat mode ID aktif, serta tetap berbahasa Inggris saat mode EN aktif.
- [x] **AC-07 (Quality Gate & Test Suite Green)**: Seluruh unit test Vitest (141+ tests) tetap lulus 100% tanpa regresi, build production sukses tanpa error linting.

---

## 3. Cross-Role Alignment Meeting Log

### 1. Sandra (QA):
- **Question**: *"Jika kita mengubah key di `id.json` dan menambahkan props lokalisasi ke `Hero`, `About`, dan `Experience`, apakah tes unit eksisting di `hero.test.tsx`, `footer.test.tsx`, dan `navbar.test.tsx` akan pecah karena mock data sebelumnya?"*
  - **Faisal (PM Decision)**: Semua props baru harus bersifat backward-compatible (opsional dengan fallback elegan). Komponen tetap harus lulus jika dipanggil dengan mock data lama tanpa dictionary.
  - **Fiqry (Frontend)**: Siap. Di `hero.tsx`, `about.tsx`, dan `experience.tsx`, `dict` dijadikan opsional atau bertahap, dengan fallback langsung ke `data` jika `dict` tidak dipasok. Nilai default tombol tetap mempertahankan kompatibilitas tes eksisting.

### 2. Bryan (Backend/DevOps):
- **Question**: *"Apakah perubahan struktur ini memerlukan migrasi API route `/api/content` atau modifikasi persistensi JSON di filesystem?"*
  - **Bryan's Assessment**: Zero overhead di backend. Endpoint `/api/content` membaca dan menulis `data/content.json` apa adanya. Penambahan field opsional seperti `description_id` pada list proyek sepenuhnya kompatibel dengan skema `PortfolioData` tanpa memerlukan migrasi database/API breaking.

### 3. Angel (UI/UX):
- **Question**: *"Mengapa terjadi kebocoran teks bahasa Inggris di Footer dan Hero, dan bagaimana token desainnya disesuaikan?"*
  - **Angel's Explanation**: Kebocoran terjadi karena teks "in Indonesia", "Connect on Socials", dan "I am a" ditulis hardcoded di dalam JSX tanpa merujuk ke token kamus i18n.
  - **Fix**: Pindahkan seluruh literal string ke kamus `id.json` dan `en.json` di bawah namespace `footer` dan `hero`.
  - **Angel's Specification**:
    - Typography: Tetap menggunakan Geist Sans dengan bobot font konsisten.
    - Copy Indonesia: Gunakan istilah baku KBBI (Proyek, Progresif, Terhubung di Media Sosial, Dibuat dengan ❤️ di Indonesia).
    - Antislop copy rule: Hindari em dash (`—`), ganti dengan koma atau tanda kurung.

### 4. Fiqry (Frontend):
- **Question**: *"Apakah kita perlu memigrasi komponen `page.tsx` untuk meneruskan `dict` dan `locale` ke semua komponen anak?"*
  - **Fiqry's Proposal**: Ya. `page.tsx` sudah mengambil `{ locale, dict } = await getCurrentDictionary()`. Kita cukup meneruskannya ke `<Hero dict={dict} />`, `<Projects dict={dict} currentLang={locale} />`, `<Experience dict={dict} currentLang={locale} />`, dan komponen lainnya.
  - **Faisal (PM Decision)**: Approved. Lakukan integrasi bersih di `page.tsx` dan pastikan tidak ada `any` sesuai Guideline TypeScript Strict.
