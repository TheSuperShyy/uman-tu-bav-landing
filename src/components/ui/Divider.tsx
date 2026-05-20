import { motion, useReducedMotion } from 'framer-motion';

export default function Divider() {
  const reduced = useReducedMotion();

  return (
    <div className="bg-cream">
      <div className="mx-auto flex w-full max-w-container items-center gap-4 px-5 sm:px-8">
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-divider to-transparent" />
        <motion.svg
          aria-hidden
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-accent flex-none"
          animate={reduced ? undefined : { rotate: [0, 360] }}
          transition={reduced ? undefined : { duration: 28, ease: 'linear', repeat: Infinity }}
        >
          <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
        </motion.svg>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-divider to-transparent" />
      </div>
    </div>
  );
}
