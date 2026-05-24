import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Reveal from '../motion/Reveal';
import { closingQuote } from '../../content/copy.he';
import { editorial } from '../../content/media';

export default function ClosingQuote() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const yShift = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[70svh] overflow-hidden flex items-center justify-center text-ivory"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{ scale: reduced ? 1 : scale, y: reduced ? 0 : yShift }}
      >
        <img
          src={editorial.closingBackdrop}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-night/75 via-ink-night/82 to-ink-night/95"
      />

      {/* Centered scrim behind the quote */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 55%, transparent 85%)',
        }}
      />

      <div className="relative mx-auto max-w-2xl text-center px-6">
        <Reveal>
          <motion.p
            className="relative text-2xl sm:text-4xl italic font-medium text-balance leading-snug"
            style={{
              backgroundImage:
                'linear-gradient(120deg, rgba(250,246,238,0.95) 0%, rgba(250,246,238,1) 40%, #ffffff 50%, rgba(250,246,238,1) 60%, rgba(250,246,238,0.95) 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
            animate={reduced ? undefined : { backgroundPosition: ['200% 0%', '-200% 0%'] }}
            transition={
              reduced
                ? undefined
                : { duration: 9, ease: 'linear', repeat: Infinity }
            }
          >
            “{closingQuote.text}”
          </motion.p>
        </Reveal>
      </div>
    </section>
  );
}
