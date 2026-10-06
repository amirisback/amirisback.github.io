# PRD: Interactive 3D Animations & Kinetic Depth System

**Task ID:** `TASK-FE-003-interactive-3d-animations`  
**Author:** Faisal (`faisal_pm`)  
**Lead Subagents:** Faisal (`faisal_pm`), Angel (`angel_uiux`), Fiqry (`fiqry_frontend`), Sandra (`sandra_qa`)  
**Status:** Approved & Ready for Implementation  
**Date:** 2026-10-06  

---

## 1. Product Overview & User Stories

### 1.1 Overview
Portfolio website Muhammad Faisal Amir memerlukan sentuhan modern **3D Animation** yang interaktif, elegan, dan berbobot tanpa mengurangi performa loading, stabilitas, maupun kepatuhan terhadap standar Anti-Slop (Mode 1: DURING).

Fitur 3D Animation ini mencakup 3 pilar utama:
1. **Hero Section 3D Interactive Avatar:** Parallax 3D tilt responsif terhadap pergerakan mouse/pointer pengguna dengan efek pencahayaan dinamis (specular glare), mempertahankan posisi portrait tetap tegak (sesuai mandat `TASK-FE-002`).
2. **Project Cards 3D Perspective Tilt:** Efek kartu 3D berdimensi (`perspective` + `transform-style: preserve-3d`) dengan dynamic cursor spotlight saat di-hover pada section Portofolio.
3. **Hero Background 3D Geometric Mesh / Kinetic Particles:** Ambient 3D floating particle constellation & geometric lattice yang berputar dan merespons gerakan mouse secara halus, ringan, dan zero-dependency (menggunakan vanilla HTML5 Canvas + mathematical 3D perspective projection).

### 1.2 User Stories
- **Sebagai Pengunjung Portfolio**, saya ingin melihat visual interaktif 3D yang hidup dan berkelas saat mengarahkan kursor di Hero dan Project cards, agar saya merasakan keahlian teknis dan perhatian terhadap detail dari Muhammad Faisal Amir.
- **Sebagai Pengguna Mobile/Touch**, saya ingin tampilan tetap mulus, responsif, tidak lag, dan tidak ada glitch sentuhan atau sticky hover yang merusak navigasi.
- **Sebagai Pengguna dengan Sensitivitas Gerakan (Accessibility)**, saya ingin website menghormati pengaturan `prefers-reduced-motion` sistem operasi saya sehingga animasi 3D tidak memicu disorientasi.

---

## 2. Anti-Slop Compliance & Design Read

- **Usage Mode:** **Mode 1 (DURING)** — Diterapkan secara ketat sejak perencanaan dan penulisan kode.
- **Design Read:** Personal engineering & tech leadership portfolio, visual language modern refined dark/light glass, dial **ENERGY 2 / RHYTHM 2 / MOTION 2**.
- **Purpose Test (R-19 & Purpose-Gate):**
  - *Hero Avatar 3D Tilt:* Memberikan kedalaman visual dan responsivitas taktil pada titik fokus utama hero saat berinteraksi, tanpa memutar gambar foto (menjaga wibawa profil profesional).
  - *Project Cards 3D Tilt:* Mempertegas hierarki interaktivitas bahwa kartu proyek dapat diklik/dieksplorasi dengan memberikan respons fisik saat didekati kursor.
  - *3D Geometric Particle Mesh:* Memberikan ambient kedalaman ruang 3D di latar belakang menggantikan bentuk dekoratif statis yang membosankan, dibangun dengan zero external bloatware library.
- **Hard Gate Protections:**
  - `R-02`: Bebas karakter em dash (`—`) pada seluruh teks UI baru.
  - `R-03`: 100% responsif mobile tanpa horizontal overflow atau lag.
  - `R-25`: Kontras warna teks dan elemen tetap memenuhi standar WCAG AA (≥ 4.5:1).
  - `R-26`: Setiap elemen interaktif memiliki fungsi nyata.
  - `R-32`: Ramah aksesibilitas dan keyboard navigable.
  - `R-35`: Verifikasi end-to-end dengan pengujian Vitest dan build check.

---

## 3. Acceptance Criteria (AC)

- **AC-01: Hero 3D Interactive Avatar Tilt**
  - Avatar container merespons koordinat pointer mouse dengan rotasi 3D halus (`rotateX`, `rotateY`, `scale3d`).
  - Dilengkapi dynamic ambient glare highlight yang bergerak seirama posisi kursor.
  - Foto avatar Muhammad Faisal Amir tetap berorientasi tegak (zero continuous spin / inverted photo).
  - Kembali ke posisi netral secara smooth saat pointer meninggalkan area (`mouseleave`).

- **AC-02: Project Cards 3D Perspective Tilt & Specular Spotlight**
  - Setiap kartu portofolio dalam `projects.tsx` memiliki efek 3D tilt berdimensi (`perspective: 1000px`, `transform-style: preserve-3d`).
  - Dilengkapi radial-gradient spotlight yang mengikuti titik kursor saat berada di atas kartu.
  - Elemen di dalam kartu (ikon & judul) memiliki kedalaman visual (`translateZ`).
  - Transisi halus saat kursor masuk dan keluar kartu.

