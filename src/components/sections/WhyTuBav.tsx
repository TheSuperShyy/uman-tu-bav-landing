import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Container from '../layout/Container';
import Reveal from '../motion/Reveal';
import BrandLogo from '../ui/BrandLogo';
import CallPill from '../ui/CallPill';
import { whyTuBav } from '../../content/copy.he';
import { editorial } from '../../content/media';

const TEXT_SHADOW = '0 2px 6px rgba(0,0,0,0.7)';

export default function WhyTuBav() {
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
      className="relative isolate overflow-hidden text-ivory min-h-[110svh] flex flex-col"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{ y: reduced ? 0 : y, scale: reduced ? 1 : scale }}
      >
        <img
          src={editorial.shofar}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-night/78 via-ink-night/85 to-ink-night/95"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 75% 60% at 50% 50%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 55%, transparent 85%)',
        }}
      />

      <BrandLogo />

      <Container className="relative text-center flex-1 flex flex-col justify-center py-12 -mt-20 sm:-mt-28">
        <Reveal>
          <h2
            style={{ textShadow: TEXT_SHADOW, color: '#faf6ee' }}
            className="text-balance text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-10 max-w-3xl mx-auto"
          >
            {whyTuBav.title}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <blockquote
            style={{ textShadow: TEXT_SHADOW, color: '#faf6ee' }}
            className="mx-auto max-w-2xl text-2xl sm:text-3xl lg:text-4xl font-bold italic leading-snug text-balance mb-3"
          >
            „{whyTuBav.quote}״
          </blockquote>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{ textShadow: TEXT_SHADOW }}
            className="text-xs sm:text-sm uppercase tracking-[0.28em] text-gold mb-12"
          >
            {whyTuBav.quoteAttribution}
          </p>
        </Reveal>

        <Reveal as="div" stagger className="mx-auto max-w-2xl space-y-4">
          {whyTuBav.paragraphs.map((p, i) => (
            <Reveal.Item key={i}>
              <p
                style={{ textShadow: TEXT_SHADOW, color: '#faf6ee' }}
                className="text-base sm:text-lg lg:text-xl text-pretty"
              >
                {p}
              </p>
            </Reveal.Item>
          ))}
        </Reveal>
      </Container>

      <CallPill theme="dark" />
    </section>
  );
}
