import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, fadeUpContainer, fadeUpItem, SOFT_EASE } from './variants';

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'header' | 'article' | 'ul' | 'li';
  /** When true, children become staggered items (use <Reveal.Item> inside). */
  stagger?: boolean;
};

function Reveal({ children, className, delay = 0, as = 'div', stagger = false }: Props) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) {
    const Tag = as as keyof JSX.IntrinsicElements;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={stagger ? fadeUpContainer : fadeUp}
      transition={!stagger ? { duration: 0.7, ease: SOFT_EASE, delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}

function Item({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) {
    const Tag = as as keyof JSX.IntrinsicElements;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag className={className} variants={fadeUpItem}>
      {children}
    </MotionTag>
  );
}

Reveal.Item = Item;

export default Reveal;
