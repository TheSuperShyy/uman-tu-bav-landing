import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  photos: readonly string[];
  speed?: number;
  height?: 'sm' | 'md' | 'lg';
};

const H = {
  sm: 'h-32 sm:h-40',
  md: 'h-44 sm:h-56',
  lg: 'h-56 sm:h-72',
};

export default function PhotoMarquee({ photos, speed = 50, height = 'md' }: Props) {
  const reduced = useReducedMotion();
  const loop = [...photos, ...photos];

  return (
    <div
      dir="ltr"
      aria-hidden
      className="relative overflow-hidden bg-ink-night py-3"
    >
      <motion.div
        className="flex w-max gap-3 sm:gap-4 will-change-transform"
        animate={reduced ? undefined : { x: ['0%', '-50%'] }}
        transition={
          reduced
            ? undefined
            : { duration: speed, ease: 'linear', repeat: Infinity, repeatType: 'loop' }
        }
      >
        {loop.map((src, i) => (
          <div
            key={i}
            className={`${H[height]} flex-none aspect-[3/4] overflow-hidden rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.35)]`}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ink-night to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ink-night to-transparent z-10" />
    </div>
  );
}
