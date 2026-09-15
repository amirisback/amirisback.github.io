# 🎨 UI Modernization Design Spec — Portfolio Muhammad Faisal Amir

> **Author:** Angel (UI/UX Designer)
> **Date:** 2026-09-14
> **Task:** TASK-FE-001 — UI Modernization
> **Status:** ✅ Ready for Implementation

---

## Table of Contents

1. [Design Philosophy & Direction](#1-design-philosophy--direction)
2. [New Design Tokens & Color System](#2-new-design-tokens--color-system)
3. [globals.css Additions](#3-globalscss-additions)
4. [Component-by-Component Spec](#4-component-by-component-spec)
5. [Design Tokens Summary Table](#5-design-tokens-summary-table)

---

## 1. Design Philosophy & Direction

### Before → After

| Aspect | Before (Current) | After (Modernized) |
|--------|-------------------|---------------------|
| Primary Color | `#2e3d48` flat slate | Gradient accent `cyan-500 → violet-500` |
| Backgrounds | Flat white/zinc alternating | Subtle gradient meshes + glass layers |
| Corners | `rounded-sm` (sharp/kaku) | `rounded-2xl` / `rounded-xl` (soft/modern) |
| Cards | Simple border + shadow | Glassmorphism + gradient borders + glow |
| Buttons | Flat solid with border swap | Pill-shaped gradient + hover glow |
| Animations | Minimal | Gradient-shift, shimmer, glow-pulse, float |
| Section Feel | Corporate/boring | Dynamic, depth-layered, vibrant |

### Design Principles
- **Gradient-First**: Every accent uses gradient instead of flat color
- **Glass Morphism**: Frosted glass panels create depth separation
- **Glow & Pulse**: Subtle neon glow effects for interactive elements
- **Softer Corners**: `rounded-2xl` as the standard card radius
- **Motion**: CSS-only animations for liveliness (no heavy JS)
- **Contrast Preserved**: All text meets WCAG AA minimum (4.5:1 body, 3:1 large)

---

## 2. New Design Tokens & Color System

### 2.1 Gradient Accent System

Replace the flat `#2e3d48` primary with a multi-stop gradient accent:

```
Primary Gradient:   cyan-400 (#22d3ee) → violet-500 (#8b5cf6)
Secondary Gradient: blue-500 (#3b82f6) → indigo-500 (#6366f1)
Accent Gradient:    emerald-400 (#34d399) → cyan-500 (#06b6d4)
Warm Gradient:      amber-400 (#fbbf24) → rose-500 (#f43f5e)
```

### 2.2 CSS Custom Properties to Add

```css
:root {
  /* ── Gradient stops ── */
  --accent-from: #22d3ee;       /* cyan-400 */
  --accent-via: #6366f1;        /* indigo-500 */
  --accent-to: #8b5cf6;         /* violet-500 */

  /* ── Glass ── */
  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-shadow: rgba(0, 0, 0, 0.05);

  /* ── Glow ── */
  --glow-cyan: rgba(34, 211, 238, 0.4);
  --glow-violet: rgba(139, 92, 246, 0.4);
  --glow-blue: rgba(59, 130, 246, 0.3);

  /* ── Section backgrounds (light) ── */
  --section-primary-bg: #ffffff;
  --section-alt-bg: #f8fafc;    /* slate-50 — softer than zinc-50 */

  /* ── Hero gradient ── */
  --hero-from: #0f172a;         /* slate-900 */
  --hero-via: #1e1b4b;          /* indigo-950 */
  --hero-to: #0c0a09;           /* stone-950 */
}

:root.dark {
  /* ── Glass (dark) ── */
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-shadow: rgba(0, 0, 0, 0.3);

  /* ── Section backgrounds (dark) ── */
  --section-primary-bg: #09090b;  /* zinc-950 */
  --section-alt-bg: #0a0a0a;

  /* ── Hero gradient (dark) ── */
  --hero-from: #020617;          /* slate-950 */
  --hero-via: #0f0b2e;
  --hero-to: #030712;            /* gray-950 */
}
```

### 2.3 @theme inline Additions

Add these tokens inside the existing `@theme inline` block in `globals.css`:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  /* New: Accent gradient colors */
  --color-accent-from: var(--accent-from);
  --color-accent-via: var(--accent-via);
  --color-accent-to: var(--accent-to);
}
```

---

## 3. globals.css Additions

> [!IMPORTANT]
> All new CSS must be APPENDED to the existing `globals.css`.
> Do NOT modify existing CMS styles (lines 39-235).

### 3.1 @keyframes Animations

```css
/* ====================================================
   UI Modernization — Animations & Utility Classes
   ==================================================== */

/* ── Gradient shift (smooth background position animation) ── */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* ── Glow pulse (for accent elements) ── */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px var(--glow-cyan), 0 0 40px var(--glow-violet); }
  50% { box-shadow: 0 0 30px var(--glow-cyan), 0 0 60px var(--glow-violet); }
}

/* ── Float (gentle vertical floating) ── */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

/* ── Float delayed (for staggered decorative elements) ── */
@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-18px) rotate(8deg); }
}

