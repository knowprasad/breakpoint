# Design System & Token Guidelines: `breakpoint`

## 1. Design Read & Vibe
* **Read:** Standalone technical reference platform and disaster encyclopedia for senior software engineers, with a dark terminal / high-density forensic editorial language, leaning toward Tailwind v4 + Geist + restrained, purposeful physics and strict typographic hierarchy.
* **Surface Mode:** Operate & Read.
* **Dials:**
  * `DESIGN_VARIANCE: 7`
  * `MOTION_INTENSITY: 5`
  * `VISUAL_DENSITY: 5`

## 2. Color Palette & Materiality
* **Base Backgrounds:**
  * Root canvas: `#08090b` (Deep obsidian black)
  * Surface card: `#0e1115` (Deep slate)
  * Elevated hover: `#141820`
  * Sub-panel / code wells: `#060709`
* **Borders & Dividers:**
  * Hairline border: `#1f242d`
  * Focus / hover border: `#323b49`
* **Accents:**
  * **Critical Outage (P0):** Crimson Ember `#ef4444` / `bg-red-950/60` / `border-red-500/30`
  * **Major Outage (P1):** Warm Amber `#f59e0b` / `bg-amber-950/60` / `border-amber-500/30`
  * **Lindy Evergreen:** Emerald `#10b981` / `bg-emerald-950/60` / `border-emerald-500/30`
  * **Deep CS Concept:** Cyber Cyan `#06b6d4` / `bg-cyan-950/60` / `border-cyan-500/30`

## 3. Typography & Rhythm
* **Primary Sans:** Geist Sans (`var(--font-geist-sans)`)
* **Technical Monospace:** Geist Mono (`var(--font-geist-mono)`)
* **Display Headlines:** Bold, tight tracking (`tracking-tight`), crisp contrast
* **Eyebrow Discipline:** Strict cap: maximum 1 eyebrow per 3 sections.
* **Hero Constraint:** Fits within the desktop viewport; value-prop subtext ≤ 20 words; zero overflow.

## 4. Components & Affordances
* **Tactile Feedback:** Buttons push in on press (`active:scale-[0.98] active:translate-y-[1px]`).
* **Interactive Modals:** Focus traps, `Escape` key close, clean backdrop blur (`backdrop-blur-md bg-black/80`).
* **Badges:** Monospace, border-reinforced, high WCAG AA contrast.
