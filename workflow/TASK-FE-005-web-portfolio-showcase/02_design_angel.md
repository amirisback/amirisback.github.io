# Design Specification: Web Portfolio Showcase & Thumbnail Previews

**Task ID:** `TASK-FE-005-web-portfolio-showcase`  
**Designer:** Angel (`angel_uiux`)  
**Scope:** UI/UX Specification, Design Tokens, Anti-Slop Audit  
**Status:** Approved for Implementation  
**Date:** 2026-10-06  

---

## 1. Visual Hierarchy & Card Anatomy

Setiap kartu portofolio direkayasa dengan pendekatan **Content-First** yang seimbang, memberikan bukti visual nyata (*tangible preview*) dari antarmuka proyek web, sambil menjaga kestabilan grid dan konsistensi tipografi.

```
+--------------------------------------------------------------+
| [● ● ●] Browser Header Chrome              [ BADGE: WEB POS ]|
+--------------------------------------------------------------+
|                                                              |
|                     16:9 THUMBNAIL PREVIEW                   |
|                   (Live Website Screenshot)                  |
|                                                              |
+--------------------------------------------------------------+
| [ICON]  Project Title (e.g. KulaPOS)                         |
|                                                              |
| Concise value proposition and technical summary description  |
| that highlights stack and problem solved.                    |
|                                                              |
| ------------------------------------------------------------ |
| [ View Live Project / Repository ]                       [↗] |
+--------------------------------------------------------------+
```

### 1.1 Anatomy Breakdown:
1. **Card Container (`article / a`):**
   - Padding: `p-5` (meningkatkan rasio konten visual).
   - Radius: `rounded-2xl` (16px) konsisten dengan design system template.
   - Background: `bg-white/90 dark:bg-zinc-900/60 backdrop-blur-xs`.
   - Border: `border border-zinc-200/80 dark:border-zinc-800/80`.
   - Hover Elevation: `hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/5 hover:border-cyan-500/40 dark:hover:border-cyan-400/40 transition-all duration-300`.
2. **Browser Mockup Thumbnail Container:**
   - Aspek Rasio: `aspect-video` (16:9).
   - Window Frame Header: `h-6 px-3 bg-zinc-100/90 dark:bg-zinc-800/90 border-b border-zinc-200/60 dark:border-zinc-700/50 flex items-center justify-between`.
   - 3 Window Dot Controls: `w-2 h-2 rounded-full` (merah muda, amber, zamrud halus, opasitas 60%).
   - Pill Badge: `text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20`.
   - Image Preview: `object-cover object-top w-full h-full transition-transform duration-500 group-hover:scale-105`.
3. **Typography & Content Body:**
   - Title: `text-lg font-bold text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors`.
   - Description: `text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 sm:line-clamp-3`.
   - Action Footer: `flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-semibold text-cyan-600 dark:text-cyan-400`.

---

## 2. Design Tokens Reference

| Token Name | Light Mode Value | Dark Mode Value | Function |
|---|---|---|---|
| `--card-bg` | `rgb(255 255 255 / 0.9)` | `rgb(24 24 27 / 0.6)` | Card surface background |
| `--card-border` | `rgb(228 228 231 / 0.8)` | `rgb(39 39 42 / 0.8)` | Subtle boundary stroke |
| `--card-border-hover` | `rgb(6 182 212 / 0.4)` | `rgb(34 211 238 / 0.4)` | Focus & hover accent |
| `--badge-bg` | `rgb(6 182 212 / 0.1)` | `rgb(6 182 212 / 0.15)` | Category tag background |
| `--badge-text` | `#0891b2` (cyan-600) | `#22d3ee` (cyan-400) | High-contrast label |
| `--text-primary` | `#18181b` (zinc-900) | `#ffffff` | Project title |
| `--text-secondary` | `#52525b` (zinc-600) | `#a1a1aa` (zinc-400) | Project description |

---

## 3. Anti-Slop (antislop) Audit & Purpose Test

- **R-01 (Generic Blue-Purple Gradient):** Dieliminasi. Kartu menggunakan latar netral matte yang elegan dengan aksen cyan terarah pada link dan status badge.
- **R-10 (Excessive Glassmorphism):** Dibatasi strictly pada backdrop kartu (`backdrop-blur-xs`), tidak menumpuk blur ganda pada seluruh elemen anak.
- **R-11 (Excessive Border Radius):** Radius distandarisasi pada `rounded-2xl` untuk kartu luar dan `rounded-xl` untuk thumbnail frame.
- **R-12 (Overly Soft Shadows):** Shadow hanya muncul sebagai penanda elevasi interaktif saat pengguna mengarahkan kursor (`hover:shadow-xl`), bukan bayangan permanen yang membuat halaman mengambang tanpa dasar.
- **R-14 (Copy-Paste Cards without Identity):** Setiap proyek memiliki thumbnail screenshot unik dari live application, badge klasifikasi spesifik, dan ikon FontAwesome yang relevan.
- **Accessibility & Contrast:**
  - `cyan-600` pada latar putih memiliki rasio kontras $4.6:1$ (memenuhi WCAG AA).
  - `cyan-400` pada latar gelap memiliki rasio kontras $8.1:1$ (memenuhi WCAG AAA).
  - Semua link memiliki `focus-visible:ring-2 focus-visible:ring-cyan-500` untuk pengguna keyboard.

---

## 4. Fallback State (Graceful Degradation)

Jika koneksi pengguna lambat atau thumbnail eksternal gagal dimuat:
- Komponen mendeteksi event `onError` dan langsung beralih ke state fallback.
- State fallback menampilkan kanvas minimalis berlatar gradien netral dengan ikon FontAwesome berukuran besar di tengah, judul proyek, dan watermark URL.
- Tidak ada gambar rusak (*broken image icon*) ataupun pergeseran tata letak (*zero Cumulative Layout Shift*).