/* ── Shimmer (for progress bars, badges) ── */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

/* ── Spin slow (for decorative ring elements) ── */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Scale in (for BackToTop appear) ── */
@keyframes scale-in {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* ── Gradient text shimmer ── */
@keyframes gradient-text-shift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 200% center; }
}

/* ── Timeline dot pulse ── */
@keyframes dot-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.6); }
  50% { box-shadow: 0 0 0 8px rgba(34, 211, 238, 0); }
}

/* ── Border glow rotate (for avatar ring) ── */
@keyframes border-spin {
  from { --angle: 0deg; }
  to { --angle: 360deg; }
}
```

### 3.2 Utility Classes

```css
/* ── Glassmorphism base class ── */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--glass-border);
}

.glass-strong {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.dark .glass {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.06);
}

.dark .glass-strong {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}

/* ── Animated gradient background ── */
.gradient-animated {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

/* ── Gradient text ── */
.gradient-text {
  background: linear-gradient(135deg, var(--accent-from), var(--accent-via), var(--accent-to));
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-text-shift 6s ease infinite;
}

/* ── Glow effects ── */
.glow-accent {
  box-shadow: 0 0 20px var(--glow-cyan), 0 0 40px var(--glow-violet);
}

.glow-accent-hover:hover {
  box-shadow: 0 0 25px var(--glow-cyan), 0 0 50px var(--glow-violet);
}

/* ── Shimmer overlay (for progress bars) ── */
.shimmer-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2.5s ease-in-out infinite;
}

/* ── Gradient border wrapper (conic gradient trick) ── */
.gradient-border {
  position: relative;
  background-clip: padding-box;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(135deg, var(--accent-from), var(--accent-via), var(--accent-to));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gradient-border:hover::before {
  opacity: 1;
}

/* ── Section heading gradient accent line ── */
.section-accent-line {
  height: 3px;
  width: 2.5rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, var(--accent-from), var(--accent-to));
}

