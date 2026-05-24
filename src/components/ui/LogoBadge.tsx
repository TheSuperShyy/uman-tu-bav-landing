import { motion, useReducedMotion } from 'framer-motion';
import { editorial } from '../../content/media';

// Two stacked shadows: a near brand-color shadow for definition, plus a
// wider warm glow that pushes the badge off the cream page. Without the
// outer glow the badge fades into the cream-on-cream backdrop.
const BADGE_SHADOW = [
  '0 4px 10px rgba(107, 69, 50, 0.18)',
  '0 10px 30px rgba(135, 87, 62, 0.32)',
  '0 0 0 1px rgba(135, 87, 62, 0.08)',
].join(', ');

export default function LogoBadge() {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="חזרה לראש הדף"
      initial={reduced ? false : { opacity: 0, scale: 0.85, y: -10 }}
      animate={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      whileHover={reduced ? undefined : { scale: 1.04 }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      style={{ boxShadow: BADGE_SHADOW }}
      className="group fixed top-4 start-4 sm:top-5 sm:start-5 z-50 rounded-full bg-cream p-1 sm:p-1.5"
    >
      {/* Bold gold ring — primary contrast against the cream page. The
          stronger opacity (vs the original 40%) is what actually makes
          the badge readable; the shadow alone isn't enough on a warm
          neutral background. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-gold/70 group-hover:ring-gold transition-[box-shadow,opacity] duration-300"
      />
      {/* Inner warm gradient frame — gives the logo a "coin/medallion"
          treatment that ties it to the warm-tan palette. */}
      <span
        aria-hidden
        className="block rounded-full bg-gradient-to-br from-cream via-ivory to-accent-soft/50 p-[2px] sm:p-[3px]"
      >
        <img
          src={editorial.logo}
          alt="אור הצדיק"
          className="block h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover ring-1 ring-ink-deep/10"
          loading="eager"
          decoding="async"
        />
      </span>
      {/* Soft breathing ring — subtle pulse to draw the eye without
          adding bounce or scale (project animation rules forbid both).
          Disabled under reduced-motion. */}
      {!reduced && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-[-6px] rounded-full ring-2 ring-gold/40"
          animate={{ opacity: [0.5, 0.15, 0.5] }}
          transition={{ duration: 3.6, ease: 'easeInOut', repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
