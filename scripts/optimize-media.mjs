#!/usr/bin/env node
// Optimize raw HEIC/JPG/MOV/MP4 from the client folder into
// web-ready WebP + MP4 in public/images and public/videos.
//
// Workaround for Windows: libheif (HEIC decoder) and ffmpeg's QuickTime
// .mov demuxer both break on non-ASCII (Hebrew) file paths. So we stage
// every source file into a temp dir with ASCII names, process from there,
// and clean up.

import { readdir, mkdir, stat, writeFile, copyFile, rm, readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, extname } from 'node:path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';

const execFileP = promisify(execFile);

const SRC = 'רונית -דף נחיתה אומן';
const STAGING = '.tmp-media';
const OUT_IMG = 'public/images';
const OUT_VID = 'public/videos';

const IMG_EXTS = new Set(['.heic', '.jpg', '.jpeg', '.png']);
const VID_EXTS = new Set(['.mov', '.mp4', '.m4v']);

const IMG_MAX_WIDTH = 1920;
const IMG_QUALITY = 78;
const VID_MAX_HEIGHT = 720;
const VID_CRF = 26;
const VID_PRESET = 'medium';

async function ensureDir(d) {
  await mkdir(d, { recursive: true });
}

async function listSource() {
  const entries = await readdir(SRC, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    const ext = extname(e.name).toLowerCase();
    if (IMG_EXTS.has(ext)) files.push({ kind: 'image', name: e.name, ext });
    else if (VID_EXTS.has(ext)) files.push({ kind: 'video', name: e.name, ext });
  }
  files.sort((a, b) => a.name.localeCompare(b.name));
  return files;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

async function stageAll(files) {
  await ensureDir(STAGING);
  const staged = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const stagedName = `src-${pad(i + 1)}${f.ext}`;
    const stagedPath = join(STAGING, stagedName);
    await copyFile(join(SRC, f.name), stagedPath);
    staged.push({ ...f, stagedPath, stagedName });
  }
  return staged;
}

async function optimizeImage(srcPath, outPath, ext) {
  // sharp's Windows prebuild excludes the HEVC decoder, so HEIC files
  // must go through heic-convert (wasm-bundled libheif + HEVC) first.
  let inputBuffer;
  if (ext === '.heic') {
    const heicBuf = await readFile(srcPath);
    inputBuffer = await heicConvert({
      buffer: heicBuf,
      format: 'JPEG',
      quality: 0.92, // sharp will re-encode to webp; keep loss minimal here
    });
  } else {
    inputBuffer = await readFile(srcPath);
  }

  const meta = await sharp(inputBuffer, { failOn: 'none' }).metadata();
  await sharp(inputBuffer, { failOn: 'none' })
    .rotate() // honor EXIF orientation
    .resize({
      width: IMG_MAX_WIDTH,
      withoutEnlargement: true,
      fit: 'inside',
    })
    .webp({ quality: IMG_QUALITY, effort: 4 })
    .toFile(outPath);
  const outStat = await stat(outPath);
  return {
    srcWidth: meta.width ?? null,
    srcHeight: meta.height ?? null,
    bytes: outStat.size,
  };
}

async function optimizeVideo(srcPath, outPath, posterPath) {
  await execFileP(
    'ffmpeg',
    [
      '-hide_banner',
      '-loglevel', 'error',
      '-y',
      '-i', srcPath,
      // force_divisible_by=2 because libx264/yuv420p requires even
      // dimensions; portrait phone footage will scale to e.g. 405x720
      // and break the encoder without this.
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

  // Extract a poster frame at 1.0s (fall back to 0s for very short clips).
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
  // Recompress poster JPG → WebP for smaller size.
  await sharp(posterPath + '.jpg').webp({ quality: 78 }).toFile(posterPath);
  await rm(posterPath + '.jpg').catch(() => {});

  const outStat = await stat(outPath);
  return { bytes: outStat.size };
}

async function main() {
  await ensureDir(OUT_IMG);
  await ensureDir(OUT_VID);

  const files = await listSource();
  console.log(`Found ${files.length} source files. Staging to ASCII temp dir ...`);

  const staged = await stageAll(files);
  console.log(`Staged ${staged.length} files. Processing ...\n`);

  let imgIdx = 0;
  let vidIdx = 0;
  const manifest = [];

  for (const f of staged) {
    try {
      if (f.kind === 'image') {
        imgIdx++;
        const outName = `photo-${pad(imgIdx)}.webp`;
        const outPath = join(OUT_IMG, outName);
        process.stdout.write(`  [img ${pad(imgIdx)}] ${f.name} -> ${outName} ... `);
        const info = await optimizeImage(f.stagedPath, outPath, f.ext);
        console.log(`${(info.bytes / 1024).toFixed(0)}KB  (${info.srcWidth}x${info.srcHeight})`);
        manifest.push({
          kind: 'image',
          source: f.name,
          out: `images/${outName}`,
          width: info.srcWidth,
          height: info.srcHeight,
          bytes: info.bytes,
        });
      } else {
        vidIdx++;
        const outName = `video-${pad(vidIdx)}.mp4`;
        const posterName = `video-${pad(vidIdx)}-poster.webp`;
        const outPath = join(OUT_VID, outName);
        const posterPath = join(OUT_VID, posterName);
        process.stdout.write(`  [vid ${pad(vidIdx)}] ${f.name} -> ${outName} ... `);
        const info = await optimizeVideo(f.stagedPath, outPath, posterPath);
        console.log(`${(info.bytes / 1024).toFixed(0)}KB`);
        manifest.push({
          kind: 'video',
          source: f.name,
          out: `videos/${outName}`,
          poster: `videos/${posterName}`,
          bytes: info.bytes,
        });
      }
    } catch (err) {
      console.log(`FAILED — ${err.message?.split('\n')[0] ?? err}`);
      manifest.push({ kind: f.kind, source: f.name, error: String(err) });
    }
  }

  await writeFile('public/media-manifest.json', JSON.stringify(manifest, null, 2), 'utf8');

  // Clean up staging.
  await rm(STAGING, { recursive: true, force: true });

  console.log(`\nDone. Wrote ${imgIdx} images, ${vidIdx} videos.`);
  console.log('Manifest: public/media-manifest.json');
}

main().catch(async (e) => {
  console.error(e);
  await rm(STAGING, { recursive: true, force: true }).catch(() => {});
  process.exit(1);
});
