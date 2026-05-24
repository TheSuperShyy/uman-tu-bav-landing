#!/usr/bin/env node
// Add-on optimizer for round-2 client assets. Unlike optimize-media.mjs
// (which scans the whole client folder), this script processes ONLY
// hardcoded source files and writes them to specific output indices so
// the existing public/images/photo-NN.webp + public/videos/video-NN.mp4
// numbering for already-shipped assets is never touched.
//
// Picks up:
//   - ronit-logo.jpeg          -> public/images/logo.webp
//   - 10 selected videos       -> public/videos/video-07.mp4 .. video-16.mp4
//
// Reuses the same ffmpeg + sharp pipeline as optimize-media.mjs.

import { mkdir, stat, copyFile, rm, readFile, access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const execFileP = promisify(execFile);

const SRC = 'רונית -דף נחיתה אומן';
const SRC_SUB = 'רונית -דף נחיתה אומן/WhatsApp Unknown 2026-05-19 at 15.17.59.zip סרטונים אומן';
const STAGING = '.tmp-new-media';
const OUT_IMG = 'public/images';
const OUT_VID = 'public/videos';

const VID_MAX_HEIGHT = 720;
const VID_CRF = 26;
const VID_PRESET = 'medium';

const IMG_MAX_WIDTH = 1920;
const IMG_QUALITY = 78;

const LOGO_SRC = { dir: SRC, name: 'ronit-logo.jpeg' };

// Round-2 photos: the 5 May-24 additions that the original
// optimize-media.mjs pass didn't see. Existing photo-01..28.webp stay
// untouched; these start at index 29 so the gallery just appends.
const PHOTOS = [
  // 29192236...jpg is the decorative brand logo — kept out of the
  // gallery (renders via LogoBadge/SplashScreen instead). The optimized
  // file at public/images/photo-29.webp is left intact so it can be
  // repurposed later without re-encoding.
  { dir: SRC, name: '802b1a8b-f3d6-465c-9eb9-fea8f242ca6a.jpg', out: 30 },
  { dir: SRC, name: 'd5328132-27e8-4143-9e38-72159f2f7047.jpg', out: 31 },
  { dir: SRC, name: 'd9e0ae00-ba72-429d-84f8-6d07f401ce91.jpg', out: 32 },
  { dir: SRC, name: 'WhatsApp Image 2026-05-20 at 19.13.28.jpeg', out: 33 },
];

const VIDEOS = [
  // First batch (07–16) — already in public/videos. Listed here so a
  // full re-run reproduces them; the script is idempotent (overwrites).
  { dir: SRC_SUB, name: 'WhatsApp Video 2026-05-19 at 09.45.01.mp4', out: 7 },
  { dir: SRC_SUB, name: 'WhatsApp Video 2026-05-19 at 09.45.02.mp4', out: 8 },
  { dir: SRC_SUB, name: 'WhatsApp Video 2026-05-19 at 09.45.02 (1).mp4', out: 9 },
  { dir: SRC_SUB, name: 'WhatsApp Video 2026-05-19 at 09.45.02 (2).mp4', out: 10 },
  { dir: SRC, name: 'WhatsApp Video 2026-05-20 at 18.35.19.mp4', out: 11 },
  { dir: SRC, name: 'WhatsApp Video 2026-05-20 at 18.35.27.mp4', out: 12 },
  { dir: SRC, name: 'WhatsApp Video 2026-05-20 at 18.35.28.mp4', out: 13 },
  { dir: SRC, name: 'WhatsApp Video 2026-05-20 at 19.13.30.mp4', out: 14 },
  { dir: SRC, name: 'WhatsApp Video 2026-05-20 at 19.13.44 (1).mp4', out: 15 },
  { dir: SRC, name: 'WhatsApp Video 2026-05-20 at 19.14.02.mp4', out: 16 },
  // Second batch (17–26) — the rest of the client folder so every
  // clip surfaces in VideoGallery.
  { dir: SRC, name: 'WhatsApp Video 2026-05-20 at 18.35.21.mp4', out: 17 },
  { dir: SRC, name: 'WhatsApp Video 2026-05-20 at 19.13.22.mp4', out: 18 },
  { dir: SRC, name: 'WhatsApp Video 2026-05-20 at 19.14.06.mp4', out: 19 },
  { dir: SRC, name: 'WhatsApp Video 2026-05-20 at 19.14.10.mp4', out: 20 },
  { dir: SRC, name: '1ecf506d-1c26-4932-8246-df208a82ad55.mp4', out: 21 },
  { dir: SRC, name: '61115f72-1a55-4e38-98d7-a68b72e52343.mp4', out: 22 },
  { dir: SRC, name: 'IMG_3530.mov', out: 23 },
  { dir: SRC, name: 'copy_3DA27086-D882-4E73-B374-26E8457A2485.mov', out: 24 },
  { dir: SRC, name: 'copy_522B4B24-0BD9-4EED-9FC7-22285BDE8A3F.mov', out: 25 },
  { dir: SRC, name: 'copy_48882ABB-431F-4C7A-918A-D7960C495054.mov', out: 26 },
  // Round-3 client follow-ups.
  // Clean hero clip (replaces the previous video-03 which had baked-in
  // "Uman Hilula 2025 With Ronit Barash" overlay text).
  { dir: SRC, name: 'video-replacement.mp4', out: 3 },
  // Client testimonials clip — used by the new Testimonials section.
  { dir: SRC, name: 'testimonials.mp4', out: 27 },
];

function pad(n) {
  return String(n).padStart(2, '0');
}

async function ensureDir(d) {
  await mkdir(d, { recursive: true });
}

async function stageFile(srcDir, srcName, stagedName) {
  const stagedPath = join(STAGING, stagedName);
  await copyFile(join(srcDir, srcName), stagedPath);
  return stagedPath;
}

async function optimizeLogo() {
  // Logo: stage, resize, then knock out the white background so the
  // mark appears directly on whatever surface it's placed on.
  //
  // The source is a JPEG with a baked-in white card behind the gold
  // emblem. We use luminance-based alpha (not a binary threshold) so
  // the curly serifs of the mark stay smoothly anti-aliased instead
  // of looking pixelated at the edges.
  const staged = await stageFile(LOGO_SRC.dir, LOGO_SRC.name, 'logo-src' + extname(LOGO_SRC.name));
  const buf = await readFile(staged);

  const webpOut = join(OUT_IMG, 'logo.webp');
  const pngOut = join(OUT_IMG, 'logo.png');

  // Pipeline: resize, ensure alpha, then walk pixel data and dial alpha
  // based on perceived luminance.
  const { data, info } = await sharp(buf, { failOn: 'none' })
    .rotate()
    .resize({ width: 256, withoutEnlargement: true, fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data); // mutable copy
  // Tuned for the cream-on-gold logo: pixels with luminance > 245 go
  // fully transparent (the white card), 200–245 get a graduated alpha
  // (anti-aliased edge pixels), and < 200 stays fully opaque (the
  // gold mark itself).
  const FULL_T = 245;
  const FADE_T = 200;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum >= FULL_T) {
      pixels[i + 3] = 0;
    } else if (lum > FADE_T) {
      // Linear ramp from FADE_T (alpha 255) to FULL_T (alpha 0)
      const ratio = (FULL_T - lum) / (FULL_T - FADE_T);
      pixels[i + 3] = Math.round(ratio * 255);
    }
    // else: keep alpha 255 (set by ensureAlpha)
  }

  const rawIn = sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
  await rawIn.clone().webp({ quality: 92, effort: 4, alphaQuality: 100 }).toFile(webpOut);
  await rawIn.clone().png({ compressionLevel: 9 }).toFile(pngOut);

  const webpStat = await stat(webpOut);
  const pngStat = await stat(pngOut);
  return { webp: webpStat.size, png: pngStat.size };
}

