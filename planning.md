# Planning — Inbal Uman Tu B'Av Landing Page

## Goal

Theme-strict replica of the reference [ravpage landing page](https://inbalelmakyes.ravpage.co.il/FreetoFulfill) with the new Uman Tu B'Av trip copy. Warm earth-tone palette, Hebrew RTL, calm spiritual mood, restrained tasteful animation. Vite + React + TypeScript + Tailwind + Framer Motion.

## Status

| Phase | State |
|---|---|
| 1. Scaffolding (project shell + docs) | done |
| 2. Tailwind palette + font + RTL base | done |
| 3. Hebrew copy module (`src/content/copy.he.ts`) | done |
| 4. Layout primitives (Section, Container, Divider) | done |
| 5. UI atoms (Button, Card, Badge, FloatingDecor) | done |
| 6. Motion primitives (Reveal, variants) | done |
| 7. 12 section components in reading order | done (v1) |
| 8. Lead form UI (no backend) | done (UI only, submit stubbed) |
| 9. Placeholder images + decorative SVGs | partial (favicon + floating shapes done; hero photo deferred) |
| 10. Cross-browser + mobile QA + Lighthouse | not started |

**v1 status: shipped to dev server (`npm run dev` → http://localhost:5173). Production build clean (89 KB gzipped JS, 4 KB gzipped CSS).**

## Roadmap

1. **Scaffold** — `npm create vite@latest . -- --template react-ts`, install Tailwind + Framer Motion, configure `tailwind.config.ts` and `index.css`. Verify `npm run dev` renders blank page with no console errors.
2. **Tokens** — extend Tailwind config with palette / font / max-widths / easings (see `CLAUDE.md`).
3. **Layout primitives** — `Section` (vertical padding + bg + container), `Container` (906px max-width), `Divider` (2px `bg-divider` 906px centered).
4. **UI atoms** — `Button`, `Card`, `Badge`, `FloatingDecor`. All consume design tokens only.
5. **Motion primitives** — `Reveal` (whileInView, once, soft ease), `variants.ts` (shared transitions + reduced-motion fallback).
6. **Sections (in reading order)**:
   1. `Hero`
   2. `Intro`
   3. `PriceBlock`
   4. `WhyTuBav`
   5. `WhatAwaits` (10-item icon grid)
   6. `WhoFor` (5-item checklist)
   7. `ImportantInfo` (warnings)
   8. `Payment`
   9. `Itinerary` (6 cards)
   10. `LeadForm` (UI only)
   11. `ClosingQuote`
   12. `Footer`
7. **Form UI** — full field set rendered; submit handler is a `console.warn` + visible toast.
8. **Images** — placeholder hero gradient/photo + 3–4 decorative SVGs (heart, sparkle, dotted divider).
9. **QA** — Chrome + Firefox at 1440 / 1024 / 600 / 375 px. Lighthouse production preview. Reduced-motion test. Theme audit (`grep -rE '#[0-9a-fA-F]{3,6}' src/` should return only `tailwind.config.ts`).

## Open TODOs

- [ ] Wire `LeadForm` submit to a real target. **Deferred by user.** Candidates: mailto link to clixteam579@gmail.com, Formspree/Web3Forms endpoint, WhatsApp `wa.me/` deep link. Pick before launch.
- [ ] Confirm the Tu B'Av target date for an optional flip-style countdown timer (Tu B'Av 5786 ≈ early Aug 2026).
- [ ] Real hero photography (currently placeholder).
- [ ] Real Ronit Barash branding — logo, headshot, color samples if she has a brand book.
- [ ] Hebrew metatags, OG image for social sharing.
- [ ] Analytics / Facebook Pixel — confirm whether to include.
- [ ] Decide hosting (Netlify / Vercel / GitHub Pages — Vercel is the natural fit for Vite + React).

## Decisions log

| Date | Decision | Reason |
|---|---|---|
| 2026-05-20 | **Vite + React + TypeScript** over Next.js / Astro / SvelteKit / vanilla | User picked. Vite over Next: no SSR/routing needed. TypeScript: typed copy module + component props help debugging. |
| 2026-05-20 | **Tailwind CSS** over plain CSS / CSS Modules | User picked. Palette locked in config prevents theme drift. |
| 2026-05-20 | **Framer Motion** over Motion One / GSAP | Better React ergonomics; `useReducedMotion` built in; declarative variants. |
| 2026-05-20 | **Google Font: Assistant** over Heebo / Rubik / Noto Sans Hebrew | Closest free analog to ravpage's proprietary "Ravmesser Assistant" — same Hebrew character widths. |
| 2026-05-20 | **Skip form backend for now** | User picked — defer the mailto/Formspree/WhatsApp decision. |
| 2026-05-20 | **Placeholder images** | User picked — real photography to be supplied later. |
| 2026-05-20 | **Single source-of-truth for copy** in `src/content/copy.he.ts` | No Hebrew strings inside JSX; reduces translation/edit risk. |

## Out of scope (for now)

- Real form backend
- Analytics, Facebook Pixel, payment processor integration
- Multi-page navigation, blog, CMS
- Languages beyond Hebrew
- Real photography / branded asset production

## Verification checklist (before "done")

- [ ] `npm run dev` renders without console errors
- [ ] All 12 sections render in correct order, RTL flow correct, no horizontal scroll
- [ ] Side-by-side with reference URL at 1440 / 1024 / 600 / 375 px reads as "same family" (palette, type rhythm, button shape, divider weight)
- [ ] DevTools `prefers-reduced-motion: reduce` — Framer Motion respects it; content visible from page load with no animation
- [ ] Scroll-spy: each section reveals once on first entry, never replays
- [ ] Form: tab order is RTL-logical; focus rings visible; submit shows the placeholder warning visibly (not silent)
- [ ] `npm run build && npm run preview` works identically
- [ ] Lighthouse on preview: Performance ≥ 90, Accessibility ≥ 95
- [ ] Theme audit: `grep -rE '#[0-9a-fA-F]{3,6}' src/` returns only `tailwind.config.ts`