- **AC-03: Hero Background 3D Geometric Mesh & Kinetic Particles**
  - Komponen canvas 3D ringan (`HeroBackground3D`) yang merender partikel & polyhedral wireframe nodes dalam ruang 3D `(x, y, z)` dengan proyeksi perspektif `fov / (fov + z)`.
  - Bereaksi secara halus terhadap interaksi mouse (damping/smoothing) tanpa gerakan liar/distraktif.
  - Menggunakan warna token desain: Cyan (`rgba(34, 211, 238, ...)`) dan Violet (`rgba(139, 92, 246, ...)`).
  - Otomatis pause/throttle saat komponen unmount atau di luar viewport untuk menjaga efisiensi baterai dan CPU.

- **AC-04: Accessibility & Reduced Motion Handling**
  - Memeriksa preferensi `window.matchMedia('(prefers-reduced-motion: reduce)')`.
  - Jika aktif, menonaktifkan rotasi tilt dinamis dan menjaga mesh partikel dalam status tenang/minimal.
  - Mendukung navigasi keyboard tanpa gangguan outline atau focus ring.

- **AC-05: Code Quality & Zero Regressions**
  - Zero heavyweight bundle overhead (tidak menginstal Three.js 600KB; murni vanilla TS + HTML5 Canvas & CSS 3D).
  - Seluruh unit tests Vitest lulus (100% test coverage pada komponen baru).
  - `bun run lint` lolos dengan 0 error dan 0 peringatan (tanpa tag supresi).
  - `bun run build` sukses.

---

## 4. Cross-Role Alignment Meeting Log

### 1. Sandra (QA):
- **Question:** *"Apakah animasi 3D di Canvas dan event listener pointer move berisiko menimbulkan memory leak saat berganti halaman atau tab, dan bagaimana penanganan pada layar touch mobile?"*
  - **Faisal (PM Decision):** Wajib ada fungsi cleanup yang membatalkan `cancelAnimationFrame` dan menghapus semua event listener pada `useEffect` unmount. Pada perangkat touch/mobile, animasi 3D background harus tetap smooth dan ringan (jumlah partikel disesuaikan untuk layar kecil), serta kartu 3D tilt tidak boleh mengalami sticky/frozen state saat disentuh.
  - **Fiqry (Frontend):** Siap. Saya akan mendesain hook/komponen dengan passive event listener, auto-detect touch, serta penyesuaian partikel adaptif (misal 35 partikel di mobile vs 70 di desktop) dan cleanup lengkap di unmount.

### 2. Bryan (Backend/DevOps):
- **Question:** *"Apakah penambahan 3D Canvas dan tilt ini mempengaruhi rendering SSR Next.js 16 App Router atau memerlukan perubahan endpoint API?"*
  - **Bryan's Assessment:** Zero backend overhead. Tidak ada perubahan database atau API route. Komponen yang menangani interaktivitas Canvas dan pointer move wajib dideklarasikan dengan directive `"use client"`, sedangkan parent Server Component tetap mengalirkan data tanpa serialisasi issue.

### 3. Angel (UI/UX):
- **Question:** *"Bagaimana memastikan efek 3D tidak terlihat berlebihan (slop trend-stacking) dan tetap selaras dengan identitas visual portfolio?"*
  - **Angel's Explanation:** Efek 3D harus bertindak sebagai mikrotaktil yang refined (subtle depth), bukan visual showcase sirkus.
  - **Fix & Spesifikasi Angel:**
    - Batasi sudut rotasi tilt maksimal pada rentang ±10 hingga ±12 derajat.
    - Gunakan curve easing yang sangat halus (`cubic-bezier(0.23, 1, 0.32, 1)` atau lerp damping 0.1).
    - Efek specular glare dibatasi opacity-nya (maksimal 15-20%) sehingga tidak menyilaukan teks.
    - Partikel background 3D memiliki kedalaman z-index di bawah konten (`z-0`), sementara konten utama tetap jelas terbaca di atas glass card (`z-20`).

### 4. Fiqry (Frontend):
- **Question:** *"Apakah kita membuat komponen wrapper 3D tilt terpisah yang reusable untuk kartu dan avatar?"*
  - **Fiqry's Proposal:** Saya mengusulkan pembuatan komponen reusable `TiltCard3D` (`src/app/_components/tilt-card-3d.tsx`) yang menangani kalkulasi sudut `perspective`, `rotateX`, `rotateY`, dan specular glare secara modular, serta `HeroBackground3D` (`src/app/_components/hero-background-3d.tsx`) untuk background partikel 3D canvas.
  - **Faisal (PM Decision):** Disetujui! Pendekatan modular ini membuat kode mudah diuji (unit test terisolasi), sangat reusable, dan menjaga `hero.tsx` serta `projects.tsx` tetap bersih dan rapi.
