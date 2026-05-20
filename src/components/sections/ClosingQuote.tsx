import { motion, useReducedMotion } from 'framer-motion';
import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import FloatingDecor from '../ui/FloatingDecor';
import { closingQuote } from '../../content/copy.he';

export default function ClosingQuote() {
  const reduced = useReducedMotion();

  return (
    <Section bg="bg-hero" className="relative overflow-hidden">
      <FloatingDecor shape="sparkle" size={28} className="absolute top-10 start-[10%]" delay={0} opacity={0.3} />
      <FloatingDecor shape="sparkle" size={20} className="absolute bottom-10 end-[12%]" delay={2} opacity={0.28} />
      <FloatingDecor shape="heart" size={22} className="absolute top-1/2 start-[6%]" delay={3.5} opacity={0.22} />

      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <motion.p
            className="relative text-2xl sm:text-3xl italic font-medium text-cream text-balance"
            style={{
              backgroundImage:
                'linear-gradient(120deg, rgba(255,245,239,0.95) 0%, rgba(255,245,239,1) 40%, rgba(255,255,255,1) 50%, rgba(255,245,239,1) 60%, rgba(255,245,239,0.95) 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
            animate={reduced ? undefined : { backgroundPosition: ['200% 0%', '-200% 0%'] }}
            transition={
              reduced
                ? undefined
                : { duration: 8, ease: 'linear', repeat: Infinity }
            }
          >
            “{closingQuote.text}”
          </motion.p>
        </Reveal>
      </div>
    </Section>
  );
}
