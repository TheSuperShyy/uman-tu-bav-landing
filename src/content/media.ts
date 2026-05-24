/**
 * Centralized media references. Every photo and video the page renders
 * is picked from this manifest, so swaps are one-line changes.
 *
 * Files live in /public/images and /public/videos (served from the
 * Vite static root). Paths are relative to the site root.
 */

export const photo = (n: number) => `/images/photo-${String(n).padStart(2, '0')}.webp`;
export const video = (n: number) => `/videos/video-${String(n).padStart(2, '0')}.mp4`;
export const videoPoster = (n: number) => `/videos/video-${String(n).padStart(2, '0')}-poster.webp`;

/**
 * Editorial picks — known-good photos with descriptive roles.
 * Swap these aliases without touching component code when you want a different shot.
 */
export const editorial = {
  // Hero: golden-hour sunset oil bottle at Uman — emotional opener
  heroBackdrop: photo(28),
  // Alt hero candidate (shofar drama)
  heroBackdropAlt: photo(1),

  // Ronit & community moments
  ronitMoment: photo(25),
  community: photo(15),

  // Cinematic full-bleed inserts
  umanGate: photo(18),
  shofar: photo(7),
  shofarTall: photo(1),
  challahTable: photo(22),
  shabbatTable: photo(13),
  giftBag: photo(12),

  // Closing quote backdrop
  closingBackdrop: photo(28),

  // Photo marquee strip
  marqueeStrip: [
    photo(7),
    photo(15),
    photo(13),
    photo(20),
    photo(12),
    photo(18),
    photo(22),
    photo(25),
    photo(28),
    photo(3),
  ],

  // Masonry gallery (between Itinerary and LeadForm)
  gallery: [
    photo(1),
    photo(13),
    photo(20),
    photo(22),
    photo(15),
    photo(18),
    photo(12),
    photo(28),
    photo(3),
    photo(25),
    photo(23),
    photo(7),
  ],

  // Hero background video — white roses, Uman Hilula 2025. Falls back
  // to heroBackdrop photo under prefers-reduced-motion or slow networks.
  heroVideo: video(3),
  heroVideoPoster: videoPoster(3),

  // VideoMoment between CinematicMoment #3 and Gallery —
  // Ronit walking down marble stairs.
  ronitVideo: video(4),
  ronitVideoPoster: videoPoster(4),

  // Round-2 client videos (10 clips, optimized via scripts/optimize-new-media.mjs).
  // Powers the VideoGallery section.
  videoGallery: [
    { src: video(7), poster: videoPoster(7) },
    { src: video(8), poster: videoPoster(8) },
    { src: video(9), poster: videoPoster(9) },
    { src: video(10), poster: videoPoster(10) },
    { src: video(11), poster: videoPoster(11) },
    { src: video(12), poster: videoPoster(12) },
    { src: video(13), poster: videoPoster(13) },
    { src: video(14), poster: videoPoster(14) },
    { src: video(15), poster: videoPoster(15) },
    { src: video(16), poster: videoPoster(16) },
  ],

  // Floating brand badge — see LogoBadge.tsx.
  logo: '/images/logo.webp',
  logoFallback: '/images/logo.png',
} as const;
