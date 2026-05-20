import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import { intro } from '../../content/copy.he';

export default function Intro() {
  return (
    <Section bg="bg-cream">
      <div className="mx-auto max-w-2xl text-center space-y-5">
        {intro.lines.map((line, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <p className="text-lg sm:text-xl text-ink-body text-pretty">{line}</p>
          </Reveal>
        ))}

        <Reveal as="ul" stagger className="pt-6 space-y-3 text-base sm:text-lg text-ink-deep">
          {intro.highlights.map((h, i) => (
            <Reveal.Item as="li" key={i}>
              {h}
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
