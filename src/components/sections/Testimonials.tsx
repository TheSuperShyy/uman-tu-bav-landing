import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import BlobBackdrop from '../ui/BlobBackdrop';
import { testimonials } from '../../content/copy.he';
import { editorial } from '../../content/media';

// Small 6-petal flower bloom — used as a feminine decorative accent
// in place of geometric sparkles.
function Bloom({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`text-gold ${className}`}
      fill="currentColor"
      initial={reduced ? false : { opacity: 0.6, scale: 0.85, rotate: 0 }}
      animate={reduced ? undefined : { opacity: [0.6, 1, 0.6], scale: [0.85, 1.05, 0.85], rotate: [0, 15, 0] }}
      transition={reduced ? undefined : { duration: 5, ease: 'easeInOut', repeat: Infinity, delay }}
    >
      {/* 6 petals around a center */}
      <g>
        <ellipse cx="12" cy="4" rx="2.2" ry="3.8" />
        <ellipse cx="12" cy="20" rx="2.2" ry="3.8" />
        <ellipse cx="4" cy="12" rx="3.8" ry="2.2" />
        <ellipse cx="20" cy="12" rx="3.8" ry="2.2" />
        <ellipse cx="6" cy="6" rx="2.2" ry="3.4" transform="rotate(-45 6 6)" />
        <ellipse cx="18" cy="18" rx="2.2" ry="3.4" transform="rotate(-45 18 18)" />
        <ellipse cx="18" cy="6" rx="2.2" ry="3.4" transform="rotate(45 18 6)" />
        <ellipse cx="6" cy="18" rx="2.2" ry="3.4" transform="rotate(45 6 18)" />
        <circle cx="12" cy="12" r="1.6" fill="#faf6ee" />
      </g>
    </motion.svg>
  );
}

// Curly floral spray — used as a side decoration on each flank of the
// video on wider breakpoints. Mirror with `flipped` for the opposite side.
function FloralSpray({ className = '', flipped = false }: { className?: string; flipped?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 80 200"
      className={`${className} text-gold`}
      style={flipped ? { transform: 'scaleX(-1)' } : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      {/* Central vine */}
      <path d="M40 8 Q44 40 36 80 Q28 120 44 160 Q48 180 40 196" />
      {/* Curly tendrils */}
      <path d="M40 30 Q60 32 64 50 Q60 56 50 52" />
      <path d="M36 70 Q16 72 12 92 Q16 100 28 94" />
      <path d="M40 110 Q60 114 66 132 Q60 140 50 134" />
      <path d="M44 150 Q24 152 20 172 Q24 180 34 174" />
      {/* Flower blooms — 5-petal rosettes */}
      <g fill="currentColor" stroke="none">
        <circle cx="50" cy="52" r="2.5" />
        <circle cx="46" cy="48" r="1.6" />
        <circle cx="54" cy="48" r="1.6" />
        <circle cx="46" cy="56" r="1.6" />
        <circle cx="54" cy="56" r="1.6" />

        <circle cx="28" cy="94" r="2.5" />
        <circle cx="24" cy="90" r="1.6" />
        <circle cx="32" cy="90" r="1.6" />
        <circle cx="24" cy="98" r="1.6" />
        <circle cx="32" cy="98" r="1.6" />

        <circle cx="50" cy="134" r="2.5" />
        <circle cx="46" cy="130" r="1.6" />
        <circle cx="54" cy="130" r="1.6" />
        <circle cx="46" cy="138" r="1.6" />
        <circle cx="54" cy="138" r="1.6" />

        <circle cx="34" cy="174" r="2.5" />
        <circle cx="30" cy="170" r="1.6" />
        <circle cx="38" cy="170" r="1.6" />
        <circle cx="30" cy="178" r="1.6" />
        <circle cx="38" cy="178" r="1.6" />
      </g>
      {/* Small leaves */}
      <path d="M40 20 Q34 22 36 28 Q42 26 40 20 Z" fill="currentColor" stroke="none" opacity="0.7" />
      <path d="M40 90 Q46 92 44 98 Q38 96 40 90 Z" fill="currentColor" stroke="none" opacity="0.7" />
      <path d="M40 130 Q34 132 36 138 Q42 136 40 130 Z" fill="currentColor" stroke="none" opacity="0.7" />
    </svg>
  );
}

// Heart-shaped flourish used inline between the title and subtitle.
function HeartFlourish() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-3 w-3 text-gold" fill="currentColor">
      <path d="M12 21 C5 16 1 11 4 6 Q7 2 12 6 Q17 2 20 6 C23 11 19 16 12 21 Z" />
    </svg>
  );
}