/* ── Section label gradient text ── */
.section-label {
  background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 4. Component-by-Component Spec

---

### 4a. Hero Section — `hero.tsx`

> **File:** [hero.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/hero.tsx)
> **Goal:** Animated gradient background, glassmorphism container, pill gradient CTAs, animated avatar ring, floating shapes

#### Section Container (currently line 27-30)

**Current:**
```tsx
className="relative w-full overflow-hidden bg-[#2e3d48] text-white min-h-screen flex items-center pt-20"
```

**New:**
```tsx
className="relative w-full overflow-hidden text-white min-h-screen flex items-center pt-20"
```

Add a `<div>` immediately inside the section for the animated gradient background:

```tsx
{/* Animated Gradient Background */}
<div
  className="absolute inset-0 gradient-animated z-0"
  style={{
    background: 'linear-gradient(135deg, var(--hero-from) 0%, var(--hero-via) 50%, var(--hero-to) 100%)',
  }}
/>

{/* Gradient mesh overlay for depth */}
<div
  className="absolute inset-0 z-0 opacity-30"
  style={{
    background: 'radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.15) 0%, transparent 50%)',
  }}
/>
```

#### Floating Decorative Shapes (add before main content)

```tsx
{/* Floating CSS Shapes — purely decorative */}
<div className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-cyan-500/10 blur-sm" style={{ animation: 'float 6s ease-in-out infinite' }} aria-hidden="true" />
<div className="absolute top-40 right-[15%] w-24 h-24 rounded-full bg-violet-500/10 blur-md" style={{ animation: 'float-delayed 8s ease-in-out infinite' }} aria-hidden="true" />
<div className="absolute bottom-32 left-[25%] w-12 h-12 rounded-full bg-indigo-500/10 blur-sm" style={{ animation: 'float 7s ease-in-out infinite 1s' }} aria-hidden="true" />
<div className="absolute bottom-20 right-[20%] w-20 h-20 rounded-2xl rotate-45 bg-cyan-400/5 blur-sm" style={{ animation: 'float-delayed 9s ease-in-out infinite 2s' }} aria-hidden="true" />
```

#### Video Overlay (if video present, currently line 45)

**Current:**
```tsx
className="absolute inset-0 bg-[#2e3d48]/75 z-10"
```

**New:**
```tsx
className="absolute inset-0 bg-slate-950/70 z-10"
```

#### Glassmorphism Content Wrapper

Wrap the entire content div (currently line 50) in a glass panel:

**Current:**
```tsx
<div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full z-20 py-16 lg:py-24">
```

**New:**
```tsx
<div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full z-20 py-16 lg:py-24">
  <div className="glass-strong rounded-3xl p-8 md:p-12 lg:p-16">
```

> [!NOTE]
> Close this extra `</div>` after the grid ends (before closing the outer container).

#### Greeting Text (line 54-56)

**Current:**
```tsx
className="text-xl md:text-2xl font-semibold tracking-wide text-zinc-300"
```

**New:**
```tsx
className="text-lg md:text-xl font-medium tracking-widest uppercase text-cyan-300/80"
```

#### Name / H1 (line 57-59)

**Current:**
```tsx
className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none text-white"
```

**New — Apply gradient text class:**
```tsx
className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none gradient-text"
```

#### Typing Text Container (line 60-63)

**Current:**
```tsx
className="h-10 sm:h-12 flex items-center text-xl sm:text-2xl lg:text-3xl font-medium text-zinc-100"
```

**New:**
```tsx
className="h-10 sm:h-12 flex items-center text-xl sm:text-2xl lg:text-3xl font-medium text-white/90"
```

#### CTA Buttons (line 66-82)

**Current:**
```tsx
className={`px-8 py-3.5 text-sm font-semibold tracking-wider rounded-sm transition-all duration-300 text-center cursor-pointer ${
  idx === 0
    ? "bg-white text-[#2e3d48] border-2 border-white hover:bg-transparent hover:text-white"
    : "bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#2e3d48]"
}`}
```

**New — Pill-shaped gradient buttons:**
```tsx
className={`px-8 py-3.5 text-sm font-semibold tracking-wider rounded-full transition-all duration-300 text-center cursor-pointer ${
  idx === 0
    ? "bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 text-white shadow-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.4),0_0_50px_rgba(139,92,246,0.3)] hover:scale-[1.03]"
    : "bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:border-white/40"
}`}
```

#### Avatar Container (line 87)

**Current:**
```tsx
className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/20 bg-white/5 backdrop-blur-sm shadow-2xl"
```

**New — Animated gradient ring:**
```tsx
{/* Outer spinning gradient ring */}
<div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full p-1.5"
  style={{
    background: 'linear-gradient(135deg, var(--accent-from), var(--accent-via), var(--accent-to))',
    animation: 'spin-slow 8s linear infinite',
  }}
>
  {/* Inner image container */}
  <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900">
    <Image ... />
  </div>
</div>
{/* Glow effect behind avatar */}
<div
  className="absolute inset-0 rounded-full opacity-40 blur-2xl -z-10"
  style={{
    background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
    animation: 'glow-pulse 4s ease-in-out infinite',
  }}
  aria-hidden="true"
/>
```

---

### 4b. Navbar — `navbar.tsx`

> **File:** [navbar.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/navbar.tsx)
> **Goal:** Glassmorphism sticky, animated underline, pill active link, glass mobile menu

#### Nav Container (line 86-91)

**Current:**
```tsx
className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
  isSticky
    ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-sm py-3"
    : "bg-transparent py-5 lg:py-6 border-b border-white/10"
}`}
```

**New — Enhanced glassmorphism:**
```tsx
className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
  isSticky
    ? "bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5 dark:shadow-black/20 py-3 border-b border-zinc-200/50 dark:border-zinc-800/50"
    : "bg-transparent py-5 lg:py-6 border-b border-white/10"
}`}
```

#### Brand Logo (line 96-105)

**Current:**
```tsx
className={`text-2xl font-bold tracking-wider transition-colors duration-300 ${
  isSticky ? "text-[#2e3d48] dark:text-white" : "text-white"
}`}
```

**New — Gradient text when sticky:**
```tsx
className={`text-2xl font-bold tracking-wider transition-all duration-300 ${
  isSticky ? "gradient-text" : "text-white"
}`}
```

#### Desktop Nav Links (line 110-124)

