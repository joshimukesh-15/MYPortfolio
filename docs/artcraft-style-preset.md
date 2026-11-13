# ArtCraft Style Preset & Reusable Architecture Guide

This document preserves the complete design system, tokens, mathematical formulas, and WebGL shader code developed for the **GetArtCraft** editorial style. You can copy this file into any future project to replicate the exact same aesthetic and performance in minutes.

---

## 1. Quick Drop-In Setup (3 Steps)

### Step 1: Install Dependencies
```bash
npm install three gsap lenis
```

### Step 2: Add Design Tokens to your Global CSS (`styles.css`)
```css
:root {
  /* ArtCraft Light Theme (Default: Warm Parchment) */
  --bg: #f8f6f0;
  --bg-subtle: #f0eee9;
  --surface: #ffffff;
  --surface-2: #f2f0ea;
  --border: rgba(18, 18, 20, 0.12);
  --border-bright: rgba(18, 18, 20, 0.28);
  --text: #121214;
  --text-muted: #57565f;
  --text-faint: #8e8c95;
  --accent: #2563eb;
  --accent-glow: rgba(37, 99, 235, 0.25);
  --ring-line: rgba(18, 18, 20, 0.07);
  --ring-line-tick: rgba(18, 18, 20, 0.18);
  --ring-line-spiral: rgba(26, 26, 30, 0.82);
  --btn-primary-bg: #121214;
  --btn-primary-text: #f8f6f0;

  --sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --mono: 'JetBrains Mono', 'IBM Plex Mono', monospace;
  --radius: 0px; /* Square corners */
}

[data-theme="dark"] {
  /* ArtCraft Dark Theme */
  --bg: #0b0b0c;
  --bg-subtle: #070708;
  --surface: #131316;
  --surface-2: #1a1a1f;
  --border: rgba(255, 255, 255, 0.09);
  --border-bright: rgba(255, 255, 255, 0.22);
  --text: #f0eee9;
  --text-muted: #9896a1;
  --text-faint: #5e5c66;
  --accent: #3b82f6;
  --accent-glow: rgba(59, 130, 246, 0.30);
  --ring-line: rgba(255, 255, 255, 0.07);
  --ring-line-tick: rgba(255, 255, 255, 0.18);
  --ring-line-spiral: rgba(240, 238, 233, 0.76);
  --btn-primary-bg: #f0eee9;
  --btn-primary-text: #0b0b0c;
}
```

### Step 3: Include the Reusable Components
Copy these files from this repository:
1. `src/components/ArtCraftGalaxy.jsx` — 100% WebGL Three.js 6-arm Archimedean spiral galaxy with GLSL pulse shaders and upright squircle cards.
2. `src/components/HeroScroll.jsx` & `HeroScroll.css` — Pinned scroll-driven hero with giant wordmark, twin square buttons, and section navigation.
3. `src/components/SectionHeader.jsx` & `SectionHeader.css` — Framed bar section headers with `+` corner ticks.
4. `src/components/ScrollRuler.jsx` & `ScrollRuler.css` — Precision millimeter right-edge ruler with scroll progress percentage.

---

## 2. Core Aesthetic Pillars

| Element | ArtCraft Rule |
| :--- | :--- |
| **Buttons** | Square corners (`0px`), uppercase monospace font, letter-spacing `0.12em`. One solid black/off-white, one outlined. |
| **Section Titles** | Framed 1px bar with small `+` crosshairs at all four corners. Numbered format: `01 / TITLE`. |
| **Background Spiral** | 6-arm Archimedean spiral galaxy running in WebGL with traveling light pulses. Zero DOM lag. |
| **Orbiting Tiles** | 3D mesh planes with 256×256 squircle canvas textures, counter-rotated to remain upright at all times. |
| **Scroll Dynamics** | Lenis smooth scroll scrub advancing the conveyor outward; GSAP ScrollTrigger pinning and wordmark docking. |
| **Right Ruler** | Millimeter drafting ruler with live scroll percentage indicator (`00%` – `100%`). |

---

## 3. WebGL Galaxy Mathematical Formulas

- **Spiral Curve:**
  $$r = b \cdot u, \quad \theta = u + \text{baseAngle} + \text{spin}$$
  where $b = \frac{r_{\max}}{\theta_{\max}}$ and $\theta_{\max} = 1.05 \times 2\pi \approx 378^\circ$.
- **Perpendicular Normal Extrusion:**
  $$g_x = b \cos\theta - r \sin\theta, \quad g_y = b \sin\theta + r \cos\theta$$
  $$\vec{n} = \frac{(-g_y, g_x)}{\sqrt{g_x^2 + g_y^2}}$$
- **Traveling Pulse Wave (GLSL):**
  $$\text{pulse} = \text{fract}(aT \cdot uCount - uTime \cdot uSpeed + aArm \cdot 0.618)$$
- **Conveyor Outward Flow:**
  $$\text{Progress} = \text{idleProgress} + \frac{\text{window.scrollY} \times 0.2}{1000}$$
- **Upright Card Formula:**
  $$\text{mesh.position} = (r \cos\theta, r \sin\theta, 1), \quad \text{mesh.rotation} = (0, 0, -\text{spin})$$

---

## 4. Antigravity Skill Integration
This design system is also registered as an Antigravity AI skill at:
`C:\Users\Ketan\.gemini\config\skills\artcraft\SKILL.md`

In any future conversation or project, you can simply tell the AI:
> *"Build this landing page in the ArtCraft style"*
or
> *"Use the artcraft design skill"*

The agent will automatically load this skill and apply all tokens, shaders, and component rules.
