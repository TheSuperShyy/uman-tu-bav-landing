import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import { whoFor } from '../../content/copy.he';

export default function WhoFor() {
  return (
    <Section bg="bg-cream">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-balance text-ink-deep">
              {whoFor.title}
            </h2>
          </Reveal>
        </div>

        <Reveal as="ul" stagger className="space-y-4">
          {whoFor.items.map((item, i) => (
            <Reveal.Item as="li" key={i}>
              <div className="flex items-start gap-3 sm:gap-4 rounded-xl bg-white/60 ring-1 ring-divider px-5 py-4 shadow-card">
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent text-cream text-sm font-bold"
                >
                  ✓
                </span>
                <span className="text-lg text-ink-body text-pretty">{item}</span>
              </div>
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
