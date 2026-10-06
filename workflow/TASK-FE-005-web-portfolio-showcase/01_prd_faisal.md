# PRD: Web Portfolio Showcase with Dynamic Thumbnail Previews

**Task ID:** `TASK-FE-005-web-portfolio-showcase`  
**Product Manager:** Faisal (`faisal_pm`)  
**Lead Subagents:** Angel (`angel_uiux`), Fiqry (`fiqry_frontend`), Sandra (`sandra_qa`)  
**Status:** Approved & Contract Frozen  
**Date:** 2026-10-06  

---

## 1. Product Overview & User Stories

### 1.1 Overview
Portfolio website Muhammad Faisal Amir saat ini menampilkan daftar proyek software engineering yang sebagian besar difokuskan pada Android Libraries dan SDK. Pengguna meminta penambahan 13 portofolio web interaktif dan aplikasi modern ke dalam bagian Proyek/Layanan, lengkap dengan **thumbnail visual preview** dari website terkait untuk meningkatkan kredibilitas, visual proof, dan konversi rekruter/klien potensial.

### 1.2 User Stories
- **Sebagai pengunjung / rekruter:** Saya ingin melihat pratinjau thumbnail visual dari web aplikasi yang dibangun oleh Faisal agar saya dapat langsung mengapresiasi kualitas antarmuka dan estetika produk tanpa harus membuka link satu per satu.
- **Sebagai pemilik portofolio (Faisal):** Saya ingin 13 proyek web terbaru saya (KulaPOS, Financial Math Calculator, RS Ambulatory, Magic Clipper AI, PhotoBooth Pro, Live At Probolinggo, Undangan Aqiqah Alyssa, DocuFlip, Finpro, De Knappe, Hobby Hands Recognition, Wall of Fame Angel Sponsor, dan Propose Love) terpajang rapi dengan metadata akurat, thumbnail dinamis, dan kategori yang jelas.
- **Sebagai pengelola CMS:** Saya ingin dapat mengubah atau menambahkan link thumbnail dan badge kategori proyek langsung melalui CMS Dashboard tanpa merusak struktur data.

---

## 2. Acceptance Criteria (AC)

- **`AC-01`**: 13 proyek web ditambahkan ke dalam `data/content.json` di bawah `services.items` dengan judul, deskripsi informatif, icon FontAwesome yang relevan, URL proyek, badge kategori, dan URL thumbnail preview.
- **`AC-02`**: Interface `PortfolioData` dalam `src/lib/content.ts` diperbarui dengan penambahan properti opsional `thumbnail?: string` dan `badge?: string` pada elemen `services.items`.
- **`AC-03`**: Komponen `src/app/_components/projects.tsx` ditingkatkan untuk merender:
  - Container thumbnail preview rasio 16:9 dengan mock header peramban (browser window frame).
  - Gambar thumbnail responsif dengan `loading="lazy"`, atribut `alt` ramah SEO/a11y, serta fallback anggun jika koneksi gambar terganggu.
  - Badge kategori produk untuk membedakan jenis aplikasi (Web POS, AI & ML, Open Source, Healthcare, dsb).
  - Backward compatibility penuh bagi proyek yang tidak memiliki thumbnail (tetap dirender dengan rapi dalam tata letak kartu ikon klasik).
  - Navigasi keyboard yang aksesibel dan link eksternal yang aman (`target="_blank"`, `rel="noopener noreferrer"`).
- **`AC-04`**: Antarmuka CMS Dashboard (`src/app/cms/cms-dashboard.tsx`) diperbarui untuk mendukung pengeditan input `thumbnail` dan `badge` pada tab Projects/Services.
- **`AC-05`**: Anti-Slop (antislop) Compliance:
  - Desain menerapkan *Purpose Test*: elevasi dan hover berfokus pada konten, tanpa efek glow/blur berlebihan.
  - Tipografi dan kontras memenuhi standar WCAG AA (rasio kontras $\ge 4.5:1$).
  - Nol anotasi penekan error (`@ts-ignore`, `eslint-disable`, dsb).
- **`AC-06`**: Quality Gate & Test Verification:
  - Seluruh unit tests Vitest lulus 100% (`bun run test`).
  - Linter ESLint lulus tanpa error (`bun run lint`).
  - Production build berhasil (`bun run build`).

---

## 3. Cross-Role Alignment Meeting Log

### 1. Sandra (QA & Security):
- **Question:** *"Bagaimana jika thumbnail eksternal (WordPress mshots atau GitHub OpenGraph) mengalami downtime, diblokir oleh ad-blocker, atau lambat dimuat? Apakah kartu proyek akan mengalami layout shift (CLS) atau tampak patah?"*
  - **Faisal (PM Decision):** Aspek rasio kontainer thumbnail harus dikunci secara tegas (`aspect-video` / 16:9) dengan skeleton placeholder / background netral, dan kartu wajib memiliki error fallback state sehingga jika gambar gagal dimuat, komponen menampilkan fallback ikonik yang elegan tanpa merusak tinggi kartu atau menyebabkan layout shift.
  - **Fiqry (Frontend):** Siap. Kita akan mengimplementasikan `ProjectThumbnail` sub-komponen dengan state `hasError` dan `isLoaded`. Saat error, kartu otomatis beralih menampilkan fallback mockup dengan icon FontAwesome dan gradien lembut yang konsisten dengan tema.

