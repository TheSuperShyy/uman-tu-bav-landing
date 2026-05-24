import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import { letterFromRonit } from '../../content/copy.he';

export default function LetterFromRonit() {
  return (
    <Section bg="bg-cream-alt">
      <Reveal>
        <figure className="mx-auto max-w-xl rounded-3xl bg-cream p-5 sm:p-8 shadow-card ring-1 ring-divider">
          <figcaption className="mb-5 text-center text-xs sm:text-sm uppercase tracking-[0.32em] text-ink-deep/60">
            {letterFromRonit.kicker}
          </figcaption>
          <picture>
            <source srcSet={letterFromRonit.image} type="image/webp" />
            <img
              src={letterFromRonit.imageFallback}
              alt={letterFromRonit.alt}
              loading="lazy"
              decoding="async"
              className="block w-full h-auto rounded-2xl"
            />
          </picture>
        </figure>
      </Reveal>
    </Section>
  );
}