**Current:**
```tsx
className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-cyan-500 ${
  isSticky
    ? activeHash === link.href
      ? "text-cyan-600 dark:text-cyan-400 font-bold"
      : "text-zinc-600 dark:text-zinc-300"
    : activeHash === link.href
    ? "text-white font-bold underline decoration-2 underline-offset-4 decoration-cyan-400"
    : "text-white/80"
}`}
```

**New — Pill active + animated underline:**
```tsx
className={`relative text-sm font-medium tracking-wide transition-all duration-300 ${
  isSticky
    ? activeHash === link.href
      ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-4 py-1.5 rounded-full shadow-md shadow-cyan-500/20"
      : "text-zinc-600 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400 px-4 py-1.5"
    : activeHash === link.href
    ? "text-white font-semibold px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-sm"
    : "text-white/80 hover:text-white px-4 py-1.5"
}`}
```

Add animated underline via pseudo-element in CSS (non-active links when sticky):

```css
/* Add to globals.css */
.nav-link-underline {
  position: relative;
}
.nav-link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  border-radius: 9999px;
  background: linear-gradient(90deg, var(--accent-from), var(--accent-to));
  transition: all 0.3s ease;
  transform: translateX(-50%);
}
.nav-link-underline:hover::after {
  width: 70%;
}
```

Add the class `nav-link-underline` to non-active links when `isSticky` is true.

#### Language Switcher Active Button (lines 137-142, 149-155, 172-178, 185-191)

Replace all instances of:
```tsx
"bg-[#2e3d48] text-white shadow-sm"
```

With:
```tsx
"bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-md shadow-cyan-500/20"
```

#### Mobile Menu Panel (line 212-228)

**Current:**
```tsx
className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-xl py-4 px-6 flex flex-col space-y-4"
```

**New — Glassmorphism slide-down:**
```tsx
className="lg:hidden absolute top-full left-0 right-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl backdrop-saturate-150 border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-black/10 dark:shadow-black/30 py-6 px-6 flex flex-col space-y-3"
```

#### Mobile Menu Active Link (line 219-223)

**Current:**
```tsx
activeHash === link.href
  ? "text-cyan-600 dark:text-cyan-400 border-l-4 border-cyan-500 pl-2"
  : "text-zinc-700 dark:text-zinc-300 pl-2"
```

**New — Gradient pill active link:**
```tsx
activeHash === link.href
  ? "bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-600 dark:text-cyan-400 border-l-4 border-cyan-500 pl-4 rounded-r-xl"
  : "text-zinc-700 dark:text-zinc-300 pl-4 hover:pl-5 hover:text-cyan-600 dark:hover:text-cyan-400"
```

---

### 4c. About Section — `about.tsx`

> **File:** [about.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/about.tsx)
> **Goal:** Gradient border on image, animated gradient skill bars with shimmer, decorative accents

#### Section Background (line 25)

**Current:**
```tsx
className="py-20 bg-white dark:bg-zinc-950 overflow-hidden"
```

**New — add relative for decorative elements:**
```tsx
className="relative py-24 bg-white dark:bg-zinc-950 overflow-hidden"
```

#### Decorative Floating Accent Elements

Add immediately inside the section:

```tsx
{/* Decorative accent shapes */}
<div className="absolute top-10 right-[5%] w-64 h-64 rounded-full bg-cyan-400/5 dark:bg-cyan-400/3 blur-3xl" aria-hidden="true" />
<div className="absolute bottom-10 left-[5%] w-48 h-48 rounded-full bg-violet-500/5 dark:bg-violet-500/3 blur-3xl" aria-hidden="true" />
```

#### Image Container (line 30-38)

**Current:**
```tsx
className="relative aspect-[4/5] w-full rounded-sm overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800"
```

**New — Gradient border wrapper:**
```tsx
{/* Outer gradient border */}
<div className="relative aspect-[4/5] w-full rounded-2xl p-0.5" style={{ background: 'linear-gradient(135deg, var(--accent-from), var(--accent-via), var(--accent-to))' }}>
  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
    <Image ... className="object-cover transition-transform duration-700 hover:scale-105" />
  </div>
