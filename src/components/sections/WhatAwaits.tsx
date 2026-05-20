import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import Card from '../ui/Card';
import BlobBackdrop from '../ui/BlobBackdrop';
import { whatAwaits } from '../../content/copy.he';

export default function WhatAwaits() {
  return (
    <Section bg="bg-cream-alt" className="relative overflow-hidden">
      <BlobBackdrop position="top-right" color="bg-accent" opacity={0.16} />
      <BlobBackdrop position="bottom-left" color="bg-hero" opacity={0.14} size={360} />

      <div className="text-center mb-12">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-balance text-ink-deep">
            {whatAwaits.title}
          </h2>
        </Reveal>
      </div>

      <Reveal as="ul" stagger className="relative grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {whatAwaits.items.map((item, i) => (
          <Reveal.Item as="li" key={i}>
            <Card className="h-full text-center text-base sm:text-lg leading-relaxed">
              {item}
            </Card>
          </Reveal.Item>
        ))}
      </Reveal>
    </Section>
  );
}