async function optimizePhoto(stagedPath, outIdx) {
  const outName = `photo-${pad(outIdx)}.webp`;
  const outPath = join(OUT_IMG, outName);
  const buf = await readFile(stagedPath);
  await sharp(buf, { failOn: 'none' })
    .rotate() // honor EXIF orientation so portrait phone shots stay upright
    .resize({ width: IMG_MAX_WIDTH, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: IMG_QUALITY, effort: 4 })
    .toFile(outPath);
  const outStat = await stat(outPath);
  return { bytes: outStat.size, outName };
}

async function optimizeVideo(stagedPath, outIdx) {
  const outName = `video-${pad(outIdx)}.mp4`;
  const posterName = `video-${pad(outIdx)}-poster.webp`;
  const outPath = join(OUT_VID, outName);
  const posterPath = join(OUT_VID, posterName);

  await execFileP(
    'ffmpeg',
    [
      '-hide_banner',
      '-loglevel', 'error',
      '-y',
      '-i', stagedPath,
      '-vf', `scale='min(1280,iw)':'min(${VID_MAX_HEIGHT},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,format=yuv420p`,
      '-c:v', 'libx264',
      '-preset', VID_PRESET,
      '-crf', String(VID_CRF),
      '-c:a', 'aac',
      '-b:a', '96k',
      '-movflags', '+faststart',
      outPath,
    ],
    { maxBuffer: 1024 * 1024 * 50 },
  );

  // Poster frame
  try {
    await execFileP('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-ss', '1', '-i', outPath,
      '-frames:v', '1', '-q:v', '4', posterPath + '.jpg',
    ]);
  } catch {
    await execFileP('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-i', outPath, '-frames:v', '1', '-q:v', '4', posterPath + '.jpg',
    ]);
  }
  await sharp(posterPath + '.jpg').webp({ quality: 78 }).toFile(posterPath);
  await rm(posterPath + '.jpg').catch(() => {});

  const outStat = await stat(outPath);
  return { bytes: outStat.size, outName };
}

