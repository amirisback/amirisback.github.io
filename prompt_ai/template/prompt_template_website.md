# 🌐 Prompt Template — Build Website (Next.js 16)

> Template ini digunakan untuk memberikan instruksi ke AI Agent agar membangun website
> mengikuti standar project **Amir App** (Next.js 16 + Tailwind CSS v4 + TypeScript + PWA).
>
> Isi bagian di dalam `[...]` sesuai kebutuhan.

---

## 🎯 Role & Objective

Bertindak sebagai **Senior Frontend Engineer** yang expert di:
- Next.js 16 (App Router, Server Components, React 19)
- TypeScript (Strict Mode)
- Tailwind CSS v4
- Progressive Web App (Serwist)
- SEO & Web Performance

**Objective:** Membangun website **[Nama Website]** — [Deskripsi singkat 1 kalimat].

---

## 📘 Mandatory References

**SEBELUM menulis kode apapun, WAJIB baca:**
1. `GUIDELINE.md` — Project architecture, coding standards, conventions
2. `AGENTS.md` — Next.js 16 breaking changes & rules
3. `node_modules/next/dist/docs/` — Dokumentasi API Next.js terbaru

---

## 🧠 Context

- **Project Base:** Repository ini (`Init-nextjs-app`) — sudah ter-setup dengan Next.js 16, Tailwind CSS v4, TypeScript strict, Serwist PWA
- **Target Audience:** [Siapa pengguna website ini]
- **Tujuan Bisnis:** [Apa tujuan utama website ini]
- **Referensi Desain:** [URL / nama website referensi, jika ada]

---

## 📋 Requirements

### Halaman yang dibutuhkan:
1. **Homepage** (`/`) — [Deskripsi konten homepage]
2. **[Halaman 2]** (`/path`) — [Deskripsi]
3. **[Halaman 3]** (`/path`) — [Deskripsi]

### Fitur Utama:
- [ ] [Fitur 1, misal: Dark mode toggle]
- [ ] [Fitur 2, misal: Contact form dengan validasi]
- [ ] [Fitur 3, misal: Responsive image gallery]
- [ ] [Fitur 4, misal: WhatsApp integration]

### Desain & UI:
- **Style:** [Modern/Minimalis/Glassmorphism/Corporate/dll]
- **Color Palette:** [Warna utama, misal: Biru navy + putih, atau serahkan ke AI]
- **Typography:** [Gunakan Geist (sudah setup) / font lain dari Google Fonts]
- **Layout:** Mobile-first, responsive
- **Dark Mode:** Wajib support

---

## ⚠️ Constraints & Rules

### Arsitektur:
- App Router ONLY — tidak ada `pages/` directory
- Server Components sebagai default
- `"use client"` hanya jika butuh interaktivitas (state, effects, events)
- Path alias `@/*` untuk semua import

### Kode:
- TypeScript strict — TIDAK boleh pakai `any`
- Tailwind CSS classes — TIDAK boleh inline style
- Semua halaman WAJIB punya `metadata` (title + description)
- Semantic HTML (`<main>`, `<section>`, `<article>`, `<nav>`)
- Satu `<h1>` per halaman
- Nama file: `kebab-case` untuk components, `use-*.ts` untuk hooks

### Environment Variables:
- Gunakan `NEXT_PUBLIC_` prefix untuk client-side values
- Tanpa prefix untuk server-only secrets
- Update `.env.example` jika menambah variable baru
- JANGAN hardcode URL atau API key di source code

### Performance:
- Gunakan `next/image` untuk semua gambar
- Gunakan `next/font` untuk fonts
- Lazy load komponen berat dengan `dynamic()` import

### Yang TIDAK BOLEH dilakukan:
- ❌ Menggunakan API/syntax Next.js versi lama
- ❌ Install dependency baru tanpa konfirmasi
- ❌ Menghapus/mengubah konfigurasi existing tanpa konfirmasi
- ❌ Menggunakan `useEffect` untuk data fetching
- ❌ Menulis CSS custom jika bisa pakai Tailwind

---

## 📂 Output Structure

Ikuti struktur folder berikut:

```
app/
├── layout.tsx              # Root layout (sudah ada)
├── globals.css             # Global styles (sudah ada)
├── page.tsx                # Homepage
├── [feature-name]/
│   ├── page.tsx            # Route page
│   ├── layout.tsx          # Route layout (jika perlu)
│   └── _components/        # Components khusus feature ini
│       ├── hero-section.tsx
│       └── feature-card.tsx
├── _components/            # Shared components
│   ├── header.tsx
│   ├── footer.tsx
│   └── ui/
│       ├── button.tsx
│       └── card.tsx
├── _hooks/                 # Custom hooks
│   └── use-[name].ts
└── _lib/                   # Utilities
    └── utils.ts
```

---

## 📤 Format Output

- **Bahasa:** [Indonesia / English]
- **Code:** Lengkap, production-ready, siap dijalankan (`npm run dev`)
- **Penjelasan:** Singkat — fokus di keputusan arsitektur, bukan narasi panjang
- **Urutan pengerjaan:**
  1. Setup design system di `globals.css` (colors, fonts, tokens)
  2. Buat shared components (`header`, `footer`, `button`, dll)
  3. Buat halaman satu per satu
  4. Polish: animasi, transitions, responsive check
  5. Pastikan `npm run build` sukses tanpa error

---

## 💡 Catatan Tambahan

- [Catatan khusus, misal: "Gunakan data dummy dari JSON untuk products"]
- [Catatan khusus, misal: "Website harus bisa diakses tanpa JavaScript (SSR)"]
- [Catatan khusus, misal: "Prioritaskan mobile experience"]

---

# =============================================
# CONTOH PENGGUNAAN
# =============================================

Bertindak sebagai **Senior Frontend Engineer** expert Next.js 16.

**WAJIB baca `GUIDELINE.md` dan `AGENTS.md` sebelum menulis kode.**

**Objective:** Membangun website **Warung Kopi Nusantara** — Landing page kedai kopi artisan dengan online ordering.

**Context:**
- Kedai kopi lokal di Jakarta yang ingin go digital
- Target: Anak muda 20-35 tahun, urban, mobile-first
- Referensi desain: Kopi Kenangan, Tuku Coffee

**Halaman:**
1. **Homepage** (`/`) — Hero, menu highlights, testimonials, lokasi
2. **Menu** (`/menu`) — Daftar menu dengan filter kategori
3. **About** (`/about`) — Story brand, tim, values
4. **Contact** (`/contact`) — Form kontak + embed Google Maps

**Fitur:**
- [x] Dark mode toggle
- [x] Menu filter by kategori (kopi, non-kopi, makanan)
- [x] WhatsApp order button
- [x] Responsive image gallery
- [x] Smooth scroll navigation
- [x] Loading animations

**Desain:**
- Style: Modern minimalis, warm tones
- Colors: Deep brown (#3C2415), Cream (#F5E6D3), Gold accent (#D4A574)
- Font: Geist (sudah setup)
- Dark mode wajib

**Data:** Gunakan data dummy JSON untuk menu items.

**Output:** Code lengkap TypeScript, production-ready, Bahasa Indonesia.
