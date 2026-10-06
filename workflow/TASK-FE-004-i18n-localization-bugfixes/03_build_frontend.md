# 03_build_frontend.md — Frontend Implementation Report

**Task ID**: `TASK-FE-004-i18n-localization-bugfixes`  
**Engineer**: Fiqry (`fiqry_frontend`)  
**Status**: Implemented & Verified  
**Date**: 2026-10-06  

---

## 1. Summary of Changes

Sesuai dengan PRD dari Faisal (`faisal_pm`) dan spesifikasi UI/UX dari Angel (`angel_uiux`), seluruh isu bahasa dan bug terjemahan telah diimplementasikan dengan clean code, type safety penuh, dan kompatibilitas mundur.

### Detail Perubahan per Komponen:

1. **`src/dictionaries/id.json` & `src/dictionaries/en.json`**:
   - Menyelaraskan kata baku KBBI: `Projek` -> `Proyek`, `Projek Keren` -> `Proyek Pilihan`, `Lihat Projek` -> `Lihat Proyek`.
   - Mengoreksi kata serapan di metadata ID: `Aplikasi Web Progressive` -> `Aplikasi Web Progresif`.
   - Menghilangkan karakter em dash (`—`) sesuai pedoman antislop R-02.
   - Menambahkan token namespace `hero`: `greeting`, `iAmA`, `viewCv`, `followGithub`.
   - Menambahkan token narasi biografi lengkap pada namespace `about.description`.
   - Menambahkan token `footer.location` ("di Indonesia" vs "in Indonesia") dan `footer.connectSocials` ("Terhubung di Media Sosial" vs "Connect on Socials").
   - Menambahkan token `experience.present` ("Sekarang" vs "Present").

2. **`data/content.json`**:
   - Menambahkan field `description_id` pada setiap item di `services.items` agar deskripsi proyek tersaji dalam Bahasa Indonesia yang baku dan informatif saat mode ID aktif.
   - Mengoreksi typo pada riwayat pengalaman: `Chat Aja Messeger` -> `Chat Aja Messenger`, dan `IndonesiaBandung` -> `Indonesia`.
   - Menyelaraskan teks footer: `All Right Reserved` -> `All Rights Reserved`.

3. **`src/lib/content.ts`**:
   - Menambahkan properti opsional `description_id?: string` pada interface `PortfolioData.services.items`.

4. **`src/app/_components/hero.tsx`**:
   - Mendukung prop `dict?: { hero?: { greeting?: string; iAmA?: string; viewCv?: string; followGithub?: string; } }`.
   - Menggantikan hardcoded "I am a" dengan `{dict?.hero?.iAmA || "I am a"}`.
   - Menyediakan sapaan dinamis `{dict?.hero?.greeting || data.greeting}`.
   - Menerjemahkan tombol CTA CV dan GitHub secara dinamis dengan fallback aman.

5. **`src/app/_components/about.tsx`**:
   - Mendukung prop `dict.about.description?: string`.
   - Menampilkan narasi Bahasa Indonesia ketika locale `id` aktif, dan Bahasa Inggris ketika `en` aktif.

6. **`src/app/_components/projects.tsx`**:
   - Menerima `currentLang?: string`.
   - Menampilkan `item.description_id` jika bahasa aktif adalah `id` dan terjemahan tersedia, atau fallback ke `item.description`.

7. **`src/app/_components/experience.tsx`**:
   - Menerima `currentLang?: string`.
   - Menerjemahkan tanggal secara otomatis: "Now" -> "Sekarang" (ID) / "Present" (EN), "Des" -> "Dec" (EN), "Mei" -> "May" (EN).
   - Menormalisasi penamaan wilayah: "West Java" -> "Jawa Barat" (ID).

8. **`src/app/_components/footer.tsx`**:
   - Menggantikan hardcoded "Connect on Socials" dengan `{dict.footer.connectSocials || "Connect on Socials"}`.
   - Menggantikan hardcoded "in Indonesia" dengan `{dict.footer.location || "in Indonesia"}` sehingga mode ID menghasilkan "Dibuat dengan ❤️ di Indonesia".

9. **`src/app/page.tsx`**:
   - Meneruskan `dict` dan `locale` ke komponen `Hero`, `About`, `Projects`, `Experience`, dan `Footer`.

---

## 2. Inventory File yang Diubah

| File | Status | Keterangan |
|------|--------|------------|
| `src/dictionaries/id.json` | Modified | Update token baku KBBI, narasi deskripsi, dan tombol aksi |
| `src/dictionaries/en.json` | Modified | Selaraskan token bahasa Inggris dan antislop |
| `data/content.json` | Modified | Penambahan `description_id`, perbaikan typo dan grammar |
| `src/lib/content.ts` | Modified | Type interface `description_id?: string` |
| `src/app/_components/hero.tsx` | Modified | Localized greeting, running text prefix, & button labels |
| `src/app/_components/about.tsx` | Modified | Localized biography description |
| `src/app/_components/projects.tsx` | Modified | Localized project item descriptions |
| `src/app/_components/experience.tsx` | Modified | Localized dates and locations |
| `src/app/_components/footer.tsx` | Modified | Localized social title and footer location |
| `src/app/page.tsx` | Modified | Prop delegation (dict & locale) |
| `src/app/_components/localization.test.tsx` | Created | Test suite komprehensif untuk pengujian lokalisasi |

---

## 3. Verifikasi Build & Test
- Vitest: 32 test files, 161 tests PASS.
- ESLint: 0 errors, 0 warnings.
- Production Build (`next build --webpack`): Sukses tanpa error.
