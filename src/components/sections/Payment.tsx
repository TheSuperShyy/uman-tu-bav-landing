import { motion, useReducedMotion } from 'framer-motion';
import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import Card from '../ui/Card';
import Button from '../ui/Button';
import CountUp from '../ui/CountUp';
import { payment, price, priceReveal } from '../../content/copy.he';

export default function Payment() {
  const reduced = useReducedMotion();

  return (
    <Section id="price-reveal" bg="bg-cream" className="relative overflow-hidden">
      {/* Decorative warm glow behind the price */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 50% 30%, rgba(195,149,125,0.22) 0%, rgba(195,149,125,0) 70%)',
        }}
        animate={reduced ? undefined : { opacity: [0.85, 1, 0.85] }}
        transition={reduced ? undefined : { duration: 6, ease: 'easeInOut', repeat: Infinity }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-xs sm:text-sm tracking-[0.32em] uppercase text-accent mb-4">
            {priceReveal.kicker}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="text-sm sm:text-base tracking-wide text-ink-deep/70 mb-3">
            {priceReveal.label}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          {/* dir="ltr" pins the number-then-symbol order. Without this,
              RTL flex reverses the inline-flex children and the ₪ ends
              up on the wrong side (left of the digits), inconsistent
              with the option cards below which render "5,900₪". */}
          <div
            dir="ltr"
            className="relative inline-flex items-baseline gap-1 mb-2 leading-none"
          >
            <CountUp
              to={price.amountValue}
              duration={1.9}
              className="font-extrabold text-ink-deep text-[64px] sm:text-[96px] lg:text-[112px] tracking-tight tabular-nums"
            />
            <span className="font-extrabold text-ink-deep text-4xl sm:text-6xl lg:text-7xl">
              {priceReveal.currency}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="text-base sm:text-lg text-ink-body/85 text-pretty mb-12 max-w-md mx-auto">
            {priceReveal.postlude}
          </p>
        </Reveal>
      </div>

      <Reveal as="ul" stagger className="mx-auto grid max-w-2xl gap-4 sm:gap-5 sm:grid-cols-2">
        {payment.options.map((opt, i) => (
          <Reveal.Item as="li" key={i}>
            <Card className="h-full text-center">
              <p className="text-sm tracking-wider uppercase text-ink-deep/70 mb-2">
                {opt.label}
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-ink-deep mb-2">
                <bdi>{opt.amount}</bdi>
              </p>
              {opt.note ? (
                <p className="text-sm text-ink-body/80">{opt.note}</p>
              ) : null}
            </Card>
          </Reveal.Item>
        ))}
      </Reveal>

      <Reveal delay={0.2}>
        <div className="text-center mt-12">
          <Button
            pulse
            onClick={() =>
              document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {price.cta}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
