#!/usr/bin/env node
// One-off: render page 1 of Ronit's handwritten-letter PDF scan as an
// image, crop borders, and write it to public/images/ as both WebP and
// JPG. The Letter section embeds this image as-is (no OCR — the letter
// is handwritten cursive Hebrew and authenticity matters).

import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { pdf } from 'pdf-to-img';

const PDF_PATH = 'רונית -דף נחיתה אומן/Adobe Scan 25 במאי 2026.pdf';
const OUT_DIR = 'public/images';
const OUT_WEBP = 'public/images/letter-from-ronit.webp';
const OUT_JPG = 'public/images/letter-from-ronit.jpg';

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  // pdf() returns an async iterator over page PNG buffers.
  // scale 2.0 -> roughly 1200-1700px wide depending on source page size.
  const doc = await pdf(PDF_PATH, { scale: 2.5 });

  let pageBuf = null;
  for await (const buf of doc) {
    pageBuf = buf;
    break;
  }
  if (!pageBuf) throw new Error('PDF rendered zero pages');

  // Inspect dimensions and slightly trim to remove any white border that
  // makes the embedded letter look floaty against the cream card.
  const meta = await sharp(pageBuf).metadata();
  console.log(`Rendered page: ${meta.width}x${meta.height}`);

  // Trim near-white borders using sharp's built-in .trim() — keeps the
  // handwriting area tight against the card edge.
  const trimmed = await sharp(pageBuf).trim({ threshold: 10 }).toBuffer();
  const trimmedMeta = await sharp(trimmed).metadata();
  console.log(`After trim:    ${trimmedMeta.width}x${trimmedMeta.height}`);

  // Final width: 900px wide is plenty for a max-w-xl card on retina.
  // Keeps file small (~80–120KB webp).
  await sharp(trimmed)
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 84, effort: 4 })
    .toFile(OUT_WEBP);

  await sharp(trimmed)
    .resize({ width: 900, withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(OUT_JPG);

  console.log(`Wrote ${OUT_WEBP} and ${OUT_JPG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
