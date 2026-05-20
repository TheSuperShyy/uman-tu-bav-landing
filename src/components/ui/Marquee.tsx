import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  items: readonly string[];
  speed?: number;
};

export default function Marquee({ items, speed = 38 }: Props) {
  const reduced = useReducedMotion();
  const loop = [...items, ...items];

  return (
    <div
      dir="ltr"
      aria-hidden
      className="relative overflow-hidden py-5 bg-cream-alt border-y border-divider"
    >
      <motion.div
        className="flex w-max whitespace-nowrap will-change-transform"
        animate={reduced ? undefined : { x: ['0%', '-50%'] }}
        transition={
          reduced
            ? undefined
            : { duration: speed, ease: 'linear', repeat: Infinity, repeatType: 'loop' }
        }
      >
        {loop.map((item, i) => (
          <span
            key={i}
            className="px-6 inline-flex items-center gap-3 text-ink-deep text-base sm:text-lg font-semibold"
          >
            <bdi>{item}</bdi>
            <span aria-hidden className="text-accent">✦</span>
          </span>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream-alt to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream-alt to-transparent z-10" />
    </div>
  );
}
