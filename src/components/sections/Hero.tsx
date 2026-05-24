import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { hero } from '../../content/copy.he';
import { editorial } from '../../content/media';
import Button from '../ui/Button';
import Container from '../layout/Container';
import Reveal from '../motion/Reveal';
import Countdown from '../ui/Countdown';
import BrandLogo from '../ui/BrandLogo';
import CallPill from '../ui/CallPill';

const TEXT_SHADOW = '0 2px 6px rgba(0,0,0,0.7)';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <header
      ref={ref}
      data-header-theme="dark"
      className="relative isolate min-h-[100svh] overflow-hidden text-ivory flex flex-col"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{ scale: reduced ? 1 : bgScale, y: reduced ? 0 : bgY }}
      >
        {reduced ? (
          <img
            src={editorial.heroBackdrop}
            alt=""
            className="h-full w-full object-cover"
            // @ts-expect-error — React expects lowercase fetchpriority
            fetchpriority="high"
          />
        ) : (
          <video
            src={editorial.heroVideo}
            poster={editorial.heroVideoPoster}
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

      {/* Centered radial scrim to darken the area directly behind the text. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 55%, transparent 85%)',
        }}
      />

      <BrandLogo />

      <Container className="relative flex flex-1 flex-col items-center justify-start text-center -mt-6 sm:-mt-8 pt-0 pb-12">
        <Reveal>
          <p
            style={{ textShadow: TEXT_SHADOW }}
            className="text-xs sm:text-sm tracking-[0.32em] uppercase text-gold mb-6"
          >
            {hero.spotlight}
          </p>
        </Reveal>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 32, letterSpacing: '0.05em' }}
          animate={reduced ? undefined : { opacity: 1, y: 0, letterSpacing: '0em' }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          style={{ textShadow: TEXT_SHADOW, color: '#faf6ee' }}
          className="text-balance text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 max-w-3xl"
        >
          {hero.title}
        </motion.h1>

        <Reveal delay={0.3}>
          <p
            style={{ textShadow: TEXT_SHADOW, color: '#faf6ee' }}
            className="text-pretty text-lg sm:text-2xl max-w-xl mx-auto mb-8 font-light"
          >
            {hero.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <p
            style={{ textShadow: TEXT_SHADOW }}
            className="text-[10px] sm:text-xs tracking-[0.32em] uppercase text-gold mb-3"
          >
            {hero.countdownKicker}
          </p>
        </Reveal>

        <Reveal delay={0.45}>
          <Countdown />
        </Reveal>

        <Reveal delay={0.55}>
          <Button
            pulse
            onClick={() =>
              window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' })
            }
          >
            {hero.cta}
          </Button>
        </Reveal>

        <motion.button
          type="button"
          aria-label="גלילה למטה"
          onClick={() =>
            window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' })
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-10 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center bg-transparent border-0 text-cream self-center"
        >
          <motion.svg
            viewBox="0 0 24 24"
            className="h-7 w-7 sm:h-8 sm:w-8"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            animate={reduced ? undefined : { y: [0, 5, 0] }}
            transition={reduced ? undefined : { duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </motion.button>
      </Container>

      <CallPill theme="dark" />
    </header>
  );
}
