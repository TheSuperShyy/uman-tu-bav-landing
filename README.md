# Inbalel Uman Tu B'Av Landing

Single-page Hebrew RTL landing for Ronit Barash's Tu B'Av women's journey to Uman.

## Stack

Vite · React 18 · TypeScript · Tailwind CSS · Framer Motion · Google Font "Assistant".

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run preview      # preview the production build
```

## Folder map

```
src/
├── content/copy.he.ts          # source-of-truth Hebrew copy
├── components/
│   ├── layout/                 # Section, Container
│   ├── ui/                     # Button, Card, Badge, Divider, FloatingDecor
│   ├── motion/                 # Reveal, variants
│   └── sections/               # 12 page sections in reading order
├── hooks/
├── App.tsx
├── main.tsx
└── index.css
public/images/placeholders/     # decorative SVGs + hero placeholder
```

See [CLAUDE.md](./CLAUDE.md) for design tokens, animation rules, RTL conventions, and dos/don'ts. See [planning.md](./planning.md) for roadmap and open TODOs.
