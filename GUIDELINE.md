# 📘 Project Guidelines — Muhammad Faisal Amir

> **⚠️ MANDATORY: Semua AI Agent WAJIB membaca file ini sebelum menulis kode apapun.**

---

## 1. Project Overview

| Key            | Value                                    |
| -------------- | ---------------------------------------- |
| **App Name**   | Muhammad Faisal Amir                     |
| **Framework**  | Next.js 16.2.6 (App Router)              |
| **React**      | React 19                                 |
| **Language**   | TypeScript 6 (Strict Mode)               |
| **Styling**    | Tailwind CSS v4.3                        |
| **PWA**        | Serwist v9.5                             |
| **Linting**    | ESLint v10 + eslint-config-next          |
| **Node**       | ≥ 18                                     |
| **Package Mgr**| Bun                                      |

---

## 2. ⚠️ Next.js 16 — Breaking Changes

```
‼️ JANGAN gunakan pengetahuan lama tentang Next.js.
   Versi ini memiliki breaking changes.
   SELALU baca docs di: node_modules/next/dist/docs/
   sebelum menulis kode apapun.
```

### Yang harus diperhatikan:
- **App Router ONLY** — Tidak ada `pages/` directory
- **React 19** — Gunakan fitur terbaru (Server Components default)
- **Metadata API** — Gunakan `export const metadata` atau `generateMetadata()`
- **Font Loading** — Gunakan `next/font/google` (sudah setup: Geist, Geist_Mono)
- **Image Component** — Gunakan `next/image` dengan prop terbaru
- **Cek deprecation notices** — Ikuti warning dari Next.js

---

## 3. Folder Structure

```
Init-nextjs-app/
├── src/                        # 📂 Semua source code disatukan di dalam src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout (html lang, metadata, theme init)
│   │   ├── page.tsx            # Homepage (i18n tanpa prefix route)
│   │   ├── globals.css         # Global styles + Tailwind config (@theme inline)
│   │   ├── manifest.ts         # PWA manifest
│   │   ├── sw.ts               # Service Worker (Serwist)
│   │   ├── robots.ts           # Robots.txt generator
│   │   ├── sitemap.ts          # Sitemap generator
│   │   ├── favicon.ico
│   │   ├── _components/        # App-wide UI components (Navbar, Hero, About, dll.)
│   │   ├── _hooks/             # Custom React hooks (use-theme)
│   │   ├── api/                # API routes (api/content)
│   │   └── cms/                # CMS Visual Editor Dashboard
│   ├── dictionaries/           # Translation files
│   │   ├── id.json             # 🇮🇩 Bahasa Indonesia (default)
│   │   └── en.json             # 🇬🇧 English
│   ├── i18n/                   # i18n configuration
│   │   └── config.ts           # Locale list & types
│   ├── lib/                    # Shared utilities
│   │   ├── content.ts          # Data content reader & writer
│   │   ├── crypto.ts           # Enkripsi & Dekripsi AES-256-GCM (server-only)
│   │   ├── dictionaries.ts     # Dictionary loader (server-only)
│   │   ├── i18n-actions.ts     # Server Action pengubah cookie NEXT_LOCALE
│   │   ├── i18n-server.ts      # Cookie-based locale retriever (server-only)
│   │   ├── obfuscator.ts       # Penyamaran & Deobfuscation ID Sqids
│   │   ├── rate-limiter.ts     # Sliding window rate limiter
│   │   ├── security-guards.ts  # Scanner & bot filter
│   │   ├── seo.ts              # SEO helpers & JSON-LD
│   │   └── theme-init.ts       # Anti-FOUC theme initialization script
│   └── proxy.ts                # Pass-through & security middleware proxy
├── data/                       # Portfolio content data (content.json)
├── public/                     # Static assets & PWA icons
├── prompt_ai/                  # AI prompt templates (bukan source code)
├── .env                        # Common env (semua environment)
├── .env.development            # Dev-only env overrides
├── .env.production             # Prod-only env overrides
├── .env.example                # Template referensi (committed ke git)
├── AGENTS.md                   # AI Agent rules (Next.js specific)
├── GUIDELINE.md                # 📌 File ini — project guidelines
├── vitest.config.ts            # 🧪 Vitest configuration
├── vitest.setup.ts             # 🧪 Vitest setup (jest-dom matchers)
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript config (alias @/* -> ./src/*)
├── eslint.config.mjs           # ESLint config
├── postcss.config.mjs          # PostCSS config (Tailwind)
└── package.json
```