async function main() {
  await ensureDir(OUT_IMG);
  await ensureDir(OUT_VID);
  await ensureDir(STAGING);

  console.log('Optimizing logo ...');
  try {
    const logo = await optimizeLogo();
    console.log(`  logo.webp ${(logo.webp / 1024).toFixed(0)}KB · logo.png ${(logo.png / 1024).toFixed(0)}KB`);
  } catch (err) {
    console.log(`  LOGO FAILED — ${err.message?.split('\n')[0] ?? err}`);
  }

  // --force re-encodes everything; default skips outputs that already
  // exist so adding new entries doesn't redo the whole batch.
  const force = process.argv.includes('--force');

  console.log(`\nOptimizing ${PHOTOS.length} photos (force=${force}) ...`);
  for (const p of PHOTOS) {
    const outPath = join(OUT_IMG, `photo-${pad(p.out)}.webp`);
    if (!force) {
      try {
        await access(outPath);
        console.log(`  [photo-${pad(p.out)}] exists — skip`);
        continue;
      } catch {
        // not present, fall through
      }
    }
    try {
      const stagedPath = await stageFile(p.dir, p.name, `img-${pad(p.out)}.jpg`);
      process.stdout.write(`  [photo-${pad(p.out)}] ${p.name.slice(0, 50)}... `);
      const info = await optimizePhoto(stagedPath, p.out);
      console.log(`${(info.bytes / 1024).toFixed(0)}KB`);
    } catch (err) {
      console.log(`FAILED — ${err.message?.split('\n')[0] ?? err}`);
    }
  }

  console.log(`\nOptimizing ${VIDEOS.length} videos (force=${force}) ...`);
  for (const v of VIDEOS) {
    const stagedName = `vid-${pad(v.out)}.mp4`;
    const outPath = join(OUT_VID, `video-${pad(v.out)}.mp4`);
    if (!force) {
      try {
        await access(outPath);
        console.log(`  [video-${pad(v.out)}] exists — skip`);
        continue;
      } catch {
        // not present, fall through to encode
      }
    }
    try {
      const stagedPath = await stageFile(v.dir, v.name, stagedName);
      process.stdout.write(`  [video-${pad(v.out)}] ${v.name.slice(0, 50)}... `);
      const info = await optimizeVideo(stagedPath, v.out);
      console.log(`${(info.bytes / 1024).toFixed(0)}KB`);
    } catch (err) {
      console.log(`FAILED — ${err.message?.split('\n')[0] ?? err}`);
    }
  }

  await rm(STAGING, { recursive: true, force: true });
  console.log('\nDone.');
}

main().catch(async (e) => {
  console.error(e);
  await rm(STAGING, { recursive: true, force: true }).catch(() => {});
  process.exit(1);
});
