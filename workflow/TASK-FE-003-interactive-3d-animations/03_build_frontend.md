# Build Documentation: Interactive 3D Animations & Kinetic Depth System

**Task ID:** `TASK-FE-003-interactive-3d-animations`  
**Developer:** Fiqry (`fiqry_frontend`)  
**Scope:** Frontend Implementation, React 19 Components & 3D Math  
**Status:** Implemented & Verified  
**Date:** 2026-10-06  

---

## 1. Summary of Changes

### 1.1 New Component: `TiltCard3D` (`src/app/_components/tilt-card-3d.tsx`)
- Dibuat sebagai komponen interaktif client-side (`"use client"`) yang reusable.
- Menghitung koordinat pointer relatif terhadap batas bounding box elemen untuk menentukan derajat `rotateX` dan `rotateY` secara proporsional.
- Mendukung fitur specular glare dinamis (`radial-gradient` yang bergerak mengikuti kursor).
- Mengintegrasikan deteksi aksesibilitas native `window.matchMedia('(prefers-reduced-motion: reduce)')` untuk menonaktifkan transform jika pengguna menghendaki.
- Dilengkapi unit test komprehensif di `src/app/_components/tilt-card-3d.test.tsx` (5 test suites, 100% lulus).

### 1.2 New Component: `HeroBackground3D` (`src/app/_components/hero-background-3d.tsx`)
- Komponen visual 3D canvas murni (HTML5 Canvas 2D context) tanpa library eksternal (zero bundle bloat).
- Memproyeksikan sistem koordinat 3D $(X, Y, Z)$ ke layar menggunakan rumus proyeksi perspektif:
  $$\text{scale} = \frac{\text{focalLength}}{\text{focalLength} + Z' + 350}$$
  $$X_{\text{screen}} = \text{centerX} + X' \times \text{scale}$$
  $$Y_{\text{screen}} = \text{centerY} + Y' \times \text{scale}$$
- Membentuk lattice/constellation antar node yang berdekatan dengan garis bergradasi transparan.
- Halus merespons pergerakan kursor mouse melalui interpolasi lerp ($0.05$ factor).
- Mendukung device pixel ratio (HiDPI / Retina), ResizeObserver, serta pembersihan memory leak (`cancelAnimationFrame`, pencabutan event listener).
- Menghormati `prefers-reduced-motion` dengan tidak memicu requestAnimationFrame terus-menerus.
- Dilengkapi unit test lengkap di `src/app/_components/hero-background-3d.test.tsx` (4 test suites, 100% lulus).

### 1.3 Hero Integration (`src/app/_components/hero.tsx`)
- Menanamkan `<HeroBackground3D />` pada layer background sebagai kanvas kedalaman ambient.
- Membungkus avatar Muhammad Faisal Amir dengan `<TiltCard3D maxTilt={10} scale={1.03} perspective={1200} glare={true}>` dengan `data-testid="hero-avatar-tilt"`.
- Foto potret di dalam avatar tetap tegak dan stationary (mempertahankan 100% kepatuhan terhadap `TASK-FE-002-fix-avatar-rotation`).

### 1.4 Projects Integration (`src/app/_components/projects.tsx`)
- Membungkus setiap kartu proyek portofolio dengan `<TiltCard3D maxTilt={8} scale={1.02} perspective={1000} glare={true}>` dengan `data-testid="project-card-tilt"`.
- Menerapkan `[transform-style:preserve-3d]` dan depth layer `[transform:translateZ(10px)]` & `[transform:translateZ(15px)]` pada thumbnail, ikon, dan judul untuk sensasi kartu fisik 3D mengapung saat di-hover.

---

## 2. File Inventory

| File Path | Action | Description |
|-----------|--------|-------------|
| `src/app/_components/tilt-card-3d.tsx` | Created | Reusable 3D Perspective Tilt Card with specular glare & a11y |
| `src/app/_components/tilt-card-3d.test.tsx` | Created | Unit tests for TiltCard3D component |
| `src/app/_components/hero-background-3d.tsx` | Created | Lightweight vanilla Canvas 3D geometric particle constellation |
| `src/app/_components/hero-background-3d.test.tsx` | Created | Unit tests for HeroBackground3D component |
| `src/app/_components/hero.tsx` | Modified | Integrated HeroBackground3D and wrapped avatar with TiltCard3D |
| `src/app/_components/hero.test.tsx` | Modified | Added 3D background canvas and 3D avatar tilt test cases |
| `src/app/_components/projects.tsx` | Modified | Wrapped portfolio cards with TiltCard3D and depth layers |
| `src/app/_components/projects.test.tsx` | Modified | Added project-card-tilt assertions for all project items |

---

## 3. Verification & Build Confirmation

- **Unit Test Execution:** `bun run test` -> 31 test files, 154 tests passed (0 failures).
- **ESLint Execution:** `bun run lint` -> 0 errors, 0 warnings.
- **Production Build:** `bun run build` -> Next.js 16.2.6 production build succeeded in 16.3s, static pages generated in 3.9s.
