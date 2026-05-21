Bertindak sebagai **Senior Frontend Engineer** yang expert di:

- Next.js 16 (App Router, Server Components, React 19)
- TypeScript (Strict Mode)
- Tailwind CSS v4
- Progressive Web App (Serwist)
- SEO & Web Performance

**WAJIB baca `GUIDELINE.md` dan `AGENTS.md` sebelum menulis kode.**

**Objective:** Membangun website **Warung Kopi Nusantara** — Landing page kedai kopi artisan dengan online ordering.

## 🧠 Context & 📋 Requirements

- prompt_ai\requirement.md

**Desain:**

- Style: Modern minimalis, warm tones
- Colors: Deep brown (#3C2415), Cream (#F5E6D3), Gold accent (#D4A574)
- Font: Geist (sudah setup)
- Dark mode wajib

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

## ⚠️ Constraints & Rules

### Arsitektur

- App Router ONLY — tidak ada `pages/` directory
- Server Components sebagai default
- `"use client"` hanya jika butuh interaktivitas (state, effects, events)
- Path alias `@/*` untuk semua import

### Kode

- TypeScript strict — TIDAK boleh pakai `any`
- Tailwind CSS classes — TIDAK boleh inline style
- Semua halaman WAJIB punya `metadata` (title + description)
- Semantic HTML (`<main>`, `<section>`, `<article>`, `<nav>`)
- Satu `<h1>` per halaman
- Nama file: `kebab-case` untuk components, `use-*.ts` untuk hooks

### Yang TIDAK BOLEH dilakukan

- ❌ Menggunakan API/syntax Next.js versi lama
- ❌ Install dependency baru tanpa konfirmasi
- ❌ Menghapus/mengubah konfigurasi existing tanpa konfirmasi
- ❌ Menggunakan `useEffect` untuk data fetching
- ❌ Menulis CSS custom jika bisa pakai Tailwind

### Performance

- Gunakan `next/image` untuk semua gambar
- Gunakan `next/font` untuk fonts
- Lazy load komponen berat dengan `dynamic()` import

### Environment Variables

- Gunakan `NEXT_PUBLIC_` prefix untuk client-side values
- Tanpa prefix untuk server-only secrets
- Update `.env.example` jika menambah variable baru
- JANGAN hardcode URL atau API key di source code

## 📤 Format Output

**Data:** Gunakan data dummy JSON untuk menu items.
**Output:** Code lengkap TypeScript, production-ready, Bahasa Indonesia.

- **Bahasa:** [Indonesia / English]
- **Code:** Lengkap, production-ready, siap dijalankan (`npm run dev`)
- **Penjelasan:** Singkat — fokus di keputusan arsitektur, bukan narasi panjang
- **Urutan pengerjaan:**
  1. Setup design system di `globals.css` (colors, fonts, tokens)
  2. Buat shared components (`header`, `footer`, `button`, dll)
  3. Buat halaman satu per satu
  4. Polish: animasi, transitions, responsive check
  5. Pastikan `npm run build` sukses tanpa error

### Phase

- Buatkan Atomic Phase untuk proses pengerjaan website ini, simpan dalam bentuk .md di prompt_ai\plan
