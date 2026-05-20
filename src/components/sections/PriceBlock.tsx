import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { priceTeaser } from '../../content/copy.he';

export default function PriceBlock() {
  return (
    <Section bg="bg-cream-alt">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center rounded-3xl bg-white/70 ring-1 ring-divider px-8 py-12 sm:py-14 shadow-card">
          <div className="mb-5">
            <Badge>{priceTeaser.kicker}</Badge>
          </div>
          <p className="text-3xl sm:text-5xl font-extrabold text-ink-deep text-balance leading-tight mb-5">
            {priceTeaser.headline}
          </p>
          <p className="text-lg sm:text-xl text-ink-body text-pretty mb-8">
            {priceTeaser.body}
          </p>
          <p className="text-sm sm:text-base tracking-wide text-ink-deep/70 italic mb-8">
            {priceTeaser.reveal}
          </p>
          <Button
            pulse
            onClick={() =>
              document
                .getElementById('price-reveal')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {priceTeaser.cta}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
