# Design Specification: Interactive 3D Animations & Kinetic Depth Tokens

**Task ID:** `TASK-FE-003-interactive-3d-animations`  
**Designer:** Angel (`angel_uiux`)  
**Scope:** 3D Interaction Design, Token Hierarchy & Motion Spec  
**Status:** Approved  
**Date:** 2026-10-06  

---

## 1. Design Rationale & Aesthetic Philosophy

Sesuai panduan **Anti-Slop (Mode 1: DURING)** dengan dial **ENERGY 2 / RHYTHM 2 / MOTION 2**:
- Efek 3D dirancang sebagai **sentuhan taktil interaktif (Kinetic Micro-Interactions)**, bukan gimmick animasi looping yang berisik atau membingungkan.
- Tujuannya adalah menciptakan kesan **kedalaman (spatial depth)** saat pengguna menggerakkan kursor, memberikan umpan balik langsung yang responsif, modern, dan presisi.

---

## 2. Design Tokens & Parameters

### 2.1 3D Perspective & Tilt Tokens

| Parameter | Hero Avatar Token | Project Card Token | Rationale |
|-----------|-------------------|--------------------|-----------|
| **Perspective** | `1200px` | `1000px` | Memberikan ruang proyeksi 3D natural tanpa distorsi ekstrem |
| **Max Tilt Angle** | `±12°` | `±10°` | Membatasi kemiringan agar konten dan teks tetap mudah dibaca |
| **Scale on Hover** | `1.03` | `1.02` | Memberikan sensasi pengangkatan (elevation lift) fisik |
| **Easing Function** | `cubic-bezier(0.23, 1, 0.32, 1)` | `cubic-bezier(0.23, 1, 0.32, 1)` | Out-quint style spring deceleration yang mulus dan elegan |
| **Reset Transition** | `transform 0.5s ease-out` | `transform 0.4s ease-out` | Animasi kembali ke posisi netral saat kursor keluar |

### 2.2 Dynamic Specular Glare (Pencahayaan Interaktif)
- **Gradient Formula:**
  ```css
  radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.18) 0%, rgba(34, 211, 238, 0.08) 40%, transparent 80%)
  ```
- **Max Opacity:** `0.18` (Dark mode) / `0.12` (Light mode) agar tidak menutupi keterbacaan teks judul atau foto.
- **Blending Mode:** `mix-blend-mode: overlay` atau `pointer-events-none` layer.

### 2.3 3D Spatial Layers (`transform-style: preserve-3d`)
Pada kartu portofolio dan avatar:
- **Base Surface (Card Background):** `transform: translateZ(0px)`
- **Secondary Content (Description & Link):** `transform: translateZ(10px)`
- **Focal Content (Icon, Badge & Heading):** `transform: translateZ(20px)`
- **Lighting Glare Overlay:** `transform: translateZ(30px)`

Sensasi multi-plane ini membuat elemen dalam kartu tampak "mengapung" secara fisik di atas permukaan kartu.

---

## 3. Ambient 3D Particle Mesh Canvas Tokens

### 3.1 3D Spatial Geometry
- **Volume Bounding Box:**
  - $X \in [-350, 350]$ px
  - $Y \in [-250, 250]$ px
  - $Z \in [-250, 250]$ px
- **Perspective Projection Matrix Formula:**
  $$scale = \frac{focalLength}{focalLength + Z'}$$
  $$X_{screen} = X' \times scale + center_X$$
  $$Y_{screen} = Y' \times scale + center_Y$$
  dengan $focalLength = 350$.

### 3.2 Visual Palette & Node Connections
- **Particle Nodes:**
  - Radius: $1.2 \text{px} - 2.8 \text{px}$ (disesuaikan berdasarkan kedalaman $Z$).
  - Warna: Gradasi token `--accent-from` (Cyan `#22d3ee`) dan `--accent-to` (Violet `#8b5cf6`).
- **Constellation Edges (Connecting Lines):**
  - Jarak ambang batas koneksi (Threshold): $85 \text{px} - 110 \text{px}$.
  - Opacity garis: Dinamis berdasarkan kedalaman $Z$ dan jarak antar titik (maksimal $0.15$ agar tetap subtle dan tidak mengaburkan teks).
- **Parallax Reactivity:**
  - Mengikuti posisi mouse dengan smoothing lerp factor $0.05$.
  - Rotasi ambient perlahan: $\Delta \theta = 0.0015 \text{ rad/frame}$.

---

## 4. Accessibility & Responsive States

1. **`prefers-reduced-motion: reduce`:**
   - Tilt 3D pada avatar dan kartu dinonaktifkan (`transform: none`).
   - Background 3D partikel berada pada posisi statis tanpa rotasi terus-menerus.
2. **Mobile & Touch Devices:**
   - Menonaktifkan tilt berlebihan pada gestur sentuh (touch) agar tidak mengganggu scroll vertikal.
   - Mengurangi density partikel di canvas (35 partikel di `< md` viewport vs 70 di desktop) demi efisiensi baterai.
3. **Contrast Verification:**
   - Semua elemen teks pada Hero dan Projects mempertahankan rasio kontras $\ge 4.5:1$ terhadap background di semua sudut kemiringan tilt.
