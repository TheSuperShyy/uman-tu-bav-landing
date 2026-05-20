import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  size?: number;
  opacity?: number;
};

const POS: Record<NonNullable<Props['position']>, string> = {
  'top-left': 'top-[-10%] start-[-10%]',
  'top-right': 'top-[-10%] end-[-10%]',
  'bottom-left': 'bottom-[-10%] start-[-10%]',
  'bottom-right': 'bottom-[-10%] end-[-10%]',
};

export default function BlobBackdrop({
  position = 'top-right',
  color = 'bg-accent',
  size = 420,
  opacity = 0.18,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute -z-10 rounded-full blur-3xl ${color} ${POS[position]}`}
      style={{ width: size, height: size, opacity }}
      animate={
        reduced
          ? undefined
          : { scale: [1, 1.08, 1], x: [0, 10, 0], y: [0, -8, 0] }
      }
      transition={
        reduced
          ? undefined
          : { duration: 14, ease: 'easeInOut', repeat: Infinity }
      }
    />
  );
}
