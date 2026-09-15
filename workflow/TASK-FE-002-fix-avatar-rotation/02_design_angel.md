# Design Specification: Hero Avatar Stationary & Gradient Ring Fix

**Task ID:** `TASK-FE-002-fix-avatar-rotation`  
**Designer:** Angel (`angel_uiux`)  
**Scope:** UI/UX Bugfix & Visual Polish  
**Status:** Approved

---

## 1. Problem Statement & UX Analysis
- **Observed Behavior:** The circular profile photo of Muhammad Faisal Amir in the Hero section was rotating continuously (`animation: spin-slow 8s linear infinite`), resulting in the subject's portrait appearing upside down and tilted at various angles over time.
- **UX Impact:** Highly disorienting, distracting from key CTAs and value propositions, and conveys an unintended playful/broken spinning wheel effect rather than a professional executive software engineering portfolio.
- **Root Cause:** In `src/app/_components/hero.tsx`, the outer gradient wrapper div had `animation: 'spin-slow 8s linear infinite'`, which was wrapping the Next.js `<Image>` component inside. As a result, CSS `transform: rotate(...)` was inherited by the child DOM tree, rotating the actual portrait image continuously.

---

## 2. Design Decisions & Recommendations

### 2.1 Fixed, Upright Avatar
- **Rule:** The profile photo MUST NEVER rotate. The photo must remain strictly upright, centered, and stationary (`transform: none`) at all times.
- **Aspect Ratio & Shape:** 1:1 circular mask with `rounded-full overflow-hidden`.
- **Background Fill:** `bg-slate-900` fallback to prevent any white edge fringing.

### 2.2 Gradient Ring Border (Stationary & Clean)
- **Border Treatment:** 6px outer ring (`p-1.5`) with gradient tokens:
  `background: linear-gradient(135deg, var(--accent-from), var(--accent-via), var(--accent-to))`
- **Rotation:** No continuous rotation. The gradient ring sits statically and crisply around the avatar.
- **Micro-Interaction:** Smooth hover elevation (`transition-transform duration-500 hover:scale-[1.02]`) on the container to add subtle tactility without movement disorientation.

### 2.3 Localized Glow Aura
- **Container Isolation:** Avatar and its ambient glow are enclosed within a dedicated `relative w-80 h-80 lg:w-96 lg:h-96` container.
- **Glow Styling:** `absolute inset-0 rounded-full opacity-40 blur-2xl -z-10` with `animation: glow-pulse 4s ease-in-out infinite`.
- **UX Benefit:** Focuses the cyan/violet ambient lighting tightly behind the portrait circle rather than leaking into the entire hero card width.

---

## 3. Component Spec Reference

```tsx
<div className="relative w-80 h-80 lg:w-96 lg:h-96">
  {/* Elegant gradient ring border (stationary, never rotates) */}
  <div
    className="relative w-full h-full rounded-full p-1.5 transition-transform duration-500 hover:scale-[1.02]"
    style={{
      background: 'linear-gradient(135deg, var(--accent-from), var(--accent-via), var(--accent-to))',
    }}
  >
    {/* Inner image container (fixed upright) */}
    <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900 shadow-2xl">
      <Image
        src={`/${data.heroImage}`}
        alt={data.name}
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1024px) 320px, 384px"
      />
    </div>
  </div>

  {/* Glow effect directly behind avatar */}
  <div
    className="absolute inset-0 rounded-full opacity-40 blur-2xl -z-10"
    style={{
      background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
      animation: 'glow-pulse 4s ease-in-out infinite',
    }}
    aria-hidden="true"
  />
</div>
```
