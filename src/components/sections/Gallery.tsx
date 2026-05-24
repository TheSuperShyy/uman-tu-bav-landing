import { motion, useReducedMotion } from 'framer-motion';
import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import { editorial } from '../../content/media';

// Cycling pattern that produces visual rhythm without depending on
// exact photo count. Index modulo this array length is enough — the
// `grid-flow-row-dense` on the grid container fills any leftover gaps
// automatically, so we no longer need to hand-pair spans with images.
const SPANS = [
  'sm:col-span-2 sm:row-span-2', // 0 — large
  '',                             // 1
  '',                             // 2
  'sm:row-span-2',                // 3 — tall
  '',                             // 4
  '',                             // 5
  'sm:col-span-2',                // 6 — wide
  '',                             // 7
  '',                             // 8
  'sm:col-span-2',                // 9 — wide
  '',                             // 10
  '',                             // 11
  'sm:row-span-2',                // 12 — tall
  '',                             // 13
  '',                             // 14
  '',                             // 15
];

export default function Gallery() {
  const reduced = useReducedMotion();
  const photos = editorial.gallery;

  return (
    <Section bg="bg-ivory" className="relative overflow-hidden cv-auto">
      <div className="text-center mb-12">
        <Reveal>
          <p className="text-xs sm:text-sm tracking-[0.32em] uppercase text-accent mb-3">
            רגעים מהמסע
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-balance text-ink-deep">
            הסיפור בתמונות
          </h2>
        </Reveal>
      </div>

      {/* grid-flow-row-dense backfills cells that would otherwise be
          empty when a row-span-2 / col-span-2 item pushes subsequent
          1x1 items out of an evenly-packed row — the "white space
          beside the tall photo" symptom. */}
      <Reveal as="ul" stagger className="grid grid-cols-2 sm:grid-cols-4 grid-flow-row-dense auto-rows-[minmax(120px,_18vw)] gap-3 sm:gap-4 max-w-6xl mx-auto">
        {photos.map((src, i) => (
          <Reveal.Item as="li" key={i} className={`relative overflow-hidden rounded-2xl group ${SPANS[i] ?? ''}`}>
            <motion.img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
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
