# 📘 Project Guidelines — Amir App

> **⚠️ MANDATORY: Semua AI Agent WAJIB membaca file ini sebelum menulis kode apapun.**

---

## 1. Project Overview

| Key            | Value                                    |
| -------------- | ---------------------------------------- |
| **App Name**   | Amir App                                 |
| **Framework**  | Next.js 16.2.6 (App Router)              |
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
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (minimal wrapper)
│   ├── globals.css             # Global styles + Tailwind config
│   ├── manifest.ts             # PWA manifest
│   ├── sw.ts                   # Service Worker (Serwist)
│   ├── favicon.ico
│   └── [lang]/                 # 🌐 Dynamic locale segment
│       ├── layout.tsx          # Locale-aware layout (html lang, metadata)
│       ├── page.tsx            # Homepage (i18n)
│       └── dictionaries.ts    # Dictionary loader (server-only)
├── i18n/                       # i18n configuration
│   ├── config.ts              # Locale list & types
│   └── config.test.ts         # 🧪 Unit test for config
├── lib/                        # Shared utilities
│   ├── seo.ts                 # SEO helpers
│   └── seo.test.ts            # 🧪 Unit test for seo
├── dictionaries/               # Translation files
│   ├── id.json                # 🇮🇩 Bahasa Indonesia (default)
│   └── en.json                # 🇬🇧 English
├── proxy.ts                    # Locale detection & redirect (replaces middleware)
├── proxy.test.ts               # 🧪 Unit test for proxy
├── public/                     # Static assets
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
├── tsconfig.json               # TypeScript config
├── eslint.config.mjs           # ESLint config
├── postcss.config.mjs          # PostCSS config (Tailwind)
└── package.json
```

### Konvensi Penamaan Folder Baru:
- **Feature/Module** → `app/[lang]/(group)/feature-name/`
- **Components** → `app/[lang]/_components/` atau co-locate
- **Hooks** → `app/_hooks/` atau co-locate dengan feature
- **Utils/Lib** → `lib/` di root
- **Types** → `types/` di root atau co-locate

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
- Gunakan **path alias** `@/*` (sudah di-setup di tsconfig)

```typescript
// ✅ Benar
import { SomeComponent } from "@/app/_components/some-component";

// ❌ Salah
import { SomeComponent } from "../../../_components/some-component";
```

### React / Next.js
- **Server Components** adalah default — Hanya gunakan `"use client"` jika benar-benar butuh interaktivitas (state, effects, event handlers)
- Gunakan **`async` Server Components** untuk data fetching langsung
- **JANGAN** gunakan `useEffect` untuk data fetching — gunakan Server Components atau Server Actions
- Pisahkan komponen besar menjadi komponen kecil yang reusable

### File Naming
| Tipe         | Format              | Contoh                    |
| ------------ | ------------------- | ------------------------- |
| Route Page   | `page.tsx`          | `app/about/page.tsx`      |
| Layout       | `layout.tsx`        | `app/dashboard/layout.tsx`|
| Component    | `kebab-case.tsx`    | `user-card.tsx`           |
| Hook         | `use-*.ts`          | `use-auth.ts`             |
| Utility      | `kebab-case.ts`     | `format-date.ts`          |
| Type         | `kebab-case.ts`     | `user-types.ts`           |
| Constant     | `UPPER_SNAKE_CASE`  | `API_ENDPOINTS`           |
| Test         | `*.test.ts(x)`      | `seo.test.ts`             |

---

## 6. Styling — Tailwind CSS v4

### Setup yang sudah ada:
- `globals.css` menggunakan `@import "tailwindcss"` (Tailwind v4 syntax)
- CSS variables untuk theming (`--background`, `--foreground`)
- `@theme inline` block untuk custom design tokens
- Dark mode via `prefers-color-scheme`

### Aturan:
- **Gunakan Tailwind classes** — Hindari inline style
- **Gunakan CSS variables** di `@theme inline` untuk custom values
- **Dark mode** harus selalu di-support
- **Responsive design** — Mobile-first approach (`sm:`, `md:`, `lg:`)
- **JANGAN** install Tailwind plugins tanpa konfirmasi user

```css
/* ✅ Tambah design token baru di globals.css */
@theme inline {
  --color-primary: #your-color;
  --color-background: var(--background);
}
```

---

## 7. PWA (Progressive Web App)

### Setup:
- **Serwist v9** untuk Service Worker
- `app/sw.ts` — Service Worker source
- `app/manifest.ts` — Web App Manifest
- PWA di-disable saat development (`next.config.ts`)

### Aturan:
- Update `manifest.ts` jika mengubah app name, icon, atau theme
- Jangan edit `sw.ts` kecuali butuh custom caching strategy
- Icon PWA harus tersedia di `/public/`
- Test PWA di production build (`bun run build && bun start`)

---

## 8. Internationalization (i18n)

### Arsitektur:
Project ini menggunakan **native Next.js 16 i18n** dengan pattern:
- **`[lang]` dynamic segment** — Semua route ada di `app/[lang]/`
- **`proxy.ts`** — Menggantikan `middleware.ts` (deprecated di Next.js 16) untuk deteksi locale dan redirect
- **Dictionary pattern** — JSON files untuk translations, loaded server-side

### Locales:
| Locale | Bahasa              | Default |
| ------ | ------------------- | ------- |
| `id`   | 🇮🇩 Bahasa Indonesia | ✅ Ya   |
| `en`   | 🇬🇧 English          | ❌ Tidak|

### File Structure:
```
i18n/config.ts            # Locale list & Locale type
dictionaries/id.json       # Translations (ID)
dictionaries/en.json       # Translations (EN)
app/[lang]/dictionaries.ts # Dictionary loader (server-only)
proxy.ts                   # Locale detection & redirect
```

### Cara Menggunakan di Server Component:
```typescript
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return <h1>{dict.home.title}</h1>;
}
```

### Cara Menambahkan Translation Baru:
1. Tambahkan key baru di **kedua** file: `dictionaries/id.json` dan `dictionaries/en.json`
2. Gunakan nested object untuk grouping (misal: `nav.home`, `error.notFound`)
3. **JANGAN** hardcode string UI — selalu gunakan dictionary

### Cara Menambahkan Locale Baru:
1. Update `i18n/config.ts` — tambahkan locale ke array `locales`
2. Buat file `dictionaries/{locale}.json` dengan semua key yang sama
3. Update `app/[lang]/dictionaries.ts` — tambahkan import baru
4. Update `proxy.ts` matcher jika perlu

### ⚠️ Aturan i18n:
- **Semua route HARUS** ada di bawah `app/[lang]/`
- **Gunakan `PageProps<"/[lang]">`** dan `LayoutProps<"/[lang]">` untuk typing
- **Selalu validasi locale** dengan `hasLocale()` + `notFound()`
- **Dictionary hanya di server** — gunakan `import "server-only"` 
- **JANGAN** import dictionary di client component — pass translations sebagai props

---

## 9. Performance & SEO

### Wajib dilakukan:
- Gunakan **`next/image`** untuk semua gambar
- Gunakan **`next/font`** untuk fonts (sudah setup Geist)
- Set **`metadata`** di setiap `layout.tsx` / `page.tsx`
- Gunakan **semantic HTML** (`<main>`, `<section>`, `<article>`, dsb)
- Satu `<h1>` per halaman
- **Lazy load** komponen berat dengan `dynamic()` import

### Metadata Template:
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title — Amir App",
  description: "Deskripsi halaman yang informatif",
};
```

