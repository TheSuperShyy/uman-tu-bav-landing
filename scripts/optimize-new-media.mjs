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

import { mkdir, stat, copyFile, rm, readFile } from 'node:fs/promises';
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

const LOGO_SRC = { dir: SRC, name: 'ronit-logo.jpeg' };

const VIDEOS = [
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
  // Logo: stage to ASCII (sharp is fine with Hebrew but be safe), then
  // resize to a small badge and output both WebP and PNG fallback.
  const staged = await stageFile(LOGO_SRC.dir, LOGO_SRC.name, 'logo-src' + extname(LOGO_SRC.name));
  const buf = await readFile(staged);

  const webpOut = join(OUT_IMG, 'logo.webp');
  const pngOut = join(OUT_IMG, 'logo.png');

  await sharp(buf, { failOn: 'none' })
    .rotate()
    .resize({ width: 256, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 88, effort: 4 })
    .toFile(webpOut);

  await sharp(buf, { failOn: 'none' })
    .rotate()
    .resize({ width: 256, withoutEnlargement: true, fit: 'inside' })
    .png({ compressionLevel: 9 })
    .toFile(pngOut);

  const webpStat = await stat(webpOut);
  const pngStat = await stat(pngOut);
  return { webp: webpStat.size, png: pngStat.size };
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

  console.log(`\nOptimizing ${VIDEOS.length} videos ...`);
  for (const v of VIDEOS) {
    const stagedName = `vid-${pad(v.out)}.mp4`;
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
