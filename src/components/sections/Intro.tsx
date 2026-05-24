import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import { intro } from '../../content/copy.he';
import { editorial } from '../../content/media';
import { motion, useReducedMotion } from 'framer-motion';

export default function Intro() {
  const reduced = useReducedMotion();

  return (
    <Section bg="bg-cream" className="relative overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
        <Reveal>
          <motion.div
            whileHover={reduced ? undefined : { scale: 1.015 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card ring-1 ring-divider"
          >
            {reduced ? (
              <img
                src={editorial.ronitMoment}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <video
                src={editorial.ronitVideo}
                poster={editorial.ronitVideoPoster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-night/30 via-transparent to-transparent" />
          </motion.div>
        </Reveal>

        <div className="space-y-5 text-center lg:text-start">
          {intro.lines.map((line, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <p className="text-lg sm:text-xl text-ink-body text-pretty">{line}</p>
            </Reveal>
          ))}

          <Reveal as="ul" stagger className="pt-6 space-y-3 text-base sm:text-lg text-ink-deep">
            {intro.highlights.map((h, i) => (
              <Reveal.Item as="li" key={i}>
                {h}
              </Reveal.Item>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
