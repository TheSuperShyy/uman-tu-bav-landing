import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Variant = 'primary' | 'ghost';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> & {
  children: ReactNode;
  variant?: Variant;
  pulse?: boolean;
};

export default function Button({
  children,
  variant = 'primary',
  pulse = false,
  className = '',
  ...rest
}: Props) {
  const reduced = useReducedMotion();

  const base =
    'relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide select-none ' +
    'px-10 py-4 text-base sm:text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-ink-deep/20 ' +
    'transition-shadow ease-soft duration-200 isolate';

  const styles =
    variant === 'primary'
      ? 'bg-button text-button-text shadow-cta hover:shadow-[0_14px_30px_rgba(135,87,62,0.4)]'
      : 'bg-transparent text-ink-deep border border-ink-deep/30 hover:border-ink-deep/60';

  return (
    <motion.button
      whileHover={reduced ? undefined : { y: -3 }}
      whileTap={reduced ? undefined : { y: 0, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={`${base} ${styles} ${className}`}
      {...(rest as any)}
    >
      {pulse && !reduced && variant === 'primary' && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-button -z-10"
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
        />
      )}
      <span className="relative">{children}</span>
    </motion.button>
  );
}