---

## 10. Git Conventions

### Branch Naming:
```
feature/nama-fitur
fix/deskripsi-bug
chore/deskripsi-task
```

### Commit Message Format:
```
type(scope): description

feat(auth): add login page
fix(dashboard): resolve chart rendering
chore(deps): update next.js to 16.x
style(ui): adjust header spacing
```

### Yang TIDAK boleh di-commit:
- `node_modules/`
- `.next/`
- `.env.local`
- File temporary / scratch

### Yang BOLEH di-commit:
- `.env` (common, tanpa secrets)
- `.env.development` (tanpa secrets)
- `.env.production` (tanpa secrets — secrets via hosting platform)
- `.env.example` (template referensi)

---

## 11. Unit Testing

### Framework & Setup

| Key                | Value                                        |
| ------------------ | -------------------------------------------- |
| **Test Runner**    | Vitest                                       |
| **UI Testing**     | React Testing Library (`@testing-library/react`) |
| **Coverage**       | `@vitest/coverage-v8`                        |
| **Config**         | `vitest.config.ts` di root project           |

### Setup Vitest Config:
```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["lib/**", "app/**", "i18n/**"],
      exclude: ["**/*.d.ts", "**/node_modules/**"],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

```typescript
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

### Aturan Wajib:

```
‼️ SETIAP fungsi yang di-export HARUS memiliki unit test.
   Tidak boleh push kode tanpa test yang meng-cover fungsi tersebut.
```

