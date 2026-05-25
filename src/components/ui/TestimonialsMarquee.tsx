import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';

// Interactive testimonial-photos marquee with a lightbox popup.
//
// - Continuous, slow horizontal loop (RTL-friendly via LTR direction
//   inside so the math stays simple).
// - Click a photo → opens a centered lightbox; the marquee animation
//   pauses while it's open.
// - Lightbox closes via the X button, clicking the dim backdrop, or
//   pressing Escape.
// - Respects prefers-reduced-motion and stops looping when off-screen.
type Props = { photos: readonly string[]; speed?: number };

export default function TestimonialsMarquee({ photos, speed = 80 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { amount: 0, margin: '200px' });
  const [active, setActive] = useState<string | null>(null);

  // Double the array so the linear -50% translate wraps seamlessly.
  const loop = [...photos, ...photos];
  const isMoving = !reduced && inView && active === null;

  useEffect(() => {
    if (active === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActive(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <>
      <div ref={ref} dir="ltr" className="relative overflow-hidden py-3">
        <motion.div
          className="flex w-max gap-3 sm:gap-4 will-change-transform"
          animate={isMoving ? { x: ['0%', '-50%'] } : undefined}
          transition={
            isMoving
              ? { duration: speed, ease: 'linear', repeat: Infinity, repeatType: 'loop' }
              : { duration: 0.3 }
          }
        >
          {loop.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(src)}
              aria-label="הגדל תמונה"
              className="h-44 sm:h-56 flex-none aspect-[3/4] overflow-hidden rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.35)] cursor-zoom-in hover:scale-[1.03] transition-transform bg-ink-night"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover pointer-events-none"
              />
            </button>
          ))}
        </motion.div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-cream-alt to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-cream-alt to-transparent z-10" />
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] bg-ink-night/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <motion.img
              src={active}
              alt=""
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] max-w-[92vw] object-contain rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] cursor-default"
            />
            <button
              type="button"
              aria-label="סגור"
              onClick={() => setActive(null)}
              className="absolute top-4 end-4 sm:top-6 sm:end-6 h-10 w-10 rounded-full bg-cream/90 text-ink-deep hover:bg-cream flex items-center justify-center shadow-lg"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M6 6 L18 18 M18 6 L6 18" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
