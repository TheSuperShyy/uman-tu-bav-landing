import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import { importantInfo } from '../../content/copy.he';

export default function ImportantInfo() {
  return (
    <Section bg="bg-accent-soft">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-balance">
              {importantInfo.title}
            </h2>
          </Reveal>
        </div>

        <Reveal as="ul" stagger className="space-y-3">
          {importantInfo.items.map((item, i) => (
            <Reveal.Item as="li" key={i}>
              <div className="flex items-start gap-3 rounded-xl bg-cream/80 ring-1 ring-ink-deep/10 px-5 py-4">
                <span aria-hidden className="mt-1 h-2 w-2 flex-none rounded-full bg-ink-deep/60" />
                <span className="text-lg text-ink-body text-pretty">{item}</span>
              </div>
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
