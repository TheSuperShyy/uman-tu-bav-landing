import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { editorial } from '../../content/media';

// Per client preference — longer brand moment. Reduced-motion users
// still get a brief flash rather than the full hold.
const HOLD_MS = 3500;
const REDUCED_HOLD_MS = 800;

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    // No scroll lock: locking body overflow toggles the native
    // scrollbar in/out, which either flashes the page width or forces
    // a permanent gutter on the right. The splash is brief and opaque,
    // so any background scroll during it doesn't visibly bother users.
    const t = setTimeout(() => setVisible(false), reduced ? REDUCED_HOLD_MS : HOLD_MS);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream"
        >
          {/* Soft warm radial bloom behind the logo. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 45% at 50% 45%, rgba(197,165,114,0.24) 0%, rgba(197,165,114,0) 70%)',
            }}
          />

          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.85 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Three concentric rings radiating outward — classic
                "pulse" loader motif but slow and warm so it reads as
                spiritual breath, not a web spinner. Staggered delays
                produce a continuous radiating wave. No rotate, no
                bounce (project animation rules). */}
            {!reduced && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-gold"
                    initial={{ scale: 1, opacity: 0.55 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{
                      duration: 2.4,
                      ease: 'easeOut',
                      repeat: Infinity,
                      delay: i * 0.8,
                    }}
                  />
                ))}
              </>
            )}

            {/* Logo — bigger, slow breath. The 1.02 scale stays within
                the project rule (no scale > 1.02). */}
            <motion.img
              src={editorial.logo}
              alt=""
              animate={reduced ? undefined : { scale: [1, 1.02, 1] }}
              transition={
                reduced
                  ? undefined
                  : { duration: 3.2, ease: 'easeInOut', repeat: Infinity }
              }
              className="relative block h-44 w-44 sm:h-56 sm:w-56 lg:h-64 lg:w-64 rounded-full object-cover shadow-card ring-2 ring-gold/80"
              loading="eager"
              decoding="sync"
            />
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
