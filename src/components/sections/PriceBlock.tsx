import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { price } from '../../content/copy.he';

export default function PriceBlock() {
  return (
    <Section bg="bg-cream-alt">
      <Reveal>
        <div className="mx-auto max-w-xl text-center rounded-3xl bg-white/70 ring-1 ring-divider px-8 py-10 sm:py-12 shadow-card">
          <p className="text-sm sm:text-base tracking-wide text-ink-deep/80 mb-2">
            {price.label}
          </p>
          <p className="text-5xl sm:text-6xl font-extrabold text-ink-deep mb-4">
            <bdi>{price.amount}</bdi>
          </p>
          <div className="mb-8">
            <Badge>{price.scarcity}</Badge>
          </div>
          <Button pulse onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}>
            {price.cta}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