### Konvensi Penamaan Folder Baru:
- **Feature/Module** → `src/app/feature-name/`
- **Components** → `src/app/_components/` atau co-locate
- **Hooks** → `src/app/_hooks/` atau co-locate dengan feature
- **Utils/Lib** → `src/lib/`
- **Types** → `src/types/` atau co-locate

---

## 4. Environment Variables

### File Priority (urutan loading Next.js):
1. `.env` — Base/common (selalu di-load)
2. `.env.development` — Override untuk `NODE_ENV=development`
3. `.env.production` — Override untuk `NODE_ENV=production`
4. `.env.local` — Override tertinggi, TIDAK committed

### Aturan Naming:
| Prefix              | Accessible di          | Contoh                          |
| ------------------- | ---------------------- | ------------------------------- |
| `NEXT_PUBLIC_`      | Client + Server        | `NEXT_PUBLIC_APP_URL`           |
| Tanpa prefix        | **Server ONLY**        | `DATABASE_URL`, `AUTH_SECRET`   |

### ⚠️ JANGAN PERNAH:
- Menyimpan secret/key di file dengan prefix `NEXT_PUBLIC_`
- Hardcode URL atau API key langsung di source code
- Commit `.env.local` ke git

---

## 5. Coding Standards

### TypeScript
- **Strict mode ON** — Tidak boleh menggunakan `any` tanpa justifikasi
- Gunakan **interface** untuk object shapes, **type** untuk unions/intersections
- Semua function harus memiliki return type yang eksplisit (kecuali JSX components)
- Gunakan **path alias** `@/*` (mengarah ke `./src/*`)

```typescript
// ✅ Benar
import { Navbar } from "@/app/_components/navbar";

// ❌ Salah
import { Navbar } from "../../../_components/navbar";
```

### React / Next.js
- **Server Components** adalah default — Hanya gunakan `"use client"` jika benar-benar butuh interaktivitas (state, effects, event handlers)
- Gunakan **`async` Server Components** untuk data fetching langsung
- **JANGAN** gunakan `useEffect` untuk data fetching — gunakan Server Components atau Server Actions
- Pisahkan komponen besar menjadi komponen kecil yang reusable

---

## 6. Styling — Tailwind CSS v4

### Setup yang sudah ada:
- `globals.css` menggunakan `@import "tailwindcss"` (Tailwind v4 syntax)
- `@custom-variant dark (&:where(.dark, .dark *));` untuk class-based dark mode
- CSS variables untuk theming (`--background`, `--foreground`)
- `@theme inline` block untuk custom design tokens
- Anti-FOUC theme script di `src/lib/theme-init.ts`

### Aturan:
- **Gunakan Tailwind classes** — Hindari inline style
- **Gunakan CSS variables** di `@theme inline` untuk custom values
- **Dark mode** harus selalu di-support
- **Responsive design** — Mobile-first approach (`sm:`, `md:`, `lg:`)
- **JANGAN** install Tailwind plugins tanpa konfirmasi user

---

## 7. PWA (Progressive Web App)

### Setup:
- **Serwist v9** untuk Service Worker
- `src/app/sw.ts` — Service Worker source
- `src/app/manifest.ts` — Web App Manifest
- PWA di-disable saat development (`next.config.ts`)

---

## 8. Internationalization (i18n)

