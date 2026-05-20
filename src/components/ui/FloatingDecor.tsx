import { motion, useReducedMotion } from 'framer-motion';

type Shape = 'heart' | 'sparkle' | 'circle';

type Props = {
  shape?: Shape;
  className?: string;
  size?: number;
  delay?: number;
  duration?: number;
  /** Y-axis travel in px (peak). */
  drift?: number;
  /** Opacity (very low by default — purely decorative). */
  opacity?: number;
};

const PATHS: Record<Shape, JSX.Element> = {
  heart: (
    <path d="M12 21s-7.5-4.8-9.6-9.3C.9 8 3 4 6.7 4c2 0 3.5 1 5.3 3 1.8-2 3.3-3 5.3-3 3.7 0 5.8 4 4.3 7.7C19.5 16.2 12 21 12 21z" />
  ),
  sparkle: (
    <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
  ),
  circle: <circle cx="12" cy="12" r="9" />,
};

export default function FloatingDecor({
  shape = 'heart',
  className = '',
  size = 28,
  delay = 0,
  duration = 6,
  drift = 8,
  opacity = 0.18,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`pointer-events-none select-none ${className}`}
      style={{ color: '#fff5ef', opacity }}
      animate={reduced ? undefined : { y: [0, -drift, 0] }}
      transition={
        reduced
          ? undefined
          : { duration, ease: 'easeInOut', repeat: Infinity, delay }
      }
    >
      {PATHS[shape]}
    </motion.svg>
  );
}
