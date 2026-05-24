import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Container from '../layout/Container';
import Reveal from '../motion/Reveal';
import { videoGallery } from '../../content/copy.he';
import { editorial } from '../../content/media';

type TileProps = {
  src: string;
  poster: string;
  index: number;
  isActive: boolean;
  onActivate: (i: number | null) => void;
  reduced: boolean;
};

function VideoTile({ src, poster, index, isActive, onActivate, reduced }: TileProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);

  // Drive playback off of `isActive`. Pausing leaves currentTime alone
  // so a subsequent activation resumes from the same spot, matching
  // user expectation for a video tile.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (isActive) {
      v.muted = muted;
      void v.play().catch(() => {
        // Browser blocked unmuted autoplay — fall back to muted and
        // let the mute pill prompt the user to enable sound.
        v.muted = true;
        setMuted(true);
        void v.play();
      });
    } else if (!v.paused) {
      v.pause();
    }
    // currentTime deliberately not reset on pause
  }, [isActive, muted]);

  function handleEnded() {
    onActivate(null);
  }

  function handleTileClick() {
    onActivate(isActive ? null : index);
  }

  function handleMuteClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setMuted((m) => !m);
  }

  return (
    <motion.div
      whileHover={reduced ? undefined : { scale: 1.025, y: -2 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative aspect-square w-full overflow-hidden rounded-2xl lg:rounded-3xl ring-1 ring-divider shadow-card bg-ink-night/10 hover:shadow-cta transition-shadow"
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        playsInline
        onEnded={handleEnded}
        preload="none"
        className="h-full w-full object-cover"
      />

      {/* Soft bottom gradient — only when idle so it never tints the
          playing footage. Helps the play icon read against bright
          posters. */}
      {!isActive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-night/50 via-ink-night/10 to-transparent"
        />
      )}

      {/* Warm vignette on hover — gives tiles an editorial feel instead
          of stock-grid uniformity. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-gold/0 group-hover:ring-gold/40 rounded-2xl lg:rounded-3xl transition-[box-shadow,ring-color] duration-300"
      />

      {/* Full-tile play/pause hit target. Sits above the video so taps
          anywhere on the surface toggle playback. Z-index keeps it
          beneath the mute pill so the pill stays independently
          clickable. */}
      <button
        type="button"
        onClick={handleTileClick}
        aria-label={isActive ? `סרטון ${index + 1} — לחצי להפסקה` : `סרטון ${index + 1} — לחצי להפעלה`}
        className="absolute inset-0 z-10 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-cream/40"
      />

      {/* Centered play icon — visible only when idle. Bigger on PC for
          presence; the small mobile size keeps thumbnails uncluttered. */}
      {!isActive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
        >
          <span className="flex h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-cream/95 text-ink-deep shadow-cta backdrop-blur transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7 lg:h-9 lg:w-9 ms-1" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
      )}

      {/* Mute pill — bottom-left visually (RTL `end-` = left edge).
          Only present while playing; click toggles audio without
          touching playback. */}
      {isActive && (
        <button
          type="button"
          onClick={handleMuteClick}
          aria-label={muted ? 'הפעלת קול' : 'השתקת קול'}
          className="absolute bottom-2 end-2 z-30 rounded-full bg-cream/90 px-3 py-1.5 text-xs sm:text-sm font-semibold text-ink-deep shadow-cta backdrop-blur hover:bg-cream transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-cream/40"
        >
          {muted ? '🔇 הקלקה לצליל' : '🔊'}
        </button>
      )}
    </motion.div>
  );
}

export default function VideoGallery() {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="bg-cream-alt py-16 sm:py-20 lg:py-24 cv-auto">
      {/* Heading stays within the standard reading-width container —
          centered prose is more comfortable at ~906px. */}
      <Container>
        <div className="text-center mb-10 lg:mb-14">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-balance text-ink-deep mb-3">
              {videoGallery.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base sm:text-lg text-ink-body/80">{videoGallery.subtitle}</p>
          </Reveal>
        </div>
      </Container>

      {/* Grid breaks out to a wider max-width so PC tiles have presence.
          10 clips lay out cleanly: 2×5 mobile, 4+4+2 desktop, 5+5 wide. */}
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal
          as="ul"
          stagger
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-6"
        >
          {editorial.videoGallery.map((v, i) => (
            <Reveal.Item as="li" key={v.src}>
              <VideoTile
                src={v.src}
                poster={v.poster}
                index={i}
                isActive={activeIndex === i}
                onActivate={setActiveIndex}
                reduced={!!reduced}
              />
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