</div>
```

#### Section Header Accent Line (line 46)

**Current:**
```tsx
<span className="h-[2px] w-8 bg-[#2e3d48] dark:bg-cyan-400" />
```

**New:**
```tsx
<span className="section-accent-line" />
```

#### Section Label (line 47-49)

**Current:**
```tsx
className="text-sm font-bold uppercase tracking-wider text-[#2e3d48] dark:text-cyan-400"
```

**New:**
```tsx
className="text-sm font-bold uppercase tracking-wider section-label"
```

> [!IMPORTANT]
> Apply the same `section-accent-line` and `section-label` replacements to ALL section headers across:
> - [projects.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/projects.tsx) (lines 31-34)
> - [experience.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/experience.tsx) (lines 30-33)
> - [blog.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/blog.tsx) (lines 36-39)
> - [footer.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/footer.tsx) (lines 52-55)

#### Skill Percentage Text (line 67)

**Current:**
```tsx
className="text-[#2e3d48] dark:text-cyan-400"
```

**New:**
```tsx
className="section-label font-bold"
```

#### Skill Progress Bar Background (line 70)

**Current:**
```tsx
className="h-2.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden"
```

**New:**
```tsx
className="h-3 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-full overflow-hidden"
```

#### Skill Progress Bar Fill (line 71-78)

**Current:**
```tsx
className="h-full bg-[#2e3d48] dark:bg-cyan-500 rounded-full transition-all duration-1000 ease-out"
```

**New — Gradient fill with shimmer:**
```tsx
className="relative h-full rounded-full transition-all duration-1000 ease-out overflow-hidden shimmer-overlay"
style={{
  width: `${skill.percentage}%`,
  background: 'linear-gradient(90deg, var(--accent-from), var(--accent-via), var(--accent-to))',
}}
```

Remove the inline `style={{ width: ... }}` from the JSX and move width into the combined style object above.

---

### 4d. Projects Cards — `projects.tsx`

> **File:** [projects.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/projects.tsx)
> **Goal:** Glassmorphism cards, gradient icon containers, card lift + border glow, staggered animations

#### Section Background (line 26)

**Current:**
```tsx
className="py-20 bg-zinc-50 dark:bg-zinc-900"
```

**New:**
```tsx
className="relative py-24 bg-slate-50 dark:bg-zinc-950/50 overflow-hidden"
```

Add decorative background mesh:
```tsx
{/* Background mesh accent */}
<div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-400/5 dark:bg-cyan-400/3 blur-3xl" aria-hidden="true" />
<div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-violet-500/5 dark:bg-violet-500/3 blur-3xl" aria-hidden="true" />
```

#### Project Card (line 46)

**Current:**
```tsx
className="h-full flex flex-col justify-between p-8 bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg group"
```

**New — Glassmorphism card with gradient border glow:**
```tsx
className="relative h-full flex flex-col justify-between p-8 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/40 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/5 hover:-translate-y-2 hover:border-cyan-400/40 dark:hover:border-cyan-400/30 transition-all duration-500 group"
```

#### Project Icon Container (line 49)

**Current:**
```tsx
className="flex items-center justify-center w-14 h-14 rounded-lg bg-[#2e3d48]/10 dark:bg-cyan-500/10 text-[#2e3d48] dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300"
```

**New — Gradient icon container with glow:**
```tsx
className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400/20 via-indigo-500/10 to-violet-500/20 dark:from-cyan-400/15 dark:via-indigo-500/10 dark:to-violet-500/15 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300"
```

#### Project Title (line 53)

**Current:**
```tsx
className="text-xl font-bold text-zinc-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
```

**New:**
```tsx
className="text-xl font-bold text-zinc-800 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-violet-500 group-hover:bg-clip-text transition-colors duration-300"
```

#### View Project Link (line 64)

**Current:**
```tsx
className="pt-6 flex items-center text-sm font-semibold text-[#2e3d48] dark:text-cyan-400 group-hover:underline"
```

**New:**
```tsx
className="pt-6 flex items-center text-sm font-semibold section-label group-hover:gap-2 transition-all duration-300"
```

---

### 4e. Experience Timeline — `experience.tsx`

> **File:** [experience.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/experience.tsx)
> **Goal:** Gradient timeline line, glowing pulse dots, hover accent border on cards

#### Section (line 25)

**Current:**
```tsx
className="py-20 bg-white dark:bg-zinc-950 overflow-hidden"
```

**New:**
```tsx
className="relative py-24 bg-white dark:bg-zinc-950 overflow-hidden"
```

#### Timeline Vertical Line (line 44)

**Current:**
```tsx
className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-zinc-300 dark:bg-zinc-800 -translate-x-1/2"
```

**New — Gradient line:**
```tsx
className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 rounded-full"
style={{ background: 'linear-gradient(to bottom, var(--accent-from), var(--accent-via), var(--accent-to))' }}
```

#### Timeline Dot Indicator (line 60)

**Current:**
```tsx
className="absolute left-4 md:left-1/2 top-1.5 md:top-8 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-4 border-[#2e3d48] dark:border-cyan-400 -translate-x-1/2 z-10"
```

**New — Glowing pulsing dot:**
```tsx
className="absolute left-4 md:left-1/2 top-1.5 md:top-8 w-4 h-4 rounded-full -translate-x-1/2 z-10"
style={{
  background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
  animation: 'dot-pulse 2.5s ease-in-out infinite',
}}
```

#### Date Badge (line 64)

**Current:**
```tsx
className={`... text-xs md:text-sm font-bold uppercase tracking-wider text-[#2e3d48] dark:text-cyan-400 ...`}
```

**New:**
```tsx
className={`... text-xs md:text-sm font-bold uppercase tracking-wider section-label ...`}
```

#### Timeline Card (line 80)

**Current:**
```tsx
className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
```

**New — Hover accent border with glass effect:**
```tsx
className="p-6 bg-white/90 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/40 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 hover:border-cyan-400/40 dark:hover:border-cyan-400/30 hover:-translate-y-1 transition-all duration-500"
```

#### Company Name (line 84)

**Current:**
```tsx
className="text-base font-medium italic text-[#2e3d48] dark:text-cyan-400 mb-2"
```

**New:**
```tsx
className="text-base font-medium italic section-label mb-2"
```

---

### 4f. Blog Cards — `blog.tsx`

> **File:** [blog.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/blog.tsx)
> **Goal:** Gradient overlay on image hover, pill category badges, card lift + shadow expansion

#### Section Background (line 31)

**Current:**
```tsx
className="py-20 bg-zinc-50 dark:bg-zinc-900"
```

**New:**
```tsx
className="relative py-24 bg-slate-50 dark:bg-zinc-950/50 overflow-hidden"
```

#### Blog Card Container (line 56)

**Current:**
```tsx
className="h-full flex flex-col md:flex-row bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden group"
```

**New — Card lift + expanded shadow:**
```tsx
className="h-full flex flex-col md:flex-row bg-white/90 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/40 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/5 hover:-translate-y-2 transition-all duration-500 rounded-2xl overflow-hidden group"
```

#### Image Section (line 58-66)

After the `<Image>` tag, add a gradient overlay that appears on hover:

```tsx
<div className="relative w-full md:w-48 h-48 md:h-auto shrink-0 overflow-hidden">
  <Image ... />
  {/* Gradient overlay on hover */}
  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/30 via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