### 2. Angel (UI/UX):
- **Question:** *"Saat ada kartu dengan thumbnail gambar dan kartu lama yang hanya berformat ikon, bagaimana menjaga visual rhythm agar grid tidak terlihat jomplang?"*
  - **Angel's Explanation:** Desain kartu menggunakan flexbox vertikal seragam (`flex flex-col justify-between h-full`). Untuk kartu dengan thumbnail, thumbnail ditempatkan di bagian atas kartu menyerupai preview mini peramban. Kartu tanpa thumbnail akan menampilkan banner header berukuran sama dengan icon badge yang proporsional, atau thumbnail dapat disediakan untuk semua proyek agar keselarasan visual (rhythm) mencapai standar optimal.
  - **Faisal (PM Decision):** Sangat setuju. Prioritas utama adalah 13 web portfolio baru yang memiliki thumbnail preview resolusi tinggi, sementara kartu lama tetap didukung tanpa distorsi visual.
  - **Angel's Specification:** Warna border `border-zinc-200/80 dark:border-zinc-800/80`, radius `rounded-2xl`, thumbnail frame `rounded-xl`, badge kategori pill berukuran kecil dengan latar kontras tinggi.

### 3. Fiqry (Frontend):
- **Question:** *"Apakah kita perlu memodifikasi tipe `PortfolioData` di `src/lib/content.ts` dan bagaimana dampaknya terhadap halaman CMS Dashboard?"*
  - **Fiqry's Proposal:** Kita tambahkan field opsional `thumbnail?: string; badge?: string;` pada `PortfolioData['services']['items'][number]`. Di `src/app/cms/cms-dashboard.tsx`, kita tambahkan form input untuk Thumbnail URL dan Category Badge di bawah item proyek agar pengguna dapat mengelolanya secara dinamis.
  - **Faisal (PM Decision):** Disetujui sepenuhnya. Ini menjamin data tidak terhapus saat pengguna menyimpan perubahan dari CMS.

---

## 4. Rencana Portofolio Web (13 Proyek)

| No | Nama Proyek | URL | Kategori / Badge | Deskripsi Utama |
|---|---|---|---|---|
| 1 | **KulaPOS** | `https://kasir-web-seven.vercel.app/` | `Web POS` | Aplikasi Point of Sale modern, cepat, dan responsif untuk UMKM kuliner & coffee shop. |
| 2 | **Life Calculator Financial** | `https://financial-math-amir.vercel.app/` | `Financial Tool` | Kalkulator finansial & bisnis terintegrasi regulasi RI: BEP, BPHTB, KPR, Compound Interest, dan Depresiasi. |
| 3 | **RS Ambulatory Care** | `https://ambulatory-fawn.vercel.app/` | `Healthcare Portal` | Portal layanan rawat jalan terpadu, poliklinik spesialis, serta reservasi laboratorium & radiologi. |
| 4 | **Magic Clipper AI** | `https://clipper-magic.vercel.app/` | `AI Video Tool` | Web tool profesional untuk memotong video menjadi clip dan memprosesnya otomatis berbasis AI. |
| 5 | **PhotoBooth Pro** | `https://photobooth-six-taupe.vercel.app/` | `Photo Studio` | Aplikasi web photobooth interaktif dengan background removal, text overlays, dan stiker kreatif. |
| 6 | **Live At Probolinggo** | `https://live-at-probolinggo.vercel.app/` | `Community Portal` | Portal direktori layanan warga Probolinggo: jasa pertukangan, logistik air, dan tenaga terampil lokal. |
| 7 | **Undangan Aqiqah Alyssa** | `https://aqiqah-alyssa.vercel.app/id` | `Digital Invitation` | Platform undangan digital interaktif dan responsif untuk tasyakuran Aqiqah Alyssa Hannah Azzahrah. |
| 8 | **DocuFlip** | `https://docuflip.vercel.app/` | `Flipbook Reader` | Aplikasi web interaktif untuk membaca dokumen PDF dengan pengalaman flipbook 3D realistis. |
| 9 | **Finpro Management System** | `https://github.com/amirisback/finpro` | `Academic System` | Sistem manajemen proyek akhir & skripsi berbasis web & Android untuk bimbingan, monev, dan sidang. |
| 10 | **De Knappe** | `https://github.com/amirisback/de-knappe` | `Online Exam` | Platform ujian online dan remedial terstruktur untuk institusi pendidikan dan sekolah. |
| 11 | **Hobby Hands Recognition** | `https://amirisback.github.io/hobby-hands-recognition/` | `Computer Vision` | Web app interaktif pengenalan gestur tangan realtime menggunakan teknologi MediaPipe & Machine Learning. |
| 12 | **Wall of Fame Angel Sponsor** | `https://amirisback.github.io/wall-of-fame-angel-sponsor/` | `Open Source Showcase` | Halaman interaktif apresiasi sponsor dan donor ekosistem open-source Frogo & personal project. |
| 13 | **A Journey of Us: Amir & Septian** | `https://amirisback.github.io/propose-love/` | `Interactive Story` | Website interaktif perjalanan cinta dan kisah romantis Amir & Septian dengan animasi menawan. |
