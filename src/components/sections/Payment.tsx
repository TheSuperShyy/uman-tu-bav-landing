import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import Card from '../ui/Card';
import { payment } from '../../content/copy.he';

export default function Payment() {
  return (
    <Section bg="bg-cream">
      <div className="text-center mb-10">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-balance text-ink-deep">
            {payment.title}
          </h2>
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
    </Section>
  );
}