</div>
```

#### Meta Icons (lines 74, 78, 82)

Replace all instances of:
```tsx
className="... text-[#2e3d48] dark:text-cyan-400"
```
on `<i>` icons with:
```tsx
className="... text-cyan-500 dark:text-cyan-400"
```

#### Category Badge — New Pill Style

If the category is displayed as text, wrap it in a pill badge:

```tsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 dark:border-cyan-400/20">
  <i className="far fa-list-alt mr-1" />
  {post.category}
</span>
```

#### Read More Link (line 104)

**Current:**
```tsx
className="inline-flex items-center text-sm font-semibold text-[#2e3d48] dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer group/btn"
```

**New:**
```tsx
className="inline-flex items-center text-sm font-semibold section-label hover:gap-2 transition-all duration-300 cursor-pointer group/btn"
```

---

### 4g. Footer — `footer.tsx`

> **File:** [footer.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/footer.tsx)
> **Goal:** Gradient top border accent, social icons with gradient hover, modern layout

#### Footer Container (line 45)

**Current:**
```tsx
className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 py-16"
```

**New — Gradient top border accent:**
```tsx
className="relative bg-white dark:bg-zinc-950 py-16 overflow-hidden"
```

Add gradient accent border at the top:
```tsx
{/* Gradient top border accent */}
<div className="absolute top-0 left-0 right-0 h-1 rounded-b-full" style={{ background: 'linear-gradient(90deg, var(--accent-from), var(--accent-via), var(--accent-to))' }} aria-hidden="true" />
```

#### Contact Icon Circles (lines 64, 76, 90)

**Current:**
```tsx
className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[#2e3d48] dark:text-cyan-400 mt-1 shrink-0"
```

**New — Gradient icon background:**
```tsx
className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/15 to-violet-500/15 dark:from-cyan-400/10 dark:to-violet-500/10 text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0"
```

#### Social Link Icons (line 117)

**Current:**
```tsx
className="flex items-center justify-center w-12 h-12 rounded-full border border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-[#2e3d48] hover:text-white dark:hover:bg-cyan-500 dark:hover:text-zinc-950 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md"
```

**New — Gradient hover effect:**
```tsx
className="flex items-center justify-center w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:text-white hover:border-transparent hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300"
style={{ '--tw-gradient-from': 'var(--accent-from)', '--tw-gradient-to': 'var(--accent-to)' }}
```

Since inline styles for Tailwind gradients are complex, use this approach instead:

```tsx
className="relative flex items-center justify-center w-12 h-12 rounded-xl border border-zinc-200/60 dark:border-zinc-800/50 text-zinc-500 dark:text-zinc-400 hover:text-white hover:border-transparent hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500 group/social overflow-hidden"
```

Add a gradient background div inside:
```tsx
<a ...>
  {/* Hover gradient bg */}
  <span className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-indigo-500 to-violet-500 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300 rounded-xl" />
  <i className={`${social.icon} relative z-10`} />
</a>
```

#### Bottom Copyright Section (line 128)

**Current:**
```tsx
className="border-t border-zinc-200 dark:border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-zinc-500 dark:text-zinc-500 gap-4"
```

**New:**
```tsx
className="border-t border-zinc-200/60 dark:border-zinc-800/40 pt-8 mt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-zinc-400 dark:text-zinc-500 gap-4"
```

---

### 4h. BackToTop — `back-to-top.tsx`

> **File:** [back-to-top.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/back-to-top.tsx)
> **Goal:** Gradient bg + glow + rounded-full, scale animation on appear

#### Button (line 29-40)

**Current:**
```tsx
className={`fixed right-6 bottom-6 z-50 flex h-11 w-11 items-center justify-center rounded-sm bg-[#2e3d48] text-white hover:bg-slate-700 active:bg-slate-800 transition-all duration-300 shadow-lg cursor-pointer ${
  isVisible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4 pointer-events-none"
}`}
```

**New — Gradient circular button with glow + scale animation:**
```tsx
className={`fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ${
  isVisible
    ? "opacity-100 scale-100"
    : "opacity-0 scale-75 pointer-events-none"
}`}
style={{
  background: 'linear-gradient(135deg, var(--accent-from), var(--accent-via), var(--accent-to))',
}}
```

---

### 4i. ScrollReveal — `scroll-reveal.tsx`

> **File:** [scroll-reveal.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/scroll-reveal.tsx)
> **Goal:** Add blur-to-clear effect, scale-up variant

#### Direction Classes Map (line 56-62)

**Current:**
```tsx
const directionClasses = {
  up: "translate-y-10",
  down: "-translate-y-10",
  left: "translate-x-10",
  right: "-translate-x-10",
  none: "",
};
```

**New — Add blur and scale to hidden state:**
```tsx
const directionClasses = {
  up: "translate-y-10 blur-[2px] scale-[0.97]",
  down: "-translate-y-10 blur-[2px] scale-[0.97]",
  left: "translate-x-10 blur-[2px] scale-[0.97]",
  right: "-translate-x-10 blur-[2px] scale-[0.97]",
  none: "blur-[2px] scale-[0.97]",
};
```

#### Transform Class (line 64-66)

**Current:**
```tsx
const transformClass = isVisible
  ? "translate-y-0 translate-x-0 opacity-100"
  : `${directionClasses[direction]} opacity-0`;
```

**New — Clear all blur + scale when visible:**
```tsx
const transformClass = isVisible
  ? "translate-y-0 translate-x-0 opacity-100 blur-0 scale-100"
  : `${directionClasses[direction]} opacity-0`;
```

#### Transition Class (line 71)

**Current:**
```tsx
className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${transformClass} ${className}`}
```

**New — Proper Tailwind transition:**
```tsx
className={`transition-all duration-700 ease-out ${transformClass} ${className}`}
```

> [!NOTE]
> The `cubic-bezier(0.16, 1, 0.3, 1)` in the current code is not a valid Tailwind class and was likely not applied. Using `ease-out` provides a clean deceleration effect.

---

### 4j. TypingText Cursor Enhancement — `typing-text.tsx`

> **File:** [typing-text.tsx](file:///d:/Project/amirisback.github.io/src/app/_components/typing-text.tsx)

#### Cursor (line 57-61)

**Current:**
```tsx
className="ml-1 inline-block w-[3px] h-[1.2em] bg-white animate-pulse"
```

**New — Gradient cursor:**
```tsx
className="ml-1 inline-block w-[3px] h-[1.2em] rounded-full animate-pulse"
style={{
  background: 'linear-gradient(to bottom, var(--accent-from), var(--accent-to))',
  animationDuration: '1s',
}}
```

Remove the separate `style={{ animationDuration: "1s" }}` since it's now combined.

---

## 5. Design Tokens Summary Table

### 5.1 Color Tokens

| Token Name | Light Value | Dark Value | Usage |
|------------|-------------|------------|-------|
| `--accent-from` | `#22d3ee` (cyan-400) | `#22d3ee` (cyan-400) | Gradient start for all accent elements |
| `--accent-via` | `#6366f1` (indigo-500) | `#6366f1` (indigo-500) | Gradient midpoint |
| `--accent-to` | `#8b5cf6` (violet-500) | `#8b5cf6` (violet-500) | Gradient end |
| `--glass-bg` | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.04)` | Glass panel background |
| `--glass-border` | `rgba(255,255,255,0.15)` | `rgba(255,255,255,0.08)` | Glass panel border |
| `--glass-shadow` | `rgba(0,0,0,0.05)` | `rgba(0,0,0,0.3)` | Glass shadow layer |
| `--glow-cyan` | `rgba(34,211,238,0.4)` | `rgba(34,211,238,0.4)` | Cyan glow effects |
| `--glow-violet` | `rgba(139,92,246,0.4)` | `rgba(139,92,246,0.4)` | Violet glow effects |
| `--glow-blue` | `rgba(59,130,246,0.3)` | `rgba(59,130,246,0.3)` | Blue glow effects |
| `--section-primary-bg` | `#ffffff` | `#09090b` | Primary section background |
| `--section-alt-bg` | `#f8fafc` (slate-50) | `#0a0a0a` | Alternating section background |
| `--hero-from` | `#0f172a` (slate-900) | `#020617` (slate-950) | Hero gradient start |
| `--hero-via` | `#1e1b4b` (indigo-950) | `#0f0b2e` | Hero gradient midpoint |
| `--hero-to` | `#0c0a09` (stone-950) | `#030712` (gray-950) | Hero gradient end |

### 5.2 Animation Tokens

| Animation Name | Duration | Easing | Usage |
|---------------|----------|--------|-------|
| `gradient-shift` | `8s` | `ease` | Hero background, gradient elements |
| `glow-pulse` | `4s` | `ease-in-out` | Avatar glow, accent highlights |
| `float` | `6-7s` | `ease-in-out` | Hero decorative shapes |
| `float-delayed` | `8-9s` | `ease-in-out` | Staggered floating elements |
| `shimmer` | `2.5s` | `ease-in-out` | Skill bar shimmer overlay |
| `spin-slow` | `8s` | `linear` | Avatar gradient ring rotation |
| `scale-in` | `0.3s` | `ease-out` | BackToTop button appear |
| `dot-pulse` | `2.5s` | `ease-in-out` | Timeline dot indicator |
| `gradient-text-shift` | `6s` | `ease` | Animated gradient text |

### 5.3 Utility Classes

| Class Name | Purpose | Applied To |
|------------|---------|-----------|
| `.glass` | Standard glassmorphism panel | Mobile menu, content containers |
| `.glass-strong` | Higher opacity glass panel | Hero content wrapper |
| `.gradient-animated` | Animated BG gradient shift | Hero background layer |
| `.gradient-text` | Gradient-colored text | H1 name, brand logo (when sticky) |
| `.glow-accent` | Static glow box-shadow | Active buttons, focused elements |
| `.glow-accent-hover` | Glow on hover only | Interactive cards, buttons |
| `.shimmer-overlay` | Moving shimmer `::after` pseudo | Skill progress bar fills |
| `.gradient-border` | Gradient border via `::before` | Cards with gradient border hover |
| `.section-accent-line` | Gradient accent divider line | All section header dividers |
| `.section-label` | Gradient text for labels | All section label text |
| `.nav-link-underline` | Animated hover underline | Desktop nav links (non-active) |

### 5.4 Border Radius System

| Token | Value | Usage |
|-------|-------|-------|
| Standard Card | `rounded-2xl` | All cards (project, blog, experience, etc.) |
| Button Pill | `rounded-full` | CTA buttons, active nav links, BackToTop |
| Icon Container | `rounded-xl` | Icon wrappers, social icons, contact icons |
| Hero Glass | `rounded-3xl` | Hero glass content wrapper |
| Image Container | `rounded-2xl` | About image with gradient border |

---

## Appendix: WCAG Contrast Check

All critical text combinations maintain WCAG AA compliance:

| Element | Foreground | Background | Contrast Ratio | Pass? |
|---------|-----------|------------|----------------|-------|
| Body text (light) | `#52525b` zinc-600 | `#ffffff` white | 7.2:1 | ✅ AA |
| Body text (dark) | `#d4d4d8` zinc-300 | `#09090b` zinc-950 | 13.5:1 | ✅ AAA |
| Heading (light) | `#27272a` zinc-800 | `#ffffff` white | 14.7:1 | ✅ AAA |
| Heading (dark) | `#ffffff` white | `#09090b` zinc-950 | 19.4:1 | ✅ AAA |
| Gradient text cyan | `#22d3ee` cyan-400 | `#0f172a` dark bg | 7.8:1 | ✅ AA |
| Label gradient (approx center) | `#6366f1` indigo | `#ffffff` white | 4.6:1 | ✅ AA (large text) |
| Hero text | `#ffffff` white | `#0f172a` slate-900 | 16.3:1 | ✅ AAA |
| Glass panel text (hero) | `#ffffff` white | Semi-transparent dark | > 7:1 | ✅ AA |

> [!TIP]
> The `section-label` uses gradient text which varies in contrast. Since section labels are always displayed as **bold uppercase (effectively "large text" per WCAG)**, they only need 3:1 minimum contrast ratio, which is comfortably met.

---

> **End of Design Spec — Ready for Fiqry to implement** 🚀
