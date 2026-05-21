import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import Card from '../ui/Card';
import BlobBackdrop from '../ui/BlobBackdrop';
import { itinerary } from '../../content/copy.he';

export default function Itinerary() {
  return (
    <Section bg="bg-cream-alt" className="relative overflow-hidden">
      <BlobBackdrop position="top-left" color="bg-accent" opacity={0.14} />
      <BlobBackdrop position="bottom-right" color="bg-hero" opacity={0.16} size={400} />

      <div className="text-center mb-12">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-balance text-ink-deep">
            {itinerary.title}
          </h2>
        </Reveal>
      </div>

      <Reveal as="ul" stagger className="relative grid gap-3 sm:gap-5 grid-cols-2">
        {itinerary.items.map((item, i) => (
          <Reveal.Item as="li" key={i}>
            <Card className="h-full flex items-start gap-2 sm:gap-3 !p-3 sm:!p-6">
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-6 w-6 sm:h-7 sm:w-7 flex-none items-center justify-center rounded-full bg-ink-deep/10 text-ink-deep font-bold text-xs sm:text-sm"
              >
                {i + 1}
              </span>
              <span className="text-sm sm:text-lg leading-snug sm:leading-relaxed text-ink-body text-pretty">
                {item}
              </span>
            </Card>
          </Reveal.Item>
        ))}
      </Reveal>
    </Section>
  );
}
