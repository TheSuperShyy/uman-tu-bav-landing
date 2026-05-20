import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Container from '../layout/Container';
import Reveal from '../motion/Reveal';

type Props = {
  image: string;
  /** Hebrew quote or short line laid over the image. Optional. */
  caption?: string;
  /** Approximate viewport-height ratio. */
  height?: 'tall' | 'standard' | 'short';
  /** Optional eyebrow above caption. */
  kicker?: string;
  /** Optional 2nd line of italic flourish. */
  flourish?: string;
};

const HEIGHTS: Record<NonNullable<Props['height']>, string> = {
  tall: 'min-h-[90svh]',
  standard: 'min-h-[70svh]',
  short: 'min-h-[55svh]',
};

export default function CinematicMoment({
  image,
  caption,
  height = 'standard',
  kicker,
  flourish,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  return (
    <section
      ref={ref}
      className={`relative isolate overflow-hidden text-ivory ${HEIGHTS[height]} flex items-center`}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{ y: reduced ? 0 : y, scale: reduced ? 1 : scale }}
      >
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-night/40 via-ink-night/55 to-ink-night/80"
      />

      {caption && (
        <Container className="relative text-center py-16">
          {kicker && (
            <Reveal>
              <p className="text-xs sm:text-sm tracking-[0.32em] uppercase text-gold/95 mb-5">
                {kicker}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.08}>
            <p className="mx-auto max-w-2xl text-balance text-2xl sm:text-4xl lg:text-5xl font-bold text-ivory leading-snug drop-shadow-[0_3px_18px_rgba(0,0,0,0.45)]">
              {caption}
            </p>
          </Reveal>
          {flourish && (
            <Reveal delay={0.18}>
              <p className="mt-5 italic text-base sm:text-lg text-ivory/85">{flourish}</p>
            </Reveal>
          )}
        </Container>
      )}
    </section>
  );
}
