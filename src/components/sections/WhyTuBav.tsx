import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import { whyTuBav } from '../../content/copy.he';

export default function WhyTuBav() {
  return (
    <Section bg="bg-cream">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 text-balance text-ink-deep">
            {whyTuBav.title}
          </h2>
        </Reveal>
        <Reveal as="div" stagger className="space-y-5">
          {whyTuBav.paragraphs.map((p, i) => (
            <Reveal.Item key={i}>
              <p className="text-lg sm:text-xl text-ink-body text-pretty">{p}</p>
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