### Arsitektur:
Project ini menggunakan **Cookie & Localization-based native i18n** tanpa meletakkan locale di URL path:
- **Tanpa prefix routing (`[lang]`)** — URL tetap bersih (`/`, `/cms`). Pergantian bahasa **TIDAK MENGUBAH URL / ROUTE**.
- **Cookie `NEXT_LOCALE`** — Menyimpan preferensi bahasa pengguna (`id` atau `en`).
- **`i18n-server.ts`** — Helper server-side untuk membaca cookie `NEXT_LOCALE` dan memuat dictionary terkait (`getCurrentLocale()`, `getCurrentDictionary()`).
- **`i18n-actions.ts`** — Server Action `setLocaleAction(locale)` untuk menyimpan preferensi ke cookie `NEXT_LOCALE` (`maxAge: 1 tahun`, `path: "/"`, `sameSite: "lax"`).
- **`Navbar` / `LanguageSwitcher`** — Client component yang memanggil `setLocaleAction(newLang)` di dalam `startTransition` lalu menjalankan `router.refresh()`.

### Locales:
| Locale | Bahasa              | Default |
| ------ | ------------------- | ------- |
| `id`   | 🇮🇩 Bahasa Indonesia | ✅ Ya   |
| `en`   | 🇬🇧 English          | ❌ Tidak|

### File Structure:
```
src/i18n/config.ts            # Locale list & Locale type
src/dictionaries/id.json       # Translations (ID)
src/dictionaries/en.json       # Translations (EN)
src/lib/dictionaries.ts        # Dictionary loader (server-only)
src/lib/i18n-server.ts        # Server locale & dictionary fetcher
src/lib/i18n-actions.ts       # Server Action for setting locale cookie
src/app/_components/language-switcher.tsx # UI Switcher Component
```

### Cara Menggunakan di Server Component:
```typescript
import { getCurrentDictionary } from "@/lib/i18n-server";

export default async function Page() {
  const { locale, dict } = await getCurrentDictionary();

  return <h1>{dict.home.title}</h1>;
}
```

### ⚠️ Aturan i18n:
- **JANGAN** membuat dynamic route folder `app/[lang]/`
- **Gunakan `getCurrentDictionary()`** pada Server Components untuk mengambil `locale` dan `dict`
- **Dictionary hanya di server** — gunakan `import "server-only"` 
- **Ganti bahasa tanpa ubah route** — gunakan Server Action `setLocaleAction()` dan `router.refresh()`

---

## 9. Performance & SEO

### Wajib dilakukan:
- Gunakan **`next/image`** untuk semua gambar
- Gunakan **`next/font`** untuk fonts (sudah setup Geist)
- Set **`metadata`** di setiap `layout.tsx` / `page.tsx`
- Gunakan **semantic HTML** (`<main>`, `<section>`, `<article>`, dsb)
- Satu `<h1>` per halaman
- **Lazy load** komponen berat dengan `dynamic()` import

---

## 10. Unit Testing

### Framework & Setup
| Key                | Value                                        |
| ------------------ | -------------------------------------------- |
| **Test Runner**    | Vitest                                       |
| **UI Testing**     | React Testing Library (`@testing-library/react`) |
| **Coverage**       | `@vitest/coverage-v8`                        |
| **Config**         | `vitest.config.ts` di root project           |

### Aturan Wajib:
```
‼️ SETIAP fungsi yang di-export HARUS memiliki unit test.
   Tidak boleh push kode tanpa test yang meng-cover fungsi tersebut.
```
- Co-locate test files — `*.test.ts(x)` di samping source file (atau di `__tests__/`).
- Target coverage ≥ 80%.

---

## 11. Commands Reference

| Command              | Fungsi                                  |
| -------------------- | --------------------------------------- |
| `bun run dev`        | Jalankan dev server (dengan webpack)    |
| `bun run build`      | Build production bundle (dengan webpack)|
| `bun start`          | Jalankan production server              |
| `bun run lint`       | Jalankan ESLint                         |
| `bun test`           | Jalankan unit test                      |
| `bun run test`       | Jalankan Vitest                         |
| `bun run test:cov`   | Jalankan Vitest dengan coverage report  |

---

## 12. Checklist Sebelum Push

- [ ] `bun run test` — Semua test PASS
- [ ] `bun run lint` — Tidak ada error
- [ ] `bun run build` — Build sukses tanpa error
- [ ] Pergantian bahasa berfungsi tanpa mengubah URL
- [ ] Dark mode berfungsi dengan baik
- [ ] Responsive di mobile dan desktop
