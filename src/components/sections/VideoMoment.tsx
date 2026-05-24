import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Container from '../layout/Container';
import Reveal from '../motion/Reveal';
import BrandLogo from '../ui/BrandLogo';
import CallPill from '../ui/CallPill';

type Props = {
  src: string;
  poster: string;
  caption?: string;
  kicker?: string;
  flourish?: string;
  height?: 'tall' | 'standard' | 'short';
};

const HEIGHTS: Record<NonNullable<Props['height']>, string> = {
  tall: 'min-h-[45svh]',
  standard: 'min-h-[35svh]',
  short: 'min-h-[28svh]',
};

const TEXT_SHADOW = '0 2px 6px rgba(0,0,0,0.7)';

export default function VideoMoment({
  src,
  poster,
  caption,
  kicker,
  flourish,
  height = 'standard',
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
      data-header-theme="dark"
      className={`relative isolate overflow-hidden text-ivory ${HEIGHTS[height]} flex flex-col`}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{ y: reduced ? 0 : y, scale: reduced ? 1 : scale }}
      >
        {reduced ? (
          <img src={poster} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <video
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="h-full w-full object-cover"
          />
        )}
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-night/75 via-ink-night/82 to-ink-night/95"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 55%, transparent 85%)',
        }}
      />

      <BrandLogo />

      <div className="relative flex-1 flex items-center -mt-8 sm:-mt-12">
        {caption && (
          <Container className="relative text-center py-12 w-full">
            {kicker && (
              <Reveal>
                <p
                  style={{ textShadow: TEXT_SHADOW }}
                  className="text-xs sm:text-sm tracking-[0.32em] uppercase text-gold mb-5"
                >
                  {kicker}
                </p>
              </Reveal>
            )}
            <Reveal delay={0.08}>
              <p
                style={{ textShadow: TEXT_SHADOW, color: '#faf6ee' }}
                className="mx-auto max-w-2xl text-balance text-2xl sm:text-4xl lg:text-5xl font-bold leading-snug"
              >
                {caption}
              </p>
            </Reveal>
            {flourish && (
              <Reveal delay={0.18}>
                <p
                  style={{ textShadow: TEXT_SHADOW, color: '#faf6ee' }}
                  className="mt-5 italic text-base sm:text-lg"
                >
                  {flourish}
                </p>
              </Reveal>
            )}
          </Container>
        )}
      </div>

      <CallPill theme="dark" />
    </section>
  );
}
