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

  // Photo marquee strip — mirrors the full gallery so every photo
  // appears in both places. Curated picks lead so the strongest shots
  // are visible during the first scroll pass; the rest extend the
  // infinite loop.
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
    photo(1),
    photo(2),
    photo(4),
    photo(5),
    photo(6),
    photo(8),
    photo(9),
    photo(10),
    photo(11),
    photo(14),
    photo(16),
    photo(17),
    photo(19),
    photo(21),
    photo(23),
    photo(24),
    photo(26),
    photo(27),
    photo(30),
    photo(31),
    photo(32),
    photo(33),
  ],

  // Masonry gallery (between Itinerary and LeadForm). All 32 optimized
  // photos in the public/images folder except photo-29 (brand logo,
  // shown via LogoBadge/SplashScreen). Curated picks lead so the
  // strongest shots open the gallery; the rest fill out by number.
  gallery: [
    photo(1),
    photo(13),
    photo(20),
    photo(30),
    photo(22),
    photo(15),
    photo(31),
    photo(18),
    photo(12),
    photo(32),
    photo(28),
    photo(3),
    photo(33),
    photo(25),
    photo(23),
    photo(7),
    photo(2),
    photo(4),
    photo(5),
    photo(6),
    photo(8),
    photo(9),
    photo(10),
    photo(11),
    photo(14),
    photo(16),
    photo(17),
    photo(19),
    photo(21),
    photo(24),
    photo(26),
    photo(27),
  ],

  // Hero background video. Falls back to heroBackdrop photo under
  // prefers-reduced-motion or slow networks.
  heroVideo: video(24),
  heroVideoPoster: videoPoster(24),

  // VideoMoment between CinematicMoment #3 and Gallery — also used by
  // Intro's side video. Uses video-03 (the clean replacement clip); the
  // walking-down-the-airbridge footage in video-04 is reserved for the
  // Hero only.
  ronitVideo: video(3),
  ronitVideoPoster: videoPoster(3),

  // Client testimonials video (single playable clip in its own section).
  testimonialsVideo: video(27),
  testimonialsVideoPoster: videoPoster(27),

  // Client testimonials photos — 14 WhatsApp screenshots optimized into
  // their own subfolder so the gallery + decorative marquee don't see
  // them. Powers the interactive marquee + lightbox in the Testimonials
  // section.
  testimonialsPhotos: Array.from({ length: 14 }, (_, i) =>
    `/images/testimonials/${String(i + 1).padStart(2, '0')}.webp`,
  ) as readonly string[],

  // Round-2 client videos (20 clips, optimized via scripts/optimize-new-media.mjs).
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
    { src: video(17), poster: videoPoster(17) },
    { src: video(18), poster: videoPoster(18) },
    { src: video(19), poster: videoPoster(19) },
    { src: video(20), poster: videoPoster(20) },
    { src: video(21), poster: videoPoster(21) },
    { src: video(22), poster: videoPoster(22) },
    { src: video(23), poster: videoPoster(23) },
    { src: video(24), poster: videoPoster(24) },
    { src: video(25), poster: videoPoster(25) },
    { src: video(26), poster: videoPoster(26) },
  ],

  // Floating brand badge — see LogoBadge.tsx.
  logo: '/images/logo.webp',
  logoFallback: '/images/logo.png',
} as const;
