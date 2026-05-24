import { motion, useReducedMotion } from 'framer-motion';
import { editorial } from '../../content/media';

// Soft warm glow that anchors the badge to the page palette without
// looking like a generic UI element. Built from the brand button color
// (#87573e) so it harmonizes with CTAs.
const BADGE_SHADOW =
  '0 6px 22px rgba(135, 87, 62, 0.25), 0 2px 4px rgba(107, 69, 50, 0.15)';

export default function LogoBadge() {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="חזרה לראש הדף"
      initial={reduced ? false : { opacity: 0, scale: 0.85, y: -8 }}
      animate={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      whileHover={reduced ? undefined : { scale: 1.04 }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      style={{ boxShadow: BADGE_SHADOW }}
      className="group fixed top-4 start-4 sm:top-5 sm:start-5 z-50 rounded-full bg-cream p-[3px] sm:p-1"
    >
      {/* Outer warm-gold ring — quietly signals "brand mark" without
          competing with content. Becomes a touch more opaque on hover. */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full ring-1 ring-gold/40 group-hover:ring-gold/70 transition-[box-shadow,opacity] duration-300"
      />
      {/* Inner ivory frame that gives the logo breathing room and
          masks any rectangular edge in the source jpeg. */}
      <span
        aria-hidden
        className="block rounded-full bg-gradient-to-br from-cream via-ivory to-accent-soft/50 p-[2px]"
      >
        <img
          src={editorial.logo}
          alt="אור הצדיק"
          className="block h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover ring-1 ring-ink-deep/5"
          loading="eager"
          decoding="async"
        />
      </span>
    </motion.button>
  );
}
