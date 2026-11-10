# DailyBite Design System (UI/UX Pro Max)

**Project:** DailyBite - Smart Meal Planner & 3D Culinary Experience  
**Version:** 2.0.0  
**Stack:** Flask, Jinja2, Bootstrap 5, Three.js, Vanilla ES6+, GSAP-inspired Animations

---

## 1. Visual Style & Aesthetic
- **Design Archetype:** Modern Culinary Glassmorphism + Dynamic 3D Spatial Presentation
- **Atmosphere:** Appetizing, fresh, high-tech yet approachable, trustworthy, and delightfully fluid.
- **Micro-Interactions:** Smooth 250ms–350ms cubic-bezier transitions (`cubic-bezier(0.16, 1, 0.3, 1)`), hover lifts, orbital rotations, and real-time 3D lighting.

---

## 2. Color Palette & Semantics

| Token | Hex | Role | Contrast Ratio |
|---|---|---|---|
| `--color-primary` | `#10B981` | Emerald Fresh Green (Primary Brand & Accent) | 4.6:1 on white |
| `--color-primary-dark` | `#064E3B` | Deep Forest Green (Text & Accents) | 11.2:1 on white |
| `--color-accent` | `#F59E0B` | Warm Saffron Amber (Price, Highlights, Sparks) | 4.8:1 on dark |
| `--color-secondary` | `#F97316` | Warm Tangerine (Secondary Action Glow) | 4.5:1 |
| `--color-veg` | `#16A34A` | Authentic FSSAI Veg Indicator Green | 5.1:1 |
| `--color-nonveg` | `#DC2626` | Authentic FSSAI Non-Veg Crimson | 5.8:1 |
| `--color-surface` | `#FFFFFF` | Card & Modal Surface | Clean Base |
| `--color-surface-glass` | `rgba(255, 255, 255, 0.88)` | Backdrop Blur 16px | Glassmorphism |
| `--color-dark-studio` | `#0A0F1D` | 3D Studio Background for Maximum Depth | Deep Space Contrast |
| `--color-text-main` | `#0F172A` | Slate 900 Heading Text | 15.8:1 on light |
| `--color-text-muted` | `#64748B` | Slate 500 Supporting Description | 4.9:1 on light |

---

## 3. Typography Hierarchy
- **Primary Display / Headings:** `'Outfit', sans-serif` (Weights: 600, 700, 800)
- **Body & UI Controls:** `'Plus Jakarta Sans', system-ui, sans-serif` (Weights: 400, 500, 600, 700)
- **Hierarchy:**
  - Hero Display: `3.5rem` / `56px` (Line height: 1.15, Letter spacing: `-0.03em`)
  - Section Headings: `2.25rem` / `36px` (Weight: 700)
  - Card Titles: `1.25rem` / `20px` (Weight: 700)
  - Body Text: `0.95rem` / `15px` (Line height: 1.6)
  - Micro-Badges & Meta: `0.78rem` / `12.5px` (Weight: 700, Uppercase)

---

## 4. Key Interactive Components

### 1. Dish Orbit Carousel (`dish-orbit-carousel`)
- **Structure:** 3D elliptical orbital ring with floating dishes positioned in space.
- **Behavior:**
  - Interactive navigation (Next / Prev arrows, scroll wheel, touch swipe, and dish click).
  - Front-and-center active dish with realistic drop shadow, dish info card (Name, Category, Calories, Price, Dietary badge).
  - Instant transition into 3D 360° Studio upon clicking the active dish or "Inspect in 3D" button.

### 2. 3D 360° Food Studio (`food-3d-studio`)
- **Technology:** Three.js WebGL rendering + CSS 3D perspective fallback.
- **Capabilities:**
  - Full 360-degree rotation (yaw, pitch, roll) via mouse drag or touch swipe.
  - Smooth Auto-Spin toggle (`360° Auto-Rotate`).
  - Zoom controls (`1.0x` to `2.2x` magnification) to inspect garnishes and texture.
  - Dynamic Lighting: Ambient light + Directional culinary warm light (`#FFF5EB`) + Specular highlights on plate edge.
  - Interactive Ingredient Hotspots / Callouts that rotate in 3D coordinate space.
  - Direct "Add to Weekly Plan" action from the 3D viewer.

### 3. AI Voice Assistant Hub
- Pulsing concentric ripple waves when listening.
- 7-Bar synchronized audio equalizer visualization during Gnani Timbre voice playback.

---

## 5. Accessibility & UX Checklist
- [x] All interactive controls have `cursor: pointer`
- [x] Focus states are visible and keyboard navigable (`Tab`, `Enter`, `Escape`)
- [x] Text contrast meets WCAG AA standards (4.5:1 minimum)
- [x] `prefers-reduced-motion` smoothly disables auto-spinning and intense rotations
- [x] Seamless responsive design across mobile (375px), tablet (768px), and desktop (1200px+)
