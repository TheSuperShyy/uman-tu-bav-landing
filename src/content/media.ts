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

  // Hero background video (optional — falls back to photo if not used)
  heroVideo: video(2),
  heroVideoPoster: videoPoster(2),
} as const;
