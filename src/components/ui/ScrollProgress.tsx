import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.35,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: 'right' }}
      className="fixed top-0 inset-x-0 h-[3px] bg-gradient-to-l from-button via-accent to-hero z-50"
    />
  );
}
