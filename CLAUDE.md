# CLAUDE.md

Instructions and context for Claude Code working in this project.

## Project Overview

Single-page Hebrew RTL landing page promoting Ronit Barash's women-only Tu B'Av spiritual journey to Uman (5,900₪, 5 days). Visual identity must match the reference page [inbalelmakyes.ravpage.co.il/FreetoFulfill](https://inbalelmakyes.ravpage.co.il/FreetoFulfill) **strictly** — warm earth-tone palette, Hebrew Ravmesser-style typography, calm spiritual mood — with the new Uman trip copy.

## Stack

- **Vite + React 18 + TypeScript** — SPA, no SSR, single page.
- **Tailwind CSS** — palette locked in `tailwind.config.ts`.
- **Framer Motion** — reveal + float + hover micro-interactions. Has built-in `useReducedMotion`.
- **Google Font: Assistant** (closest free analog to "Ravmesser Assistant").
- **No router** — single page, anchor scrolling only.

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build to dist/
npm run preview      # serve the production build
```

## Design tokens

All colors, fonts, max-widths, and easings live ONLY in `tailwind.config.ts`. Components consume tokens via Tailwind utilities — never hardcode hex values in JSX or CSS.

Theme audit (must return only `tailwind.config.ts`):
```bash
grep -rE '#[0-9a-fA-F]{3,6}' src/
```

| Token | Value | Purpose |
|---|---|---|
| `hero` | `#b89e8b` | hero + closing-quote background |
| `cream` | `#fffcf9` | primary section background |
| `cream-alt` | `#fffbf9` | alternating section background |
| `accent` | `#c3957d` | CTA & form section background |
| `button` | `#87573e` | primary button fill |
| `button-text` | `#eeecea` | button text |
| `ink-deep` | `#6b4532` | headings |
| `ink-body` | `#2d2d2d` | body copy |
| `divider` | `#efe5dc` | 2px section separator |

## Animation rules

All motion lives in `src/components/motion/`. Three primitives only:

1. `<Reveal>` — fade + 16px Y on viewport enter, fires once. 700ms, soft cubic-bezier ease.
2. `<FloatingDecor>` — slow Y ±8px loop on hero decorative SVGs, opacity 0.12.
3. `<Button>` — translateY(-2px) on hover, shadow grow. No color shift.

Hard rules:
- Every animated component honors `useReducedMotion()` — short-circuits to static values when true.
- No bounce, no scale > 1.02, no rotate.
- `Reveal` fires once, unobserves itself. No replay on scroll-up.
- Lists stagger at `staggerChildren: 0.08`.

## RTL

- `<html lang="he" dir="rtl">` in `index.html`.
- Use Tailwind **logical** utilities: `ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`. **Do not** use `pl-*`/`pr-*`/`ml-*`/`mr-*` — they break under RTL.
- Wrap LTR numerals (5,900₪, 6,077₪) in `<bdi>` when inside RTL paragraphs.

## Content

Two files, one authority chain:

1. **`content/copy.he.md`** — human-readable canonical copy (client-supplied raw text). If anyone needs to read or edit the copy, this is the file. **This file wins** over the TS module on disagreement.
2. **`src/content/copy.he.ts`** — typed export of the same copy, structured by section. Components import from here.

No Hebrew strings live inside JSX. When the markdown changes, update the TS module to match.

## Form

`LeadForm` is **UI-only**. The submit handler must remain a TODO stub — `console.warn('LeadForm not wired yet — see planning.md TODO')` plus a user-visible toast. Do not invent a backend; the wiring decision is deferred to the user (mailto / Formspree / WhatsApp).

## File-organization rules

- `src/components/sections/` — one file per page block, named in reading order (Hero → Footer).
- `src/components/ui/` — reusable atoms (Button, Card, Badge, Divider, FloatingDecor).
- `src/components/layout/` — page-level primitives (Section, Container).
- `src/components/motion/` — animation primitives (Reveal, variants).
- Keep each file under ~120 lines. If a section grows past that, extract a sub-component into `ui/` or a co-located file.

## Don'ts

- Don't hardcode hex colors in components.
- Don't put Hebrew strings inside JSX.
- Don't add a real form backend without explicit user instruction.
- Don't introduce additional animation libraries.
- Don't use directional Tailwind utilities (`pl/pr/ml/mr`) in this RTL project.
- Don't add a router or extra pages.

## Notes

- User's email: clixteam579@gmail.com
- Reference page is a ravpage.co.il build (proprietary "Ravmesser Assistant" font) — we substitute the free Google Font "Assistant" which has near-identical Hebrew metrics.
- Mobile breakpoint mirrored from reference: 600px.
- Max container width mirrored from reference: 906px.
