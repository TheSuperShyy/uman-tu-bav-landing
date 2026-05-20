import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { hero } from '../../content/copy.he';
import Button from '../ui/Button';
import Container from '../layout/Container';
import FloatingDecor from '../ui/FloatingDecor';
import Reveal from '../motion/Reveal';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const decorY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);

  return (
    <header
      ref={ref}
      className="relative overflow-hidden bg-hero text-cream isolate"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 30%, rgba(255,245,239,0.35) 0%, rgba(255,245,239,0) 60%), radial-gradient(45% 35% at 20% 80%, rgba(195,149,125,0.5) 0%, rgba(195,149,125,0) 70%), radial-gradient(45% 35% at 80% 70%, rgba(135,87,62,0.35) 0%, rgba(135,87,62,0) 70%)',
        }}
        animate={
          reduced
            ? undefined
            : { backgroundPosition: ['0% 0%, 0% 0%, 0% 0%', '6% 4%, -4% 2%, 4% -3%', '0% 0%, 0% 0%, 0% 0%'] }
        }
        transition={reduced ? undefined : { duration: 18, ease: 'easeInOut', repeat: Infinity }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <motion.div style={{ y: reduced ? 0 : decorY }} className="absolute inset-0 pointer-events-none">
        <FloatingDecor shape="heart" size={44} className="absolute top-10 start-[6%]" delay={0} opacity={0.28} />
        <FloatingDecor shape="sparkle" size={30} className="absolute top-1/4 end-[8%]" delay={1.5} opacity={0.32} />
        <FloatingDecor shape="sparkle" size={22} className="absolute top-[15%] start-[40%]" delay={3} opacity={0.22} />
        <FloatingDecor shape="heart" size={26} className="absolute bottom-20 end-[18%]" delay={2.5} opacity={0.24} />
        <FloatingDecor shape="sparkle" size={38} className="absolute bottom-28 start-[12%]" delay={0.8} opacity={0.26} />
        <FloatingDecor shape="circle" size={16} className="absolute top-1/2 end-[30%]" delay={4} opacity={0.18} />
        <FloatingDecor shape="heart" size={18} className="absolute top-[40%] start-[20%]" delay={5.5} opacity={0.2} />
      </motion.div>

      <motion.div style={{ opacity: reduced ? 1 : heroFade }}>
        <Container className="relative py-24 sm:py-32 lg:py-40 text-center">
          <Reveal>
            <p className="text-base sm:text-lg font-semibold tracking-wide opacity-95 mb-6">
              {hero.spotlight}
            </p>
          </Reveal>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 24, scale: 1.04 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-balance text-3xl sm:text-5xl lg:text-6xl font-extrabold text-cream drop-shadow-sm leading-tight mb-5"
          >
            {hero.title}
          </motion.h1>

          <Reveal delay={0.25}>
            <p className="text-pretty text-lg sm:text-xl opacity-95 max-w-xl mx-auto mb-10">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <Button
              pulse
              onClick={() =>
                document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {hero.cta}
            </Button>
          </Reveal>

          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-6 inset-x-0 flex justify-center"
          >
            <motion.span
              animate={reduced ? undefined : { y: [0, 8, 0] }}
              transition={reduced ? undefined : { duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
              className="text-cream text-2xl"
            >
              ↓
            </motion.span>
          </motion.div>
        </Container>
      </motion.div>
    </header>
  );
}