1. **Setiap file utility/helper** (`lib/*.ts`, `i18n/*.ts`) → WAJIB punya file test
2. **Setiap custom hook** (`use-*.ts`) → WAJIB punya file test
3. **Setiap fungsi di proxy/middleware** → WAJIB punya file test
4. **Component logic** (non-trivial) → WAJIB punya file test
5. **Minimum coverage target** → **80%** (statements, branches, functions, lines)

### File Naming & Lokasi:

| Source File              | Test File                        | Lokasi          |
| ------------------------ | -------------------------------- | --------------- |
| `lib/seo.ts`             | `lib/seo.test.ts`                | Co-locate       |
| `lib/format-date.ts`     | `lib/format-date.test.ts`        | Co-locate       |
| `i18n/config.ts`         | `i18n/config.test.ts`            | Co-locate       |
| `proxy.ts`               | `proxy.test.ts`                  | Co-locate       |
| `app/_hooks/use-auth.ts` | `app/_hooks/use-auth.test.ts`    | Co-locate       |
| `app/.../user-card.tsx`  | `app/.../user-card.test.tsx`     | Co-locate       |

> **Prinsip:** Test file SELALU co-locate (satu folder) dengan source file.

### Test Structure — AAA Pattern:

```typescript
import { describe, it, expect, vi } from "vitest";

describe("functionName", () => {
  it("should [expected behavior] when [condition]", () => {
    // Arrange — setup data dan dependencies
    const input = "test-input";

    // Act — jalankan fungsi yang ditest
    const result = functionName(input);

    // Assert — verifikasi hasil
    expect(result).toBe("expected-output");
  });
});
```

### Contoh Test — SEO Helpers (`lib/seo.test.ts`):

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateAlternates,
  generateOgMetadata,
  generateTwitterMetadata,
  generateWebsiteJsonLd,
  generateOrganizationJsonLd,
  generatePageSeo,
  seoConfig,
} from "./seo";

describe("generateAlternates", () => {
  it("should generate canonical URL with default locale", () => {
    const result = generateAlternates("/about");
    expect(result.canonical).toContain(`/${seoConfig.defaultLocale}/about`);
  });

  it("should include all supported locales in languages", () => {
    const result = generateAlternates("/about");
    for (const locale of seoConfig.locales) {
      expect(result.languages[locale]).toBeDefined();
    }
  });
});

describe("generateOgMetadata", () => {
  it("should return correct OG locale for id", () => {
    const result = generateOgMetadata({
      title: "Test",
      description: "Desc",
      locale: "id",
    });
    expect(result?.locale).toBe("id_ID");
  });

  it("should return correct OG locale for en", () => {
    const result = generateOgMetadata({
      title: "Test",
      description: "Desc",
      locale: "en",
    });
    expect(result?.locale).toBe("en_US");
  });
});

describe("generatePageSeo", () => {
  it("should set noIndex robots when noIndex is true", () => {
    const result = generatePageSeo({
      title: "Test",
      description: "Desc",
      locale: "id",
      noIndex: true,
    });
    expect(result.robots).toEqual({ index: false, follow: false });
  });
});
```

### Contoh Test — i18n Config (`i18n/config.test.ts`):

```typescript
import { describe, it, expect } from "vitest";
import { i18n } from "./config";
import type { Locale } from "./config";

describe("i18n config", () => {
  it("should have 'id' as default locale", () => {
    expect(i18n.defaultLocale).toBe("id");
  });

  it("should include all required locales", () => {
    expect(i18n.locales).toContain("id");
    expect(i18n.locales).toContain("en");
  });

  it("should have default locale included in locales array", () => {
    expect(i18n.locales).toContain(i18n.defaultLocale);
  });
});
```

### Mocking Patterns:

```typescript
// Mock environment variables
vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://test.com");

// Mock module
vi.mock("@/i18n/config", () => ({
  i18n: { defaultLocale: "id", locales: ["id", "en"] },
}));

// Mock Next.js modules
vi.mock("next/server", () => ({
  NextResponse: {
    redirect: vi.fn((url) => ({ redirectUrl: url })),
  },
}));