// Single-clip testimonials block. Tap-to-play with an overlaid poster
// frame so the page doesn't autoplay audio.
export default function Testimonials() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onTime = () => {
      if (v.duration > 0) setProgress(v.currentTime / v.duration);
    };
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);
    v.addEventListener('timeupdate', onTime);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('timeupdate', onTime);
    };
  }, []);

  function togglePlay() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  }

  function toggleMute() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function seek(e: MouseEvent<HTMLDivElement>) {
    const v = ref.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Page is RTL but we want progress to read left→right always, so use
    // physical left position relative to the bar.
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
    setProgress(ratio);
  }

  return (
    <Section bg="bg-cream-alt" className="relative overflow-hidden">
      {/* Soft rose-gold blobs in opposite corners for ambient warmth. */}
      <BlobBackdrop position="top-left" color="bg-accent" size={420} opacity={0.28} />
      <BlobBackdrop position="top-right" color="bg-gold" size={300} opacity={0.2} />
      <BlobBackdrop position="bottom-right" color="bg-button" size={460} opacity={0.2} />

      {/* Centered radial spotlight that draws the eye to the middle. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(195,149,125,0.4) 0%, transparent 65%)',
        }}
      />

      <div className="relative text-center mb-6 lg:mb-8">
        <Reveal>
          <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-gold mb-3">
            {testimonials.kicker}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-balance text-ink-deep mb-3">
            {testimonials.title}
          </h2>
        </Reveal>

        {/* Feminine flourish — heart + curling lines instead of geometric diamonds. */}
        <Reveal delay={0.08}>
          <div className="flex items-center justify-center gap-2 mb-3" aria-hidden>
            <svg viewBox="0 0 24 8" className="h-2 w-8 text-gold/70" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M0 4 Q6 0 12 4 Q18 8 24 4" />
            </svg>
            <HeartFlourish />
            <svg viewBox="0 0 24 8" className="h-2 w-8 text-gold/70" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M0 4 Q6 8 12 4 Q18 0 24 4" />
            </svg>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-base sm:text-lg text-ink-body/80 max-w-md mx-auto text-pretty">
            {testimonials.subtitle}
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className="relative mx-auto max-w-[220px] sm:max-w-[260px]">
          {/* Pulsing rose-gold halo behind the tile. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-10 -z-10 rounded-[2.5rem] blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(195,149,125,0.8) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
          />

          {/* Floral sprays flanking the video on wider screens — vines with
              blooms, leaves, and curling tendrils. */}
          <FloralSpray className="hidden sm:block absolute -start-28 lg:-start-40 top-1/2 -translate-y-1/2 h-[260px] w-20 opacity-80" />
          <FloralSpray flipped className="hidden sm:block absolute -end-28 lg:-end-40 top-1/2 -translate-y-1/2 h-[260px] w-20 opacity-80" />

          {/* Floating blooms around the video. */}
          <Bloom className="absolute -top-6 -start-5 h-5 w-5" />
          <Bloom className="absolute -top-3 -end-6 h-4 w-4" delay={0.6} />
          <Bloom className="absolute -bottom-5 -start-7 h-4 w-4" delay={1.2} />
          <Bloom className="absolute -bottom-6 -end-4 h-5 w-5" delay={1.8} />

          {/* Curly leaf flourishes at top-start and bottom-end of the tile. */}
          <svg
            aria-hidden
            viewBox="0 0 48 48"
            className="absolute -top-5 -start-5 h-12 w-12 text-gold"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <path d="M4 44 Q4 20 24 4" />
            <path d="M10 36 Q18 28 26 30 Q22 38 10 36 Z" fill="currentColor" opacity="0.6" />
            <path d="M16 28 Q22 22 28 24" />
            <circle cx="6" cy="42" r="1.6" fill="currentColor" />
          </svg>
          <svg
            aria-hidden
            viewBox="0 0 48 48"
            className="absolute -bottom-5 -end-5 h-12 w-12 text-gold"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <path d="M44 4 Q44 28 24 44" />
            <path d="M38 12 Q30 20 22 18 Q26 10 38 12 Z" fill="currentColor" opacity="0.6" />
            <path d="M32 20 Q26 26 20 24" />
            <circle cx="42" cy="6" r="1.6" fill="currentColor" />
          </svg>

          <div dir="ltr" className="relative w-full overflow-hidden rounded-3xl shadow-card ring-2 ring-gold/50 bg-ink-night">
            <video
              ref={ref}
              src={editorial.testimonialsVideo}
              poster={editorial.testimonialsVideoPoster}
              playsInline
              preload="metadata"
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              onClick={togglePlay}
              className="block w-full h-auto cursor-pointer"
            />

            {/* Big center play button — visible when paused, hidden while playing. */}
            <AnimatePresence>
              {!playing && (
                <motion.button
                  key="play-overlay"
                  type="button"
                  onClick={togglePlay}
                  aria-label="נגן"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-cream/95 text-ink-deep shadow-lg ring-2 ring-gold/40 hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-9 sm:w-9 ms-0.5" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Mute toggle — top-left corner. */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'בטל השתקה' : 'השתק'}
              className="absolute top-2 start-2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-ink-night/55 text-cream hover:bg-ink-night/80 transition-colors"
            >
              {muted ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" aria-hidden>
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.59 3L20 8.41 18.59 7 15 10.59 11.41 7 10 8.41 13.59 12 10 15.59 11.41 17 15 13.41 18.59 17 20 15.59 16.59 12z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" aria-hidden>
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>

            {/* Progress bar — floating pill above the video bottom edge,
                inset from the corners so the rounded mask doesn't clip it. */}
            <div
              role="slider"
              aria-label="התקדמות הסרטון"
              aria-valuenow={Math.round(progress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              onClick={seek}
              className="absolute inset-x-3 bottom-3 h-1.5 sm:h-2 bg-ink-night/55 cursor-pointer group rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-gold transition-[width] duration-75 rounded-full"
                style={{ width: `${progress * 100}%` }}
              />
              <span
                aria-hidden
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-gold ring-2 ring-cream opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
