# Design System — Ronit Barash Landing Pages ("אור הצדיק")

Reusable visual + interaction spec, exhaustively extracted from the Tu B'Av / Uman
landing page so a teammate can build a **visually identical sibling page for the same
company**. Warm earth-tone palette, Hebrew RTL, calm spiritual mood. Reference visual
identity: `inbalelmakyes.ravpage.co.il/FreetoFulfill` (match strictly).

Every exact class string, hex/rgba, px size, responsive variant, and motion value below
is taken verbatim from the codebase. When in doubt, copy the values literally.

---

## Table of contents

1. [Stack & build tooling](#1-stack--build-tooling)
2. [Color tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Layout primitives (Section, Container)](#4-layout-primitives-section--container)
5. [RTL rules](#5-rtl-rules)
6. [Motion system (Reveal + variants)](#6-motion-system-reveal--variants)
7. [Shadows, radii & decorative SVG vocabulary](#7-shadows-radii--decorative-svg-vocabulary)
8. [Per-section logo + call-pill pattern](#8-per-section-logo--call-pill-pattern)
9. [Persistent / chrome UI](#9-persistent--chrome-ui)
10. [UI component catalog](#10-ui-component-catalog)
11. [Section-by-section catalog (reading order)](#11-section-by-section-catalog-reading-order)
12. [Form (LeadForm) spec](#12-form-leadform-spec)
13. [Content & media conventions](#13-content--media-conventions)
14. [Responsive & breakpoints](#14-responsive--breakpoints)
15. [Don'ts + theme audit](#15-donts--theme-audit)

---

## 1. Stack & build tooling

- **Vite 5 + React 18.3 + TypeScript 5.6** — SPA, single page, no SSR, no router.
- **Tailwind CSS 3.4** (v3 syntax, not v4) — all design tokens live in `tailwind.config.ts`.
- **Framer Motion 11** — the **only** animation library (do not add others). Has built-in `useReducedMotion`.
- **Google Font: Assistant** — free analog to the proprietary "Ravmesser Assistant".
- **PostCSS** = `tailwindcss` + `autoprefixer` only (empty options each). ESM `postcss.config.js`. No `postcss.config.cjs`.

### package.json facts
- `name: inbalel-website` (legacy name from the reference build), `private: true`, `version: 0.1.0`, `type: module`.
- Runtime deps: `framer-motion ^11.11.17`, `react ^18.3.1`, `react-dom ^18.3.1`.
- Build-time media tooling: `sharp ^0.34.5` (image opt), `heic-convert ^2.1.0` (HEIC→web), `pdf-to-img ^6.1.0` (letter PDF→image).
- Scripts: `dev: vite`, `build: tsc -b && vite build`, `preview: vite preview`. No `lint`/`test`.

### Run
```bash
npm install
npm run dev          # http://localhost:5173  (static only — /api/lead 404s)
npx vercel dev       # use this when the lead form must work (serves /api/lead Edge Function)
npm run build        # tsc -b typecheck then vite build → dist/
npm run preview
```

### vite.config.ts
- Plugins: `react()` + an inline dev-only middleware named `no-store-videos-in-dev` that sets `Cache-Control: no-store` on any `/videos/*` request (silences Chrome's `ERR_CACHE_OPERATION_NOT_SUPPORTED` on HTTP 206 range responses). `apply: 'serve'` → dev only; never runs in production.
- `server: { port: 5173, host: true }` (fixed port, LAN-exposed).
- No path aliases, no build/rollup customization, no base override.

### tsconfig.json (strict)
- `target ES2020`, `lib [ES2020, DOM, DOM.Iterable]`, `module ESNext`, `moduleResolution bundler`, `jsx react-jsx`, `noEmit true`.
- `allowImportingTsExtensions true`, `resolveJsonModule true`, `isolatedModules true`.
- **Strictness that fails the build:** `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. Keep every import/param used.
- `include: ["src"]` only (config files outside typecheck).

### index.html shell
- `<!doctype html>` → `<html lang="he" dir="rtl">` — **RTL set at document level**.
- `<meta charset="UTF-8" />`; favicon `<link rel="icon" type="image/svg+xml" href="/images/placeholders/favicon.svg" />`.
- viewport `width=device-width, initial-scale=1.0, viewport-fit=cover` (note `viewport-fit=cover` for notched devices).
- `<meta name="theme-color" content="#b89e8b" />` (the `hero` taupe token).
- `<meta name="google" content="notranslate" />` (blocks auto-translate of the Hebrew copy).
- Title: `הזיווג שלך מתחיל בט״ו באב | מסע נשים לאומן עם רונית ברש`
- Description: `בס״ד · המסע הנשי לאומן ביום ט״ו באב — 5 ימים של תפילות, שמחה, חיבור ושבת מרוממת אצל רבי נחמן מברסלב, בהובלת רונית ברש.`
- Fonts: preconnect to `fonts.googleapis.com` + `fonts.gstatic.com (crossorigin)`, then the Assistant stylesheet (weights `300;400;500;600;700;800`, `&display=swap`).
- Body: `<div id="root"></div>` + `<script type="module" src="/src/main.tsx"></script>`. No inline styles, no splash markup (splash is a React component).

### main.tsx entry
- Before render: forces manual scroll restoration and scrolls to top (important because of the splash screen):
  ```js
  if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  ```
- Mounts `<App />` in `<React.StrictMode>` via React 18 `createRoot(document.getElementById('root')!)`, importing `./index.css`.

### App.tsx composition
- Root: `<main className="min-h-screen overflow-x-clip">`.
- Global overlays mounted first: `<SplashScreen />`, `<ScrollProgress />`.
- Section order (exact, top → bottom):
  1. `<Hero />`
  2. `<PhotoMarquee photos={editorial.marqueeStrip} height="md" />`
  3. `<Intro />`
  4. `<CinematicMoment image={editorial.shofarTall} kicker="ביום הכי מסוגל לזיווגים" caption="ט״ו באב באומן — תאריך אחד, שינוי של שנה" height="standard" />`
  5. `<PriceBlock />`
  6. `<LetterFromRonit />`
  7. `<WhyTuBav />`
  8. `<CinematicMoment image={editorial.umanGate} kicker="ציון רבי נחמן · אומן" caption="המקום בו תפילות נשמעות אחרת" height="tall" />`
  9. `<WhatAwaits />`
  10. `<Divider />`
  11. `<WhoFor />`
  12. `<Divider />`
  13. `<ImportantInfo />`
  14. `<Divider />`
  15. `<Itinerary />`
  16. `<CinematicMoment image={editorial.challahTable} kicker="הפקה של פעם בשנה" caption="כל פרט קטן נעטף באהבה ובאור" height="standard" />`
  17. `<VideoGallery />`
  18. `<Testimonials />`
  19. `<VideoMoment src={editorial.ronitVideo} poster={editorial.ronitVideoPoster} kicker="ביחד נצעד אל הציון" caption="כי המסע הזה לא רק טיסה — הוא חיבור" height="tall" />`
  20. `<Gallery />`
  21. `<Payment />`
  22. `<LeadForm />`
  23. `<ClosingQuote />`
  24. `<Footer />`
- **Page rhythm:** text section → full-bleed cinematic photo / video "moment" (with Hebrew `kicker` + `caption` props — the only Hebrew strings outside the copy modules) → text section. Thin `<Divider />` rules appear **only** between the four consecutive info sections (WhatAwaits / WhoFor / ImportantInfo / Itinerary).

---

## 2. Color tokens

Paste straight into `tailwind.config.ts → theme.extend.colors`. All 13 are real config tokens (the original CLAUDE.md table only documented 9 — `accent-soft`, `ink-night`, `ivory`, `gold` were undocumented but are used throughout).

```ts
colors: {
  hero:          '#b89e8b', // hero + closing-quote background (warm taupe)
  cream:         '#fffcf9', // primary section background
  'cream-alt':   '#fffbf9', // alternating section background (1 digit from cream)
  accent:        '#c3957d', // CTA & form section background (terracotta/clay)
  'accent-soft': '#e6d2c4', // soft accent fill (ImportantInfo bg)
  button:        '#87573e', // primary button fill (deep brown)
  'button-text': '#eeecea', // button label (off-white)
  'ink-deep':    '#6b4532', // headings on light backgrounds
  'ink-body':    '#2d2d2d', // body copy (near-black)
  'ink-night':   '#1a1612', // darkest sections / scrims / overlays
  ivory:         '#faf6ee', // headings/text on photo & dark overlays
  divider:       '#efe5dc', // section separators
  gold:          '#c5a572', // decorative SVG florals/hearts, dark-overlay kickers
}
```

### Token → purpose → hex matrix

| Token | Hex | Primary use |
|---|---|---|
| `hero` | `#b89e8b` | hero + closing-quote background; theme-color meta |
| `cream` | `#fffcf9` | primary section bg; card fills; form input bg |
| `cream-alt` | `#fffbf9` | alternating section bg; marquee bg |
| `accent` | `#c3957d` | CTA/form section bg; sparkles; eyebrows; blob color |
| `accent-soft` | `#e6d2c4` | ImportantInfo section background |
| `button` | `#87573e` | primary button fill; CallPill light theme tint |
| `button-text` | `#eeecea` | primary button label |
| `ink-deep` | `#6b4532` | headings on light bg; badges; footer bg; numbers |
| `ink-body` | `#2d2d2d` | body copy |
| `ink-night` | `#1a1612` | dark photo bands (PhotoMarquee), overlay gradients, scrims |
| `ivory` | `#faf6ee` | overlay headings/captions (also inline `#faf6ee`) |
| `divider` | `#efe5dc` | hairlines, rings, separators |
| `gold` | `#c5a572` | floral SVGs, hearts, dark-overlay kickers, hover rings, splash rings |

### Usage rules
- **Light sections** (cream / cream-alt / accent-soft / ivory): headings use `text-ink-deep`, body uses `text-ink-body` (often `/80`–`/85` opacity for secondary lines).
- **Photo / dark overlays** (Hero, WhyTuBav, ClosingQuote, VideoMoment, CinematicMoment): headings/captions use `text-ivory` **or inline `color: '#faf6ee'`** with `textShadow: '0 2px 6px rgba(0,0,0,0.7)'`. Never `text-ink-deep` on these.
- **LeadForm is the exception, not a photo overlay** — it sits on solid `bg-accent`, so its `<h2>` and field labels use `text-cream` with **no** `textShadow`. Don't copy the ivory/`#faf6ee`+textShadow recipe onto it.
- **Do NOT set a global heading color.** Each section picks its own — a global `h1–h4` color competes with overlay headings via specificity and bleeds brown over photos.
- **Allowed hardcoded-hex exceptions** (literals in JSX/CSS, never tokens): inline overlay headings `#faf6ee`; FloatingDecor `color: '#fff5ef'`; SplashScreen gold bloom & rings; gradient rgba strings that re-express tokens (`rgba(195,149,125,…)` = accent, `rgba(135,87,62,…)` = button, `rgba(250,246,238,…)` = ivory, `rgba(107,69,50,…)` = ink-deep); Tailwind utility colors `rose-300`/`emerald-700`/`rose-800` in the form/toast.

### Selection highlight (in `index.css`)
```css
::selection { background: rgba(135,87,62,0.18); color: #6b4532; }
```

---

## 3. Typography

- **Font family:** `fontFamily.sans = ['Assistant', 'system-ui', 'sans-serif']` (overrides default sans; body + everything inherits Assistant).
- **Load in `<head>`** (weights 300–800, `display=swap`):
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700;800&display=swap" />
  ```

### Global base (`src/index.css`, `@layer base`)
- `html`: `scroll-behavior: smooth; -webkit-text-size-adjust: 100%; position: relative;`
  - `position: relative` is **required** — Framer's `useScroll` (ScrollProgress) warns when its scroll container (`<html>`) is `static`.
- `body` (`@apply bg-cream text-ink-body font-sans antialiased;` + inline): `font-size: 18px; line-height: 1.7; overflow-x: clip;`
  - Base body is **18px / 1.7 line-height** (larger than the 16px browser default).
  - `overflow-x: clip` (not `hidden`) so wide children get clipped without creating a second scroll container. Mirrored on `<main>`.
- `h1, h2, h3, h4` (`@apply font-bold;` + inline): `font-weight: 700; line-height: 1.25;` — **NO color set** (per-section, see §2).
- Utilities (`@layer utilities`): `.text-balance` → `text-wrap: balance;`, `.text-pretty` → `text-wrap: pretty;`, `.cv-auto` → `content-visibility: auto; contain-intrinsic-size: 900px;`.

### Heading size ladder (observed)
| Context | Classes |
|---|---|
| Standard light-section `h2` | `text-3xl sm:text-4xl font-extrabold text-balance text-ink-deep` |
| VideoGallery / Testimonials `h2` | `text-3xl sm:text-4xl lg:text-5xl font-extrabold text-balance text-ink-deep` |
| Hero `h1` | `text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1]` + inline `#faf6ee` |
| WhyTuBav `h2` | `text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1]` + inline `#faf6ee` |
| Cinematic / Video caption | `text-2xl sm:text-4xl lg:text-5xl font-bold leading-snug` + inline `#faf6ee` |
| ClosingQuote | `text-2xl sm:text-4xl italic font-medium` (gradient-clip shimmer) |
| PriceBlock headline | `text-3xl sm:text-5xl font-extrabold leading-tight` |

### Kicker / eyebrow recipe
- Light-overlay gold kicker: `text-xs sm:text-sm tracking-[0.32em] uppercase text-gold` (Hero, Cinematic, Video, Gallery eyebrow uses `text-accent`).
- Testimonials/WhyTuBav attribution kicker: `text-xs sm:text-sm uppercase tracking-[0.28em] text-gold`.
- Letter figcaption: `text-xs sm:text-sm uppercase tracking-[0.32em] text-ink-deep/60`.
- Use `.text-balance` on headings, `.text-pretty` on paragraphs.

---

## 4. Layout primitives (Section + Container)

### Container (`src/components/layout/Container.tsx`)
The single source of the 906px reading column.
```tsx
<div className={`mx-auto w-full max-w-container px-5 sm:px-8 ${className}`}>{children}</div>
```
- `max-w-container` = **`906px`** (`maxWidth.container` token).
- Gutters: `px-5` (20px) base → `sm:px-8` (32px). Symmetric `px-*` is RTL-safe (left == right).
- No background, no motion.

### Section (`src/components/layout/Section.tsx`)
Page-block wrapper that applies the bg token, vertical padding rhythm, auto-mounts a top `BrandLogo` and bottom `CallPill`, and derives a dark/light theme.

**Props:** `children`, `bg?='bg-cream'`, `className?=''`, `id?`, `padded?=true`, `noLogo?=false`, `noPill?=false`.

**Theme derivation:** `const DARK_BGS = new Set(['bg-ink-deep','bg-ink-night','bg-accent','bg-hero'])`. `theme = DARK_BGS.has(bg) ? 'dark' : 'light'`. Emits `data-header-theme={theme}` on `<section>` and passes `theme` to the bottom `CallPill`.

**Markup:**
```tsx
<section id={id} data-header-theme={theme} className={`${bg} ${padded ? `${noLogo ? 'pt-0' : 'pt-4 sm:pt-6'} ${noPill ? 'pb-0' : 'pb-4 sm:pb-6'}` : ''} ${className}`}>
  {!noLogo && <BrandLogo />}
  <div className={padded ? `${noLogo ? 'pt-4 sm:pt-6' : '-mt-6 sm:-mt-8 pt-0'} ${noPill ? 'pb-4 sm:pb-6' : 'pb-8 sm:pb-12 lg:pb-16'}` : ''}>
    <Container>{children}</Container>
  </div>
  {!noPill && <CallPill theme={theme} />}
</section>
```

**Padding rhythm (defaults, logo + pill present):**
| Element | Top | Bottom |
|---|---|---|
| `<section>` | `pt-4 sm:pt-6` (16→24px) | `pb-4 sm:pb-6` (16→24px) |
| inner `<div>` | `-mt-6 sm:-mt-8 pt-0` (negative −24/−32px) | `pb-8 sm:pb-12 lg:pb-16` (32→48→64px) |

The **negative top margin** (`-mt-6 sm:-mt-8`) pulls content up under the floating BrandLogo so the logo overlaps content rather than reserving vertical space. With `noLogo`, the inner top becomes `pt-4 sm:pt-6` instead. With `padded={false}`, all padding strings collapse to `''`. Section sets **no** heading color and adds no decoration of its own.

---

## 5. RTL rules

- `<html lang="he" dir="rtl">` at document level.
- `<meta name="google" content="notranslate" />` so browsers don't machine-translate the Hebrew.
- Use Tailwind **logical** utilities only: `ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*` (including negative `-start-*`, `-end-*`). **Never** `pl/pr/ml/mr` — they break under RTL.
- Wrap LTR numerals/prices (`5,900₪`, `6,077₪`, phone numbers) in `<bdi>` inside RTL paragraphs.
- **Deliberate `dir="ltr"` exceptions** (so number/control math reads left→right): Countdown grid, Payment big price block, all three marquee tracks (`Marquee`, `PhotoMarquee`, `TestimonialsMarquee`), Testimonials video player container.
- **Deliberate physical `left/right` exceptions** (inside force-LTR contexts or for progress math): marquee edge-fade masks; Testimonials seek-bar (`clientX - rect.left`); two drifting `Bloom`s over the testimonials marquee (`left-1/4` / `right-1/4`).
- ScrollProgress uses `transformOrigin: 'right'` so the bar fills from the reading-start (right) edge.

---

## 6. Motion system (Reveal + variants)

Single shared easing: `cubic-bezier(0.22, 1, 0.36, 1)` (Tailwind `ease-soft`, JS `SOFT_EASE = [0.22, 1, 0.36, 1]`).

### Variants (`src/components/motion/variants.ts`)
```ts
export const SOFT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: SOFT_EASE } },
};
export const fadeUpContainer = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
export const fadeUpItem = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: SOFT_EASE } },
};
```
Preserve exact numbers: single reveal **16px / 700ms**; stagger item **14px / 600ms**; stagger gap **80ms**; child delay **50ms**.

### Reveal (`src/components/motion/Reveal.tsx`)
**Props:** `children`, `className?`, `delay?=0`, `as?='div'` (`'div'|'section'|'header'|'article'|'ul'|'li'`), `stagger?=false`.

- **Reduced motion:** renders a plain intrinsic `<Tag className>` with NO animation.
- **Non-stagger:** `motion[as]` with `initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}`, `variants={fadeUp}`, `transition={{ duration: 0.7, ease: SOFT_EASE, delay }}`. Fires once at 15% visible, unobserves itself (no replay on scroll-up).
- **Stagger:** `variants={fadeUpContainer}`, no explicit `transition` (children timing comes from the variants).
- **`Reveal.Item`** (`as?='div'|'li'`): uses `fadeUpItem`, no own `initial`/`whileInView`/`transition` (inherits orchestration). Also short-circuits to a plain tag under reduced motion.
- **Usage:** `<Reveal>` for one fade-up; `<Reveal stagger as="ul">` + `<Reveal.Item as="li">` for a staggered list.

### Hard rules
- Every animated component calls `useReducedMotion()` and short-circuits when true.
- No bounce, no rotate as primary motion, and hover scale bumps kept tiny. The **intentional exceptions above 1.02** are: TestimonialsMarquee card `hover:scale-[1.03]`, Gallery image `whileHover` scale `1.06`, VideoGallery tile `whileHover` scale `1.025` + play-icon `group-hover:scale-110`, the Button pulse halo `1.12`, and lightbox image scales. Rotation is decorative-only: Divider's slow 360° spin and the Bloom 0→15° wobble.
- `Reveal` fires once.
- Lists stagger at `staggerChildren: 0.08`.
- Looping decor uses `'easeInOut'`; the Divider sparkle and all marquees use `'linear'`.

---

## 7. Shadows, radii & decorative SVG vocabulary

### Box shadows (`tailwind.config.ts → theme.extend.boxShadow`)
```ts
boxShadow: {
  card: '0 1px 2px rgba(107, 69, 50, 0.06), 0 8px 24px rgba(107, 69, 50, 0.08)', // warm 2-layer
  cta:  '0 6px 18px rgba(135, 87, 62, 0.25)',                                      // CTA glow
}
```
All shadows are warm-brown-tinted, never neutral black. `rgb(107,69,50)` = ink-deep, `rgb(135,87,62)` = button.

**Literal hover/inline shadows** (re-express tokens, allowed):
| Where | Value |
|---|---|
| Button hover (primary) | `0_14px_30px_rgba(135,87,62,0.4)` |
| Card hover | `0 18px 38px rgba(107,69,50,0.16)` |
| Photo/video tile | `0_8px_24px_rgba(0,0,0,0.35)` |
| Lightbox image | `0_20px_60px_rgba(0,0,0,0.5)` |

### Easing & timing token
`transitionTimingFunction.soft = 'cubic-bezier(0.22, 1, 0.36, 1)'` → utility `ease-soft`.

### Radii in use
`rounded-full` (buttons, badges, pills, blobs, dots, play-icon), `rounded-xl` (12px: form inputs, info pills, photo cards, toast), `rounded-2xl` (16px: Card, gallery tiles, Countdown cells, lightbox image), `rounded-3xl` (24px: media cards, PriceBlock panel, letter figure, video tiles at `lg`).

### Shared decorative SVG motifs (color via `text-gold`, `#c5a572`)
- **4-point sparkle** path (Divider + FloatingDecor `sparkle`):
  `M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z`
- **Heart** (FloatingDecor `heart`): `M12 21s-7.5-4.8-9.6-9.3C.9 8 3 4 6.7 4c2 0 3.5 1 5.3 3 1.8-2 3.3-3 5.3-3 3.7 0 5.8 4 4.3 7.7C19.5 16.2 12 21 12 21z`
- **HeartFlourish** (Letter + Testimonials): viewBox `0 0 24 24`, `fill=currentColor`, path `M12 21 C5 16 1 11 4 6 Q7 2 12 6 Q17 2 20 6 C23 11 19 16 12 21 Z`.
- **FloralSpray** (Letter + Testimonials, identical): viewBox `0 0 80 200`, `fill=none stroke=currentColor strokeWidth=1.3 strokeLinecap=round`, optional `flipped` via inline `transform: scaleX(-1)`. Central vine `M40 8 Q44 40 36 80 Q28 120 44 160 Q48 180 40 196`, 4 curly tendrils, a `<g fill=currentColor>` of four 5-dot rosette clusters (center r=2.5 + four r=1.6 satellites), 3 leaf paths at opacity 0.7.
- **Corner leaf flourish** (Letter `h-10 w-10`, Testimonials `h-12 w-12`): 48×48, `fill=none stroke=currentColor strokeWidth=1.4`. Top-start curl `M4 44 Q4 20 24 4` + filled leaf `M10 36 Q18 28 26 30 Q22 38 10 36 Z` (opacity 0.6) + `circle cx=6 cy=42 r=1.6`; bottom-end mirrors it (`M44 4 Q44 28 24 44`, `circle cx=42 cy=6 r=1.6`).
- **Bloom** (Testimonials only): 24×24, `fill=currentColor`, 8 ellipse petals + center `circle r=1.6 fill=#faf6ee` (the one non-gold fill).
- **Wave dividers** (Testimonials): small viewBox `0 0 24 8` (`text-gold/70`) and wide `0 0 60 8` (`text-gold/60`) sine paths flanking the heart.

---

## 8. Per-section logo + call-pill pattern

Each section behaves like its own "page": a **centered brand logo at the top** and a **centered call-pill at the bottom**, repeated down the entire scroll. They are auto-rendered by the shared `<Section>` wrapper — never hand-placed inside a section's content (except full-bleed photo sections that hand-roll their own structure, e.g. Hero/WhyTuBav/ClosingQuote/VideoGallery, which render `<BrandLogo />` + `<CallPill theme="dark"/>` manually).

### Brand logo (top, in-flow — `src/components/ui/BrandLogo.tsx`)
- Wrapper: `<div className="w-full flex items-center justify-center pt-1 pb-0 sm:pt-2">`.
- Button: `type="button"`, `onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}`, `aria-label="חזרה לראש הדף"`, `className="bg-transparent border-0 p-0 cursor-pointer hover:opacity-90 transition-opacity"`.
- Image: `src={editorial.logo}` (`/images/logo.webp`), `alt="אור הצדיק"`, `className="block h-48 w-48 sm:h-56 sm:w-56 lg:h-64 lg:w-64"`, `loading="lazy" decoding="async"`. **Size: 192 → 224 (sm) → 256px (lg)**, square, no radius/shadow.
- No motion (CSS hover opacity only).

### Call-pill (bottom, in-flow — `src/components/ui/CallPill.tsx`)
- Props: `theme?: 'dark' | 'light'` (default `'light'`).
- Wrapper: `<div className="w-full flex items-center justify-center pt-2 pb-8 sm:pt-3 sm:pb-10">`.
- Anchor: `href={tel:${footer.phone.replace(/-/g,'')}}` (→ `tel:0502696862`), inline `style` from theme table, `className="group inline-flex items-center gap-2 sm:gap-2.5 rounded-full border px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold tracking-wide hover:scale-[1.02] backdrop-blur-sm"`.
- Content: phone `<svg viewBox="0 0 24 24">` (`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-none`, `fill=none stroke=currentColor strokeWidth=2.2 strokeLinecap=round strokeLinejoin=round`, handset path `M22 16.92v3a2 2 0 01-2.18 2…Z`) + `<span class="opacity-80">{phoneLabel}</span>` + `<span aria-hidden class="opacity-40">·</span>` + `<bdi class="font-bold">{phone}</bdi>`.
- **Theme colors** (inline `style`, exact rgba):
  | theme | bg | border | text |
  |---|---|---|---|
  | `light` (cream/cream-alt/ivory/accent-soft/white) | `rgba(135,87,62,0.08)` | `rgba(135,87,62,0.22)` | `rgba(107,69,50,1)` |
  | `dark` (ink-deep, ink-night, accent, hero) | `rgba(250,246,238,0.16)` | `rgba(250,246,238,0.35)` | `rgba(250,246,238,0.95)` |
- No Framer (CSS hover scale only).

> Reproduce this exactly on the sibling page: logo top-center, pill bottom-center, repeated per section, pill color following the section background. Do **not** convert either into a single fixed/floating element (the fixed variant is a separate component, `SiteHeader` — see §9).

---

## 9. Persistent / chrome UI

| Component | Placement / z-index | Behavior |
|---|---|---|
| `SplashScreen` | full-screen `z-[100]` | 3.5s brand hold, fades out 0.6s. Mounted first in App. |
| `ScrollProgress` | `fixed top-0 z-50` | 3px gradient bar, spring-smoothed scaleX, fills from the right. |
| `SiteHeader` (optional) | fixed top + bottom `z-50` | floating logo + auto-theming call-pill (see catalog). |
| `BrandLogo` | top of each section | in-flow, scrolls to top on click. |
| `CallPill` | bottom of each section | tel link, theme by section bg. |
| `Countdown` | inside Hero | live 4-cell countdown to `tripDate`, 1s tick. |

> Note: in the current `App.tsx` snapshot only `SplashScreen` + `ScrollProgress` are mounted globally; `SiteHeader` exists as a component but the in-flow `BrandLogo`/`CallPill` (auto-mounted by `Section`, or hand-placed on full-bleed sections) are what actually appear per section. If the sibling page uses the fixed `SiteHeader` instead, do not double up with per-section logos.

- **Office phone** is a single `footer.phone` constant (`'050-2696862'`) + `footer.phoneLabel` (`'טלפון המשרד'`). One source of truth, consumed by every pill + footer.
- **Countdown date** is a single `tripDate` constant in `copy.he.ts`. Change the flight date there, never in the component.
- **theme-color** meta = `#b89e8b`.

---

## 10. UI component catalog

Exact classes, props, sizes, responsive variants, and motion for every atom.

### 10.1 Button (`ui/Button.tsx`)
- Element: `motion.button`. Props extend `ButtonHTMLAttributes` (Omit `onAnimationStart|onDragStart|onDragEnd|onDrag`) + `children`, `variant?='primary'|'ghost'`, `pulse?=false`, `className=''`. `...rest` spread `as any`.
- Base classes:
  `relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide select-none px-10 py-4 text-base sm:text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-ink-deep/20 transition-shadow ease-soft duration-200 isolate`
  - Padding `px-10 py-4` (40/16px); font `text-base` → `sm:text-lg`; focus ring 4px ink-deep@20%; `transition-shadow ease-soft duration-200`; `isolate` (for the `-z-10` pulse).
- Variants:
  - `primary`: `bg-button text-button-text shadow-cta hover:shadow-[0_14px_30px_rgba(135,87,62,0.4)]`.
  - `ghost`: `bg-transparent text-ink-deep border border-ink-deep/30 hover:border-ink-deep/60`.
- Motion: `whileHover={{ y: -3 }}`, `whileTap={{ y: 0, scale: 0.98 }}`, `transition={{ duration: 0.18, ease: [0.22,1,0.36,1] }}`. Lift via Framer; shadow grow via CSS. No color shift.
- **Pulse halo** (only when `pulse && !reduced && variant==='primary'`): `<motion.span aria-hidden className="absolute inset-0 rounded-full bg-button -z-10" animate={{ scale:[1,1.12,1], opacity:[0.5,0,0.5] }} transition={{ duration:2.4, ease:'easeInOut', repeat:Infinity }} />`. Children wrapped in `<span className="relative">`.
- Reduced motion: all motion props `undefined`, pulse suppressed.

### 10.2 Card (`ui/Card.tsx`)
- Element: `motion.div`. Props: `children`, `className=''`.
- Base: `rounded-2xl bg-cream/95 shadow-card ring-1 ring-divider/80 p-5 sm:p-6 text-ink-body text-pretty backdrop-blur-[1px]`.
- Hover: `whileHover={{ y: -4, boxShadow: '0 18px 38px rgba(107,69,50,0.16)' }}`, `transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}`. Reduced → static.
- Body-only (no heading color). Callers override padding with `!p-3 sm:!p-6` etc.

### 10.3 Badge (`ui/Badge.tsx`)
- Plain `<span>` (no motion). Props: `{ children }` only.
- `inline-flex items-center rounded-full bg-ink-deep/10 px-4 py-1.5 text-sm font-semibold text-ink-deep ring-1 ring-ink-deep/15`. Fully static.

### 10.4 Divider (`ui/Divider.tsx`)
- No props. Outer `<div className="bg-cream">` (paints cream behind itself).
- Row: `mx-auto flex w-full max-w-container items-center gap-4 px-5 sm:px-8`.
- Two hairlines: left `h-px flex-1 bg-gradient-to-l from-transparent via-divider to-transparent`, right same with `bg-gradient-to-r`.
- Sparkle `<motion.svg width=22 height=22 viewBox="0 0 24 24" fill=currentColor className="text-accent flex-none" animate={{ rotate:[0,360] }} transition={{ duration:28, ease:'linear', repeat:Infinity }}>` with the shared 4-point sparkle path. Reduced → no spin.

### 10.5 FloatingDecor (`ui/FloatingDecor.tsx`)
- `motion.svg`. Props: `shape?='heart'|'sparkle'|'circle'`, `className=''`, `size?=28`, `delay?=0`, `duration?=6`, `drift?=8`, `opacity?=0.18`.
- `viewBox="0 0 24 24" fill=currentColor className="pointer-events-none select-none …"`, inline `style={{ color: '#fff5ef', opacity }}` (hardcoded ivory).
- Motion: `animate={{ y:[0,-drift,0] }}`, `transition={{ duration, ease:'easeInOut', repeat:Infinity, delay }}`. Reduced → static. Positioning via passed `className`.

### 10.6 BlobBackdrop (`ui/BlobBackdrop.tsx`)
- `motion.div`. Props: `position?='top-right'` (`top-left|top-right|bottom-left|bottom-right`), `color?='bg-accent'`, `size?=420`, `opacity?=0.18`.
- Position map (logical): `top-left → top-[-10%] start-[-10%]`, `top-right → top-[-10%] end-[-10%]`, `bottom-left → bottom-[-10%] start-[-10%]`, `bottom-right → bottom-[-10%] end-[-10%]`.
- Class: `pointer-events-none absolute -z-10 rounded-full blur-3xl ${color} ${POS}`; inline `style={{ width:size, height:size, opacity }}`.
- Motion: `animate={{ scale:[1,1.08,1], x:[0,10,0], y:[0,-8,0] }}`, `transition={{ duration:14, ease:'easeInOut', repeat:Infinity }}`. Reduced → static. Needs a `relative` ancestor.

### 10.7 BrandLogo / CallPill
See §8.

### 10.8 CountUp (`ui/CountUp.tsx`)
- `<span ref>`. Props: `to`, `duration?=1.8` (seconds), `className?`, `locale?='he-IL'`.
- `useInView(ref, { once: true, amount: 0.4 })` → animates `animate(0, to, { duration, ease:[0.22,1,0.36,1], onUpdate: v => setValue(Math.round(v)) })`. Renders `value.toLocaleString(locale)` (5900 → `5,900`).
- Reduced → starts at final value, no animation. No styling of its own.

### 10.9 Countdown (`ui/Countdown.tsx`)
- Reads `tripDate` from `copy.he`. `targetMs = new Date(tripDate.iso).getTime()`. `diffToParts` returns `null` once delta ≤ 0. `setInterval(…, 1000)` tick.
- **After flight:** `<p className="text-base sm:text-lg text-ivory/90 mb-10">{tripDate.afterFlightMessage}</p>`.
- **Active grid:** `<div dir="ltr" className="mx-auto mb-10 grid max-w-md grid-cols-4 gap-2 sm:gap-3">`. Cells order `[days, hours, minutes, seconds]`.
- Cell: `flex flex-col items-center justify-center rounded-2xl bg-cream/95 px-2 py-3 sm:py-4 shadow-card ring-1 ring-ink-deep/10`.
  - Number: `text-2xl sm:text-4xl font-extrabold text-ink-deep tabular-nums leading-none`, value `String(n).padStart(2,'0')`.
  - Label: `mt-1.5 text-[10px] sm:text-xs uppercase tracking-widest text-ink-deep/60`.
- No reduced-motion gate (it's a clock). Designed for a **dark** background context.

### 10.10 ScrollProgress (`ui/ScrollProgress.tsx`)
- `motion.div`, `aria-hidden`. `useScroll()` → `useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.35 })`.
- `style={{ scaleX, transformOrigin: 'right' }}` (RTL: fills from right).
- `className="fixed top-0 inset-x-0 h-[3px] bg-gradient-to-l from-button via-accent to-hero z-50"`.

### 10.11 SiteHeader (`ui/SiteHeader.tsx`)
- Fixed transparent chrome: floating logo top-center + floating call-pill bottom-center, both `z-50`, `pointer-events-none` with inner `pointer-events-auto` elements.
- `PILL_BOTTOM_OFFSET = 80`. Probes which `[data-header-theme]` section straddles `window.innerHeight - 80` on `scroll`/`resize` (`{ passive: true }`) and re-themes the pill. Starts `'dark'` (hero first). Same `STYLES` rgba table as CallPill.
- Logo header: `fixed top-0 inset-x-0 z-50 flex items-center justify-center py-1.5 sm:py-2 pointer-events-none`; img `block h-32 w-32 sm:h-36 sm:w-36 lg:h-40 lg:w-40` (**128/144/160px**, smaller than in-flow BrandLogo), `loading="eager"`.
- Bottom pill: `fixed bottom-0 inset-x-0 z-50 … pb-4 sm:pb-5`; anchor adds inline `transition: 'background-color 0.35s ease, border-color 0.35s ease, color 0.35s ease'` (the dark↔light crossfade — **not** present in standalone CallPill). Identical pill geometry + SVG + text run as CallPill.
- No Framer (CSS transition + hover scale only).

### 10.12 SplashScreen (`ui/SplashScreen.tsx`)
- `AnimatePresence`. `HOLD_MS = 3500`, `REDUCED_HOLD_MS = 800`. No scroll lock.
- Root `motion.div key="splash" initial={false} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease:[0.22,1,0.36,1] }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream"`.
- Radial bloom: inline `radial-gradient(ellipse 55% 45% at 50% 45%, rgba(197,165,114,0.24) 0%, rgba(197,165,114,0) 70%)` (gold @24%).
- Inner group: `initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}`.
- 3 pulse rings (`!reduced`): `ring-2 ring-gold` circles, `initial={{ scale:1, opacity:0.55 }} animate={{ scale:1.6, opacity:0 }} transition={{ duration:2.4, ease:'easeOut', repeat:Infinity, delay:i*0.8 }}`.
- Logo `motion.img animate={{ scale:[1,1.02,1] }} transition={{ duration:3.2, ease:'easeInOut', repeat:Infinity }}`, `className="relative block h-44 w-44 sm:h-56 sm:w-56 lg:h-64 lg:w-64 rounded-full object-cover shadow-card ring-2 ring-gold/80"` (**176/224/256px**), `loading="eager" decoding="sync"`, `alt=""`.
- Reduced: rings skipped, entrance/breath skipped, hold 800ms, only 0.6s exit fade remains.

### 10.13 Marquee (text ticker — `ui/Marquee.tsx`)
- Props: `items: readonly string[]`, `speed?=38` (loop duration s; higher = slower).
- `const loop = [...items, ...items]`. Wrapper `dir="ltr" aria-hidden className="relative overflow-hidden py-5 bg-cream-alt border-y border-divider"` (1px borders, not 2px).
- Track `motion.div className="flex w-max whitespace-nowrap will-change-transform" animate={{ x:['0%','-50%'] }} transition={{ duration:speed, ease:'linear', repeat:Infinity, repeatType:'loop' }}` (reduced → undefined).
- Item `<span className="px-6 inline-flex items-center gap-3 text-ink-deep text-base sm:text-lg font-semibold">` → `<bdi>{item}</bdi>` + `<span aria-hidden className="text-accent">✦</span>`.
- Edge masks `w-16` (64px): left `bg-gradient-to-r from-cream-alt to-transparent`, right `bg-gradient-to-l from-cream-alt to-transparent` (both `pointer-events-none absolute inset-y-0 … z-10`).

### 10.14 PhotoMarquee (`ui/PhotoMarquee.tsx`)
- Props: `photos`, `speed?=50`, `height?='sm'|'md'|'lg'` (default `'md'`).
- Height map: `sm: 'h-32 sm:h-40'` (128→160), `md: 'h-44 sm:h-56'` (176→224), `lg: 'h-56 sm:h-72'` (224→288). Width via `aspect-[3/4]`.
- `useInView(ref, { amount: 0, margin: '200px' })` pauses the loop off-screen.
- Wrapper `ref data-header-theme="dark" dir="ltr" aria-hidden className="relative overflow-hidden bg-ink-night py-3"`.
- Track `flex w-max gap-3 sm:gap-4 will-change-transform`; animate only when `!reduced && inView`.
- Card `${H[height]} flex-none aspect-[3/4] overflow-hidden rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.35)]` with `<img class="h-full w-full object-cover" loading="lazy" decoding="async" alt="">`.
- Edge masks `w-20` (80px), `from-ink-night to-transparent`.

### 10.15 TestimonialsMarquee (`ui/TestimonialsMarquee.tsx`)
- Props: `photos`, `speed?=80`. Transparent bg (inherits parent; cream-alt edge fades).
- State: `active: string | null` (lightbox). `isMoving = !reduced && inView && active === null` (pauses while lightbox open). Escape key closes.
- Wrapper `ref dir="ltr" className="relative overflow-hidden py-3"` (NOT `aria-hidden` — interactive). Track `flex w-max gap-3 sm:gap-4 will-change-transform`; transition when moving `{ duration:speed, ease:'linear', repeat:Infinity, repeatType:'loop' }`, else `{ duration: 0.3 }`.
- Card `<button type="button" aria-label="הגדל תמונה" className="h-44 sm:h-56 flex-none aspect-[3/4] overflow-hidden rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.35)] cursor-zoom-in hover:scale-[1.03] transition-transform bg-ink-night">`; img `h-full w-full object-cover pointer-events-none`.
- Edge masks `w-20`, `from-cream-alt to-transparent`.
- Lightbox (AnimatePresence): backdrop `fixed inset-0 z-[100] bg-ink-night/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out` (opacity 0↔1, 0.25s); image `max-h-[88vh] max-w-[92vw] object-contain rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] cursor-default` (scale 0.94↔1, stops propagation); close button `absolute top-4 end-4 sm:top-6 sm:end-6 h-10 w-10 rounded-full bg-cream/90 text-ink-deep hover:bg-cream … shadow-lg` with X path `M6 6 L18 18 M18 6 L6 18` (strokeWidth 2.4).

### Cross-cutting marquee facts
All three: force `dir="ltr"`, duplicate the array (`[...x, ...x]`) for a seamless `x:['0%','-50%']` wrap, `will-change-transform`, identical linear infinite loop transition. Speeds: Marquee 38 (fastest) < PhotoMarquee 50 < TestimonialsMarquee 80. Photo cards share `flex-none aspect-[3/4] overflow-hidden rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.35)]`. The `from-` mask color must match the surface (cream-alt or ink-night).

---

## 11. Section-by-section catalog (reading order)

### 11.1 Hero (`sections/Hero.tsx`)
- Bespoke `<header>` (not `Section`): `ref data-header-theme="dark" className="relative isolate min-h-[100svh] overflow-hidden text-ivory flex flex-col"`.
- Background `motion.div -z-20` with scroll parallax: `useScroll({ target: ref, offset: ['start start','end start'] })`; `bgScale = useTransform([0,1],[1,1.08])`, `bgY = useTransform([0,1],[0,80])`. `style={{ scale: reduced?1:bgScale, y: reduced?0:bgY }}`.
  - Normal: `<video src={editorial.heroVideo} poster={editorial.heroVideoPoster} autoPlay muted loop playsInline preload="metadata" aria-hidden className="h-full w-full object-cover">`.
  - Reduced: `<img src={editorial.heroBackdrop} alt="" className="h-full w-full object-cover" fetchpriority="high">`.
- Overlays (`-z-10`): linear `bg-gradient-to-b from-ink-night/75 via-ink-night/82 to-ink-night/95` + radial scrim `radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 55%, transparent 85%)`.
- `<BrandLogo />` then `<CallPill theme="dark" />` (hand-placed). `TEXT_SHADOW = '0 2px 6px rgba(0,0,0,0.7)'`.
- Container `relative flex flex-1 flex-col items-center justify-start text-center -mt-6 sm:-mt-8 pt-0 pb-12`.
- Content stack: spotlight kicker (`text-xs sm:text-sm tracking-[0.32em] uppercase text-gold mb-6`, `hero.spotlight`); `h1` (`text-balance text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 max-w-3xl`, inline `#faf6ee`, entrance fade-up 32px + letterSpacing 0.05em→0em over 1.3s delay 0.15, `hero.title`); subtitle (`text-pretty text-lg sm:text-2xl max-w-xl mx-auto mb-8 font-light`, delay 0.3); countdown kicker (`text-[10px] sm:text-xs tracking-[0.32em] uppercase text-gold mb-3`, delay 0.4); `<Countdown />` (delay 0.45); `<Button pulse>` (delay 0.55, scrolls down 90% viewport); bouncing scroll chevron (`mt-10 … h-14 w-14 sm:h-16 sm:w-16`, down-chevron path `M6 9l6 6 6-6`, `animate={{ y:[0,5,0] }}` 1.8s loop).
- Heading color: inline `#faf6ee`.

### 11.2 PhotoMarquee strip
`<PhotoMarquee photos={editorial.marqueeStrip} height="md" />` — dark `ink-night` band, 32 photos, height `md` (176→224px). See §10.14.

### 11.3 Intro (`sections/Intro.tsx`)
- `<Section bg="bg-cream" className="relative overflow-hidden">`. **No `<h2>`** (paragraph-led).
- Grid `grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center`.
- Media card (Reveal): `motion.div whileHover={{ scale: 1.015 }} transition={{ duration:0.6, ease:[0.22,1,0.36,1] }} className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card ring-1 ring-divider"`. Video `editorial.ronitVideo`/`ronitVideoPoster` (reduced → `<img src={editorial.ronitMoment}>`). Overlay `bg-gradient-to-t from-ink-night/30 via-transparent to-transparent`.
- Text column `space-y-5 text-center lg:text-start`: `intro.lines.map` each `<Reveal delay={i*0.06}>` → `<p className="text-lg sm:text-xl text-ink-body text-pretty">`; highlights `<Reveal as="ul" stagger className="pt-6 space-y-3 text-base sm:text-lg text-ink-deep">` → plain `<Reveal.Item as="li">` text (no bullets).

### 11.4 CinematicMoment ×3 (`sections/CinematicMoment.tsx`)
- Full-bleed background-**image** interstitial. Props: `image`, `caption?`, `height?='tall'|'standard'|'short'` (default standard), `kicker?`, `flourish?`.
- `HEIGHTS`: `tall: 'min-h-[45svh]'`, `standard: 'min-h-[35svh]'`, `short: 'min-h-[28svh]'`.
- Wrapper `ref data-header-theme="dark" className="relative isolate overflow-hidden text-ivory ${HEIGHTS[height]} flex flex-col"`.
- Parallax `motion.div -z-20`: `useScroll(offset ['start end','end start'])`, `y=useTransform([0,1],[-40,40])`, `scale=useTransform([0,0.5,1],[1.05,1,1.05])`. Background **always** `<img src={image} … loading="lazy" decoding="async">` (reduced only freezes parallax).
- Overlays identical to Hero (`from-ink-night/75 via/82 to/95` + the 70%/55% radial scrim). `<BrandLogo />`, `<CallPill theme="dark" />`.
- Caption block `relative flex-1 flex items-center -mt-8 sm:-mt-12` → `<Container className="relative text-center py-12 w-full">`: kicker (`text-xs sm:text-sm tracking-[0.32em] uppercase text-gold mb-5`), caption (`mx-auto max-w-2xl text-balance text-2xl sm:text-4xl lg:text-5xl font-bold leading-snug`, inline `#faf6ee`, delay 0.08), flourish (`mt-5 italic text-base sm:text-lg`, delay 0.18). All with `textShadow: '0 2px 6px rgba(0,0,0,0.7)'`.
- App instances: `shofarTall` (standard), `umanGate` (tall), `challahTable` (standard).

### 11.5 PriceBlock (`sections/PriceBlock.tsx`)
- `<Section bg="bg-cream-alt" noPill>`. Single Reveal panel `mx-auto max-w-2xl text-center rounded-3xl bg-white/70 ring-1 ring-divider px-8 py-12 sm:py-14 shadow-card`.
- `<Badge>{priceTeaser.kicker}</Badge>` (mb-5); headline `text-3xl sm:text-5xl font-extrabold text-ink-deep text-balance leading-tight mb-5`; body `text-lg sm:text-xl text-ink-body text-pretty mb-10`; `<Button pulse>` scrolls down 90% viewport height.

### 11.6 LetterFromRonit (`sections/LetterFromRonit.tsx`)
- `<Section bg="bg-cream-alt" noLogo className="relative overflow-hidden">` (light pill at bottom, no top logo). **No `<h2>`** — titled only by a figcaption kicker.
- Blobs: `BlobBackdrop position="top-left" color="bg-accent" size={380} opacity={0.22}` + `position="bottom-right" color="bg-gold" size={420} opacity={0.18}`.
- Radial spotlight `-z-10`: `radial-gradient(ellipse 55% 55% at 50% 50%, rgba(195,149,125,0.32) 0%, transparent 65%)`. Hatch texture `-z-10 opacity-[0.05]`: `repeating-linear-gradient(135deg, rgba(135,87,62,1) 0 1px, transparent 1px 14px)`.
- Content `relative mx-auto max-w-xl`: two flanking `FloralSpray` (`hidden sm:block absolute -start-20 lg:-start-28 top-1/2 -translate-y-1/2 h-[320px] w-20 opacity-80`, end side `flipped`); heart-kicker row (`h-px w-8 bg-gold/50` + `HeartFlourish h-3 w-3` + `h-px w-8 bg-gold/50`).
- Figure card `relative rounded-3xl bg-cream p-5 sm:p-8 shadow-card ring-1 ring-gold/30` with two corner leaf flourishes (`-top-4 -start-4 h-10 w-10`, `-bottom-4 -end-4 h-10 w-10`), figcaption (`mb-5 text-center text-xs sm:text-sm uppercase tracking-[0.32em] text-ink-deep/60`, `letterFromRonit.kicker`), and `<picture><source srcSet={letterFromRonit.image} type="image/webp"><img src={letterFromRonit.imageFallback} alt={letterFromRonit.alt} … className="block w-full h-auto rounded-2xl"></picture>`.

### 11.7 WhyTuBav (`sections/WhyTuBav.tsx`)
- Bare `<section ref data-header-theme="dark" className="relative isolate overflow-hidden text-ivory min-h-[110svh] flex flex-col">`. Manual `<BrandLogo />` + `<CallPill theme="dark" />`.
- Background `<img src={editorial.shofar}>` in a `motion.div -z-20` with parallax (`y -40→40`, `scale 1.05→1→1.05`, offset `['start end','end start']`).
- Overlays: `bg-gradient-to-b from-ink-night/78 via-ink-night/85 to-ink-night/95` + radial scrim `radial-gradient(ellipse 75% 60% at 50% 50%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 55%, transparent 85%)`.
- Container `relative text-center flex-1 flex flex-col justify-center py-12 -mt-20 sm:-mt-28`.
- `h2` (`text-balance text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-10 max-w-3xl mx-auto`, inline `#faf6ee` + `TEXT_SHADOW`, `whyTuBav.title`); blockquote (`mx-auto max-w-2xl text-2xl sm:text-3xl lg:text-4xl font-bold italic leading-snug text-balance mb-3`, content `„{quote}״`, delay 0.1); attribution (`text-xs sm:text-sm uppercase tracking-[0.28em] text-gold mb-12`, delay 0.18); paragraph stack `<Reveal as="div" stagger className="mx-auto max-w-2xl space-y-4">` → `<Reveal.Item>` → `<p className="text-base sm:text-lg lg:text-xl text-pretty">` inline `#faf6ee`.

### 11.8 WhatAwaits (`sections/WhatAwaits.tsx`)
- `<Section bg="bg-cream-alt" className="relative overflow-hidden">`.
- Blobs: `position="top-right" color="bg-accent" opacity={0.16}` + `position="bottom-left" color="bg-hero" opacity={0.14} size={360}`.
- Heading `text-center mb-12` → `h2 text-3xl sm:text-4xl font-extrabold text-balance text-ink-deep` (`whatAwaits.title`).
- Grid `<Reveal as="ul" stagger className="relative grid gap-3 sm:gap-5 grid-cols-2 lg:grid-cols-3">`; items `<Card className="h-full text-center text-sm sm:text-lg leading-snug sm:leading-relaxed !p-3 sm:!p-6">{item}</Card>`.

### 11.9 Divider · WhoFor · Divider · ImportantInfo · Divider · Itinerary
The three `<Divider />` rules bracket this info cluster.

**WhoFor (`sections/WhoFor.tsx`):** `<Section bg="bg-cream">`, inner `mx-auto max-w-2xl`. Heading `mb-10` (`whoFor.title`). List `<Reveal as="ul" stagger className="space-y-4">`; rows `flex items-start gap-3 sm:gap-4 rounded-xl bg-white/60 ring-1 ring-divider px-5 py-4 shadow-card` with check badge `mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent text-cream text-sm font-bold` (`✓`) + text `text-lg text-ink-body text-pretty`.

**ImportantInfo (`sections/ImportantInfo.tsx`):** `<Section bg="bg-accent-soft">`, inner `mx-auto max-w-2xl`. Heading `mb-10` (`importantInfo.title` — leads with ⚠️). List `<Reveal as="ul" stagger className="space-y-3">`; pill `flex items-start gap-3 rounded-xl bg-cream/80 ring-1 ring-ink-deep/10 px-5 py-4` with dot marker `mt-1 h-2 w-2 flex-none rounded-full bg-ink-deep/60` + text `text-lg text-ink-body text-pretty`.

**Itinerary (`sections/Itinerary.tsx`):** `<Section bg="bg-cream-alt" className="relative overflow-hidden">`. Blobs `position="top-left" color="bg-accent" opacity={0.14}` + `position="bottom-right" color="bg-hero" opacity={0.16} size={400}`. Heading `mb-12` (`itinerary.title`). Grid `<Reveal as="ul" stagger className="relative grid gap-3 sm:gap-5 grid-cols-2">` (**2 cols at all sizes**); card `<Card className="h-full flex items-start gap-2 sm:gap-3 !p-3 sm:!p-6">` with numbered badge `mt-0.5 inline-flex h-6 w-6 sm:h-7 sm:w-7 flex-none items-center justify-center rounded-full bg-ink-deep/10 text-ink-deep font-bold text-xs sm:text-sm` (`{i+1}`) + text `text-sm sm:text-lg leading-snug sm:leading-relaxed text-ink-body text-pretty`.

### 11.10 VideoGallery (`sections/VideoGallery.tsx`)
- Hand-rolled (NOT `Section`): `<section data-header-theme="light" className="bg-cream-alt pt-4 sm:pt-6 pb-4 sm:pb-6 cv-auto">` + manual `<BrandLogo />`, inner `-mt-6 sm:-mt-8 pt-0 pb-8 sm:pb-12 lg:pb-16`, bottom `<CallPill theme="light" />`.
- Heading (in Container) `text-center mb-10 lg:mb-14`: `h2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-balance text-ink-deep mb-3` (`videoGallery.title`) + subtitle `text-base sm:text-lg text-ink-body/80` (`videoGallery.subtitle`).
- Grid breaks wider: outer `mx-auto w-full max-w-7xl px-5 sm:px-8`, inner `<Reveal as="ul" stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-6">`. 20 clips (`editorial.videoGallery`, video-07..video-26).
- **VideoTile:** `motion.div whileHover={{ scale:1.025, y:-2 }} transition={{ duration:0.4, ease:[0.22,1,0.36,1] }} className="group relative aspect-square w-full overflow-hidden rounded-2xl lg:rounded-3xl ring-1 ring-divider shadow-card bg-ink-night/10 hover:shadow-cta transition-shadow"`. Click-to-play `<video preload="none" onEnded=…>` with muted-autoplay fallback; `currentTime` not reset on pause. Idle bottom gradient `from-ink-night/50 via-ink-night/10 to-transparent`; hover ring `ring-2 ring-inset ring-gold/0 group-hover:ring-gold/40`; full-tile `<button z-10 focus-visible:ring-4 focus-visible:ring-cream/40>`; centered play icon (`h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded-full bg-cream/95 text-ink-deep shadow-cta backdrop-blur group-hover:scale-110`, triangle `M8 5v14l11-7z`, `ms-1`); mute pill (`absolute bottom-2 end-2 z-30 rounded-full bg-cream/90 px-3 py-1.5 text-xs sm:text-sm font-semibold text-ink-deep shadow-cta`).

### 11.11 Testimonials (`sections/Testimonials.tsx`)
- `<Section bg="bg-cream-alt" className="relative overflow-hidden">` (full logo + light pill).
- Blobs: `top-left bg-accent 420/0.28`, `top-right bg-gold 300/0.2`, `bottom-right bg-button 460/0.2`. Radial spotlight `radial-gradient(ellipse 60% 50% at 50% 55%, rgba(195,149,125,0.4) 0%, transparent 65%)`.
- Header `text-center mb-6 lg:mb-8`: kicker `text-xs sm:text-sm uppercase tracking-[0.28em] text-gold mb-3`; `h2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-balance text-ink-deep mb-3` (delay 0.05); wave+heart flourish row (delay 0.08); subtitle `text-base sm:text-lg text-ink-body/80 max-w-md mx-auto text-pretty` (delay 0.1).
- Video tile (delay 0.15): outer `relative mx-auto max-w-[220px] sm:max-w-[260px]`; **pulsing halo** `motion.div -inset-10 -z-10 rounded-[2.5rem] blur-3xl` with `radial-gradient(circle, rgba(195,149,125,0.8) 0%, transparent 70%)`, `animate={{ scale:[1,1.08,1], opacity:[0.9,1,0.9] }}` 4s loop (**does NOT gate on reduced motion**). Flank `FloralSpray`s, 4 floating `Bloom`s, 2 corner leaf flourishes. Player `dir="ltr" relative w-full overflow-hidden rounded-3xl shadow-card ring-2 ring-gold/50 bg-ink-night` with `<video src={editorial.testimonialsVideo} … controlsList="nodownload noplaybackrate" disablePictureInPicture>`, play overlay (AnimatePresence, play-icon `h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-cream/95 ring-2 ring-gold/40`), mute toggle (`top-2 start-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-ink-night/55 text-cream`), seek bar (`role=slider`, `absolute inset-x-3 bottom-3 h-1.5 sm:h-2 bg-ink-night/55`, fill `bg-gold`, thumb `bg-gold ring-2 ring-cream`). Seek uses physical `clientX - rect.left`.
- Marquee block (delay 0.25) `mt-12 sm:mt-16`: ornamental wave cap, frame `relative -mx-5 sm:mx-0` (edge-bleed on mobile) with flank FloralSprays + `<div className="sm:mx-20"><TestimonialsMarquee photos={editorial.testimonialsPhotos} speed={80} /></div>` + drifting blooms.

### 11.12 VideoMoment (`sections/VideoMoment.tsx`)
- Twin of CinematicMoment but background is **video** (`<video autoPlay muted loop playsInline preload="metadata">`); reduced motion swaps to `<img src={poster}>` AND freezes parallax. Props: `src`, `poster`, `caption?`, `kicker?`, `flourish?`, `height?` (default standard). Hoists `TEXT_SHADOW` to a module const. Same `HEIGHTS`, overlays, caption layout, `<BrandLogo>` + `<CallPill theme="dark">` as CinematicMoment. App instance: `ronitVideo`/`ronitVideoPoster`, height `tall`.

### 11.13 Gallery (`sections/Gallery.tsx`)
- `<Section bg="bg-ivory" className="relative overflow-hidden cv-auto">` (light theme → logo + light pill).
- Heading `text-center mb-12`: eyebrow `text-xs sm:text-sm tracking-[0.32em] uppercase text-accent mb-3` (`רגעים מהמסע`) + `h2 text-3xl sm:text-4xl font-extrabold text-balance text-ink-deep` (`הסיפור בתמונות`, delay 0.08).
- Grid `<Reveal as="ul" stagger className="grid grid-cols-2 sm:grid-cols-4 grid-flow-row-dense auto-rows-[minmax(120px,_18vw)] gap-3 sm:gap-4 max-w-6xl mx-auto">` (wider than 906px). 32 photos (`editorial.gallery`).
- Span pattern `SPANS[i]` (else `''`): `0: sm:col-span-2 sm:row-span-2`, `3: sm:row-span-2`, `6: sm:col-span-2`, `9: sm:col-span-2`, `12: sm:row-span-2` (all `sm:`-prefixed; uniform 2-col on mobile).
- Tile `<Reveal.Item as="li" className="relative overflow-hidden rounded-2xl group ${SPANS[i]??''}">` with `<motion.img whileHover={{ scale:1.06 }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }} className="h-full w-full object-cover">`, ring overlay `ring-1 ring-ink-night/10 rounded-2xl`, hover wash `bg-ink-night/0 group-hover:bg-ink-night/10 transition-colors duration-300`.

### 11.14 Payment (`sections/Payment.tsx`)
- `<Section id="price-reveal" bg="bg-cream" className="relative overflow-hidden">`.
- Animated glow `motion.div -z-10` `radial-gradient(ellipse 55% 50% at 50% 30%, rgba(195,149,125,0.22) 0%, rgba(195,149,125,0) 70%)`, `animate={{ opacity:[0.85,1,0.85] }}` 6s loop (reduced → static).
- Intro `mx-auto max-w-2xl text-center`: kicker `text-xs sm:text-sm tracking-[0.32em] uppercase text-accent mb-4`; label `text-sm sm:text-base tracking-wide text-ink-deep/70 mb-3` (delay 0.05); price `<div dir="ltr" className="relative inline-flex items-baseline gap-1 mb-2 leading-none">` → `<CountUp to={price.amountValue} duration={1.9} className="font-extrabold text-ink-deep text-[64px] sm:text-[96px] lg:text-[112px] tracking-tight tabular-nums" />` + currency `<span className="font-extrabold text-ink-deep text-4xl sm:text-6xl lg:text-7xl">{priceReveal.currency}</span>` (delay 0.12); postlude `text-base sm:text-lg text-ink-body/85 text-pretty mb-12 max-w-md mx-auto` (delay 0.25).
- Options `<Reveal as="ul" stagger className="mx-auto grid max-w-2xl gap-4 sm:gap-5 sm:grid-cols-2">`; `<Card className="h-full text-center">` with label `text-sm tracking-wider uppercase text-ink-deep/70 mb-2`, amount `text-3xl sm:text-4xl font-extrabold text-ink-deep mb-2` (`<bdi>{opt.amount}</bdi>`), optional note `text-sm text-ink-body/80`.
- CTA `<Button pulse>` (delay 0.2) → `document.getElementById('lead-form')?.scrollIntoView({ behavior:'smooth' })`.

### 11.15 LeadForm (`sections/LeadForm.tsx`)
See §12.

### 11.16 ClosingQuote (`sections/ClosingQuote.tsx`)
- Bare `<section ref data-header-theme="dark" className="relative isolate min-h-[60svh] overflow-hidden flex flex-col text-ivory">`. Manual `<BrandLogo />` + `<CallPill theme="dark" />`.
- Background `<img src={editorial.closingBackdrop}>` in `motion.div -z-20`; parallax `scale=useTransform([0,1],[1.08,1])`, `yShift=useTransform([0,1],[-50,50])`.
- Overlays: `bg-gradient-to-b from-ink-night/75 via-ink-night/82 to-ink-night/95` + radial scrim `radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 55%, transparent 85%)`.
- Quote wrapper `relative mx-auto max-w-2xl text-center px-6 flex-1 flex items-center justify-center`; `motion.p` `relative text-2xl sm:text-4xl italic font-medium text-balance leading-snug` with a **gradient-clip shimmer**: inline `backgroundImage: linear-gradient(120deg, rgba(250,246,238,0.95) 0%, rgba(250,246,238,1) 40%, #ffffff 50%, rgba(250,246,238,1) 60%, rgba(250,246,238,0.95) 100%)`, `backgroundSize: '200% 100%'`, `WebkitBackgroundClip/backgroundClip: 'text'`, `color: 'transparent'`, `animate={{ backgroundPosition:['200% 0%','-200% 0%'] }}` 9s linear loop. Content `“{closingQuote.text}”`.

### 11.17 Footer (`sections/Footer.tsx`)
- Bare `<footer data-header-theme="dark" className="bg-ink-deep text-cream/85">`. No logo, no pill, no decoration.
- `<Container>` → `flex flex-col items-center gap-2 py-10 text-center`: brand `text-lg font-semibold text-cream` (`footer.brand`); tagline `text-sm opacity-80`; phone `<a href="tel:…" className="mt-2 text-sm text-cream/90 hover:text-cream transition-colors">{footer.phoneLabel}: <bdi>{footer.phone}</bdi></a>`; copyright `text-xs opacity-60 pt-2` (`© {new Date().getFullYear()}`).

---

## 12. Form (LeadForm) spec

### Section & layout
- `<Section bg="bg-accent" id="lead-form">` (background `#c3957d`; `id="lead-form"` is the scroll anchor).
- Inner `mx-auto max-w-xl` (576px — narrower than 906px).
- Heading `text-center mb-10` → `h2 text-3xl sm:text-4xl font-extrabold text-cream text-balance` (`leadForm.title`; **cream/overlay heading, not ink-deep**).
- `<form onSubmit={handleSubmit} className="space-y-5">` (whole form + heading each wrapped in `<Reveal>`).

### Fields
| id | label src | type / attrs | required |
|---|---|---|---|
| `fullName` | `f.fullName` | `autoComplete="name"` | ✅ |
| `phone` | `f.phone` | `type="tel" inputMode="tel" autoComplete="tel"` | ✅ |
| `age` | `f.age` | `type="number" inputMode="numeric" min={16} max={120}` | — |
| `birthDate` | `f.birthDate` | `type="date"` | — |
| `city` | `f.city` | `autoComplete="address-level2"` | — |
| `occupation` | `f.occupation` | — | — |
| `phoneKind` (radio) | `f.phoneKind.label` | options `['כשר','רגיל']` | — |
| `passport` (radio) | `f.passport.label` | options `['כן','לא']` | — |
| `email` | `f.email` | `type="email" autoComplete="email"` | — |

- Field grid: `<div className="grid sm:grid-cols-2 gap-5">` holds the six `<Field>`s; `fullName` + `phone` are the first row (required fields grouped). The two `<RadioGroup>`s and `email` sit full-width below.
- **Only `fullName` + `phone` are required** in the UI.

### Atoms
- **Field:** label `block text-cream font-semibold mb-1.5 text-base` (+ `<RequiredMark />` when required), input `w-full rounded-xl border border-cream/40 bg-cream/95 px-4 py-3 text-ink-body text-base placeholder:text-ink-deep/40 focus:outline-none focus:ring-4 focus:ring-cream/40 transition-shadow`. `name = id`. (`text-base` = 16px prevents iOS zoom.)
- **RequiredMark:** `<span className="text-rose-300 ms-1" aria-hidden>*</span>`.
- **RadioGroup:** `<fieldset>` + `<legend className={labelClass}>`; pills `flex flex-wrap gap-2`; each `<label>` `cursor-pointer rounded-full bg-cream/15 px-4 py-2 text-cream text-sm sm:text-base ring-1 ring-cream/30 hover:bg-cream/25 transition-colors has-[:checked]:bg-cream has-[:checked]:text-ink-deep has-[:checked]:ring-cream` wrapping `<input type="radio" className="sr-only">`.
- **Submit button:** `<Button pulse type="submit" disabled={isSubmitting} className="w-full sm:w-auto disabled:opacity-70 disabled:cursor-wait">`; label is `leadForm.cta`, or while submitting an `inline-flex items-center gap-2` span with a spinner SVG (`h-4 w-4 animate-spin`, path `M21 12a9 9 0 11-6.219-8.56`) + `leadForm.submitting`.

### State machine & submit
- `type Status = 'idle' | 'submitting' | 'success' | 'error'`. `isSubmitting = status === 'submitting'`.
- `handleSubmit`: `preventDefault`, read `FormData` + `URLSearchParams(window.location.search)`, build snake_case payload, `setStatus('submitting')`, `fetch('/api/lead', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })`. On `!res.ok` throw → `setStatus('error')`; on ok → `setStatus('success')` + `formEl.reset()`. Always `setTimeout(… 5000)` to auto-dismiss success/error (won't clobber an in-flight submitting state).
- **Payload remapping** (matches backend Zod schema): `fullName→name`, `phone→phone`, `age→age` (`Number` or undefined), `birthDate→birth_date`, `city`, `occupation`, `email`, `phoneKind→phone_type` (default `'regular'`), `passport→passport` (default `'no'`), `service: 'uman'`, `ig_id: urlParams.get('ig_id')`, `utm_source: urlParams.get('utm_source') || 'direct'`.
- **Hebrew→English value maps** (the only Hebrew literals in the file):
  ```ts
  const PHONE_TYPE_MAP = { כשר: 'kosher', רגיל: 'regular' };
  const PASSPORT_MAP   = { כן: 'yes', לא: 'no' };
  ```
- **Field hygiene:** `name`/`phone` are `.trim()`-ed; optional text fields (`birth_date`, `city`, `occupation`, `email`) coalesce empty → `undefined` (`(formData.get(x) as string) || undefined`); the value maps fall through to the raw Hebrew value if an unmapped key arrives (`PHONE_TYPE_MAP[v] ?? v`), only applying the `'regular'`/`'no'` defaults when the field is entirely empty.
- **Toast auto-dismiss** is `5000ms`.

### Endpoint
- POSTs to **`/api/lead`** — a Vercel Edge Function (`api/lead.ts`) that proxies straight to `https://api.ronitbarash.site/api/website/lead`. No env vars on our side (backend URL hardcoded). Backend handles dedup (phone-based), channel attribution, and Monday writes.
- Local dev requires `npx vercel dev` (plain `vite` 404s the route).

### Toast
- `<AnimatePresence>` + `motion.div key={status} role="status" aria-live="polite"`, shown for submitting/success/error (hidden on idle).
- `initial={reduced?false:{opacity:0,y:20}} animate={reduced?undefined:{opacity:1,y:0}} exit={reduced?undefined:{opacity:0,y:10}} transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}`.
- Box: `fixed inset-x-4 bottom-6 mx-auto max-w-md rounded-xl px-5 py-4 shadow-cta z-50 text-center ${TOAST_TONE[status]}`.
- Tone map: `submitting: 'bg-ink-deep text-cream'`, `success: 'bg-emerald-700/95 text-cream'`, `error: 'bg-rose-800/95 text-cream'`.

---

## 13. Content & media conventions

### Copy authority chain
1. `content/copy.he.md` — human-readable canonical copy (client raw text). **Wins on disagreement.**
2. `src/content/copy.he.ts` — typed `as const` export, structured by section. **Components import strings from here only.** No Hebrew strings in JSX — documented exceptions: the cinematic `kicker`/`caption` props in `App.tsx`, the form's Hebrew value-map keys, and VideoGallery's inline mute-pill strings (`🔇 הקלקה לצליל` / `🔊`) + its Hebrew `aria-label` template literals (e.g. `` `סרטון ${i+1} — לחצי להפעלה` ``).
- Known md↔ts divergences to be aware of: WhyTuBav paragraph 4 wording; WhoFor `✔` markers dropped in TS; ImportantInfo ⚠️ moved to front; LeadForm fields replaced. Treat the shipped TS as the implemented truth.

### Typed copy module shape (top-level keys)
`meta` (title/description/besd), `tripDate` (iso `2026-07-28T05:00:00+03:00`, labels, afterFlightMessage `המסע התקיים — תודה ❤️`), `hero`, `intro` (lines[3], highlights[3]), `marquee` (8 strings), `price` (amount `5,900₪`, amountValue `5900`), `priceTeaser`, `priceReveal` (currency `₪`), `letterFromRonit` (image/imageFallback/alt/kicker), `whyTuBav` (title/quote/quoteAttribution/paragraphs[4]), `whatAwaits` (items[10]), `whoFor` (items[5]), `importantInfo` (items[5]), `payment` (options[2] `{label,amount,note}`: `5,900₪` / `6,077₪` "ניתן לפרוס עד ל-12 תשלומים"), `itinerary` (items[6]), `videoGallery`, `testimonials`, `leadForm`, `closingQuote`, `footer` (brand/tagline/phone `050-2696862`/phoneLabel).
- Preserve the typographic Hebrew gershayim `״` (U+05F4) in ט״ו / בס״ד — not ASCII quotes.

### Media manifest (`src/content/media.ts`)
- Path builders (zero-pad to 2 digits): `photo(n) → /images/photo-NN.webp`, `video(n) → /videos/video-NN.mp4`, `videoPoster(n) → /videos/video-NN-poster.webp` (posters are webp, in `/videos`).
- `editorial` named picks: `logo: '/images/logo.webp'`, `logoFallback: '/images/logo.png'`; `heroBackdrop=photo(28)`, `heroVideo=video(24)`, `heroVideoPoster=videoPoster(24)`; `ronitMoment=photo(25)`, `ronitVideo=video(3)`, `ronitVideoPoster=videoPoster(3)`; cinematic `umanGate=photo(18)`, `shofar=photo(7)`, `shofarTall=photo(1)`, `challahTable=photo(22)`, `shabbatTable=photo(13)`, `giftBag=photo(12)`; `closingBackdrop=photo(28)`; `testimonialsVideo=video(27)` (+ poster); `testimonialsPhotos` = `/images/testimonials/01..14.webp`.
- `marqueeStrip` and `gallery` are both 32-photo arrays (all photos except `photo(29)` = logo) with **different lead orderings** (marquee opens with photo(7), gallery with photo(1)).
- `videoGallery` = 20 `{src, poster}` objects (video-07..video-26).
- Asset naming: webp photos, mp4 videos, webp posters, all served from `/public` (site-root-relative paths). `loading="lazy" decoding="async"` on most images; `<bdi>` wraps all LTR numerals/prices/phones inside RTL copy.

### Media optimization scripts
- `scripts/optimize-media.mjs` — full re-number pass (only on a fresh rebuild).
- `scripts/optimize-new-media.mjs` — add-on with hardcoded source list + explicit indices (logo + video-07..video-16) for adding assets without disturbing existing indices.
- `scripts/convert-letter.mjs` — regenerates `public/images/letter-from-ronit.{webp,jpg}` from the handwritten PDF.

---

## 14. Responsive & breakpoints

- **`tailwind.config.ts` does NOT override `theme.screens`** — Tailwind defaults apply. The only breakpoints used in code are `sm:` (**640px**), `lg:` (1024px), and `xl:` (1280px, VideoGallery only). No `md:` anywhere meaningful.
- The "600px mobile breakpoint" from the brand reference is a **conceptual** note; the implementation uses stock `sm = 640px`. Treat 600px as design intent, not a configured screen.
- Most responsive jumps happen at `sm:`; the three logo sizes additionally step at `lg:`; section bottom padding steps at `lg:` (`pb-16`).
- **Max container width = 906px** (`max-w-container`). Galleries intentionally break wider: Gallery grid `max-w-6xl` (1152px), VideoGallery grid `max-w-7xl` (1280px). Form is narrower (`max-w-xl` = 576px); focused single-column reading sections use `max-w-2xl` (672px).
- Spacing scale is 4px-based: section heading margins `mb-10`/`mb-12`; list spacing `space-y-3`/`-4`/`-5`; card grid gaps `gap-3 → sm:gap-5`; Intro columns `gap-10 → lg:gap-16`.

---

## 15. Don'ts + theme audit

- Don't hardcode hex colors in components — consume tokens (allowed exceptions listed in §2 / §7).
- Don't put Hebrew strings inside JSX — import from `copy.he.ts` (documented exceptions: cinematic `kicker`/`caption` props, form value-map keys, and VideoGallery's inline mute-pill strings + Hebrew aria-label template literals).
- Don't re-add a global `h1–h4` color in `index.css`.
- Don't use directional `pl/pr/ml/mr` in RTL — use logical `ps/pe/ms/me/start/end`.
- Don't add a router, extra pages, or extra animation libraries (Framer Motion only).
- Don't add a real form backend without explicit instruction (the `/api/lead` proxy is the only endpoint).
- Don't duplicate persistent chrome — logo/pill come from `Section` (or hand-placed once on full-bleed sections), `Countdown` reads `tripDate`, phone reads `footer.phone`.
- Don't break the heading-color discipline: `text-ink-deep` on light sections, inline `#faf6ee`/`text-ivory` on photo/video overlays.

**Theme audit (must return only `tailwind.config.ts`):**
```bash
grep -rE '#[0-9a-fA-F]{3,6}' src/
```
