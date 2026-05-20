import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  items: readonly string[];
  speed?: number;
};

export default function Marquee({ items, speed = 38 }: Props) {
  const reduced = useReducedMotion();
  const loop = [...items, ...items, ...items];

  return (
    <div
      aria-hidden
      className="relative overflow-hidden py-5 bg-gradient-to-l from-cream via-cream-alt to-cream border-y border-divider"
    >
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        animate={reduced ? undefined : { x: ['0%', '-33.333%'] }}
        transition={
          reduced
            ? undefined
            : { duration: speed, ease: 'linear', repeat: Infinity }
        }
      >
        {loop.map((item, i) => (
          <span
            key={i}
            className="text-ink-deep text-base sm:text-lg font-semibold inline-flex items-center gap-3"
          >
            {item}
            <span aria-hidden className="text-accent">✦</span>
          </span>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 start-0 w-16 bg-gradient-to-l from-transparent to-cream" />
      <div className="pointer-events-none absolute inset-y-0 end-0 w-16 bg-gradient-to-r from-transparent to-cream" />
    </div>
  );
}
