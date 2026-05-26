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

`LeadForm` POSTs to **`/api/lead`** (a Vercel Edge Function at [api/lead.ts](api/lead.ts)), which forwards each submission to the client's Monday.com board via Monday's GraphQL API. Three env vars drive the wiring (see [.env.example](.env.example) for the full list): `MONDAY_API_TOKEN`, `MONDAY_BOARD_ID`, and `MONDAY_COLUMN_MAP` (a JSON map of form field → Monday column id).

The token never reaches the client bundle — it lives only in Vercel env vars and `.env.local` for local `vercel dev`. The form state machine handles `idle | submitting | success | error` and surfaces a toast per state.

Local dev: run `npx vercel dev` instead of `npm run dev` so the `/api/lead` route is served alongside Vite. Without env vars set, the endpoint returns `not-configured` and the form shows the error toast.

## Heading colors

There is **no global heading color in `src/index.css`**. The base layer only sets `font-weight` and `line-height` on `h1–h4`. Each section picks its own color explicitly:

- Cream-background sections (`Intro`, `WhatAwaits`, `WhoFor`, `ImportantInfo`, `Payment`, `Itinerary`, `Gallery`, `VideoGallery`, `LetterFromRonit`): `text-ink-deep` on the `<h2>`.
- Photo/video overlays (`Hero`, `CinematicMoment`, `VideoMoment`, `WhyTuBav`, `ClosingQuote`, `LeadForm`): `text-ivory` or inline `color: #faf6ee`.

Do **not** re-add a global `@apply text-ink-deep` to `h1–h4` in `index.css`. It competes with overlay headings via specificity and produces brown text bleeding through over photos.

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

## Persistent UI elements

- Floating brand logo lives in [src/components/ui/LogoBadge.tsx](src/components/ui/LogoBadge.tsx) and mounts once at the top of `App.tsx`. Don't duplicate it inside sections.
- Countdown timer lives in [src/components/ui/Countdown.tsx](src/components/ui/Countdown.tsx) and reads `tripDate` from `copy.he.ts`. Change the flight date there, not in the component.
- Office phone for the footer is `footer.phone` in `copy.he.ts`. Single source of truth.

## Letter from Ronit

[LetterFromRonit.tsx](src/components/sections/LetterFromRonit.tsx) embeds the handwritten letter as an image because the source is cursive Hebrew (no transcription). If a new letter arrives:

1. Drop the new PDF into the client folder (`רונית -דף נחיתה אומן/`).
2. Update the `PDF_PATH` constant in `scripts/convert-letter.mjs` if filename changed.
3. Run `node scripts/convert-letter.mjs` — regenerates `public/images/letter-from-ronit.{webp,jpg}`.

## New-media optimization

- `scripts/optimize-media.mjs` — full-folder pass. **Re-running re-numbers everything**, so use only on a fresh project or when you want to rebuild from scratch.
- `scripts/optimize-new-media.mjs` — add-on script with a hardcoded source-file list and explicit output indices (logo + `video-07.mp4`..`video-16.mp4`). Use this when adding new assets without disturbing existing indices.

## Notes

- User's email: clixteam579@gmail.com
- Reference page is a ravpage.co.il build (proprietary "Ravmesser Assistant" font) — we substitute the free Google Font "Assistant" which has near-identical Hebrew metrics.
- Mobile breakpoint mirrored from reference: 600px.
- Max container width mirrored from reference: 906px.
