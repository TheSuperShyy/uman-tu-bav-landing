import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = '' }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4, boxShadow: '0 18px 38px rgba(107, 69, 50, 0.16)' }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={
        'rounded-2xl bg-cream/95 shadow-card ring-1 ring-divider/80 ' +
        'p-5 sm:p-6 text-ink-body text-pretty backdrop-blur-[1px] ' +
        className
      }
    >
      {children}
    </motion.div>
  );
}