// Mock fetch / external calls
const mockFetch = vi.fn();
global.fetch = mockFetch;
```

### ⚠️ JANGAN:
- **JANGAN** menulis test tanpa assertion — setiap `it()` HARUS punya `expect()`
- **JANGAN** test implementation details — test behavior/output
- **JANGAN** skip test tanpa komentar alasan (`it.skip` butuh TODO comment)
- **JANGAN** hardcode URL/values yang sudah ada di config — import dari source
- **JANGAN** mock terlalu banyak — lebih baik test integrasi jika memungkinkan

---

## 12. Commands Reference

| Command              | Fungsi                                  |
| -------------------- | --------------------------------------- |
| `bun run dev`        | Jalankan dev server (dengan webpack)    |
| `bun run build`      | Build production bundle (dengan webpack)|
| `bun start`          | Jalankan production server              |
| `bun run lint`       | Jalankan ESLint                         |
| `bun test`           | Jalankan semua unit test                |
| `bun run test:watch` | Jalankan test dalam watch mode          |
| `bun run test:cov`   | Jalankan test dengan coverage report    |
| `bun install`        | Install semua dependencies              |
| `bun add <pkg>`      | Tambah dependency baru                  |
| `bun add -d <pkg>`   | Tambah dev dependency baru              |

> **Note:** Flag `--webpack` sudah di-set di `package.json` scripts.

---

## 13. Checklist Sebelum Push

- [ ] `bun test` — Semua test PASS
- [ ] `bun run test:cov` — Coverage ≥ 80%
- [ ] `bun run lint` — Tidak ada error
- [ ] `bun run build` — Build sukses tanpa error
- [ ] Tidak ada `console.log` yang tertinggal (gunakan `LOG_LEVEL`)
- [ ] Semua halaman punya metadata (title, description)
- [ ] Dark mode berfungsi dengan baik
- [ ] Responsive di mobile dan desktop
- [ ] Environment variables baru sudah ditambahkan ke `.env.example`
- [ ] Translation tersedia di semua locale (`id.json` & `en.json`)
- [ ] Setiap fungsi baru yang di-export memiliki unit test

---

## 14. Rules untuk AI Agent

### ✅ HARUS:
1. **Baca `AGENTS.md`** dan **`GUIDELINE.md`** sebelum menulis kode
2. **Baca Next.js 16 docs** di `node_modules/next/dist/docs/` untuk fitur yang akan digunakan
3. **Gunakan TypeScript strict** — no implicit any
4. **Gunakan path alias** `@/*`
5. **Support dark mode** di semua UI yang dibuat
6. **Gunakan Server Components** sebagai default
7. **Tambahkan metadata** di setiap halaman baru
8. **Update `.env.example`** jika menambah env variable baru
9. **Tambahkan translations** di kedua locale file (`id.json` & `en.json`)
10. **Buat semua route** di bawah `app/[lang]/`
11. **Buat unit test** untuk setiap fungsi/hook/utility baru yang di-export
12. **Jalankan `bun test`** sebelum menganggap task selesai
13. **Gunakan AAA pattern** (Arrange-Act-Assert) di setiap test case
14. **Co-locate test files** — `*.test.ts(x)` di samping source file

### ❌ JANGAN:
1. **JANGAN** menggunakan `pages/` directory
2. **JANGAN** menggunakan API/syntax Next.js versi lama tanpa verifikasi
3. **JANGAN** hardcode values yang seharusnya di environment variable
4. **JANGAN** menggunakan `"use client"` tanpa alasan yang jelas
5. **JANGAN** menginstall dependency baru tanpa konfirmasi user
6. **JANGAN** menghapus atau mengubah konfigurasi existing tanpa konfirmasi
7. **JANGAN** menggunakan `any` type
8. **JANGAN** menulis CSS inline — gunakan Tailwind classes
9. **JANGAN** hardcode string UI — gunakan dictionary i18n
10. **JANGAN** menggunakan `middleware.ts` — sudah deprecated, gunakan `proxy.ts`
11. **JANGAN** push kode tanpa unit test — setiap fungsi yang di-export WAJIB punya test
12. **JANGAN** menulis test tanpa assertion — setiap `it()` HARUS punya `expect()`
13. **JANGAN** mock terlalu banyak — test real behavior jika memungkinkan

---

> 📅 Last updated: 2026-05-17

