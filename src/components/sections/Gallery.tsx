import { motion, useReducedMotion } from 'framer-motion';
import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import { editorial } from '../../content/media';

const SPANS = [
  'sm:col-span-2 sm:row-span-2', // 1 — large
  '',                             // 2
  '',                             // 3
  'sm:row-span-2',                // 4 — tall
  '',                             // 5
  '',                             // 6
  'sm:col-span-2',                // 7 — wide
  '',                             // 8
  '',                             // 9
  'sm:col-span-2',                // 10 — wide
  '',                             // 11
  '',                             // 12
];

export default function Gallery() {
  const reduced = useReducedMotion();
  const photos = editorial.gallery;

  return (
    <Section bg="bg-ivory" className="relative overflow-hidden">
      <div className="text-center mb-12">
        <Reveal>
          <p className="text-xs sm:text-sm tracking-[0.32em] uppercase text-accent mb-3">
            רגעים מהמסע
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-balance">
            הסיפור בתמונות
          </h2>
        </Reveal>
      </div>

      <Reveal as="ul" stagger className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[minmax(120px,_18vw)] gap-3 sm:gap-4 max-w-6xl mx-auto">
        {photos.slice(0, 12).map((src, i) => (
          <Reveal.Item as="li" key={i} className={`relative overflow-hidden rounded-2xl group ${SPANS[i] ?? ''}`}>
            <motion.img
              src={src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
              whileHover={reduced ? undefined : { scale: 1.06 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 ring-1 ring-ink-night/10 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-ink-night/0 group-hover:bg-ink-night/10 transition-colors duration-300 pointer-events-none" />
          </Reveal.Item>
        ))}
      </Reveal>
    </Section>
  );
}
