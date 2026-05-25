import Section from '../layout/Section';
import Reveal from '../motion/Reveal';
import BlobBackdrop from '../ui/BlobBackdrop';
import { letterFromRonit } from '../../content/copy.he';

// Curly floral spray — vine + blooms + tendrils. Mirror via `flipped`
// for the opposite flank. Same shape used by Testimonials so the two
// sections share a visual vocabulary.
function FloralSpray({ className = '', flipped = false }: { className?: string; flipped?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 80 200"
      className={`${className} text-gold`}
      style={flipped ? { transform: 'scaleX(-1)' } : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      <path d="M40 8 Q44 40 36 80 Q28 120 44 160 Q48 180 40 196" />
      <path d="M40 30 Q60 32 64 50 Q60 56 50 52" />
      <path d="M36 70 Q16 72 12 92 Q16 100 28 94" />
      <path d="M40 110 Q60 114 66 132 Q60 140 50 134" />
      <path d="M44 150 Q24 152 20 172 Q24 180 34 174" />
      <g fill="currentColor" stroke="none">
        <circle cx="50" cy="52" r="2.5" />
        <circle cx="46" cy="48" r="1.6" /><circle cx="54" cy="48" r="1.6" />
        <circle cx="46" cy="56" r="1.6" /><circle cx="54" cy="56" r="1.6" />

        <circle cx="28" cy="94" r="2.5" />
        <circle cx="24" cy="90" r="1.6" /><circle cx="32" cy="90" r="1.6" />
        <circle cx="24" cy="98" r="1.6" /><circle cx="32" cy="98" r="1.6" />

        <circle cx="50" cy="134" r="2.5" />
        <circle cx="46" cy="130" r="1.6" /><circle cx="54" cy="130" r="1.6" />
        <circle cx="46" cy="138" r="1.6" /><circle cx="54" cy="138" r="1.6" />

        <circle cx="34" cy="174" r="2.5" />
        <circle cx="30" cy="170" r="1.6" /><circle cx="38" cy="170" r="1.6" />
        <circle cx="30" cy="178" r="1.6" /><circle cx="38" cy="178" r="1.6" />
      </g>
      <path d="M40 20 Q34 22 36 28 Q42 26 40 20 Z" fill="currentColor" stroke="none" opacity="0.7" />
      <path d="M40 90 Q46 92 44 98 Q38 96 40 90 Z" fill="currentColor" stroke="none" opacity="0.7" />
      <path d="M40 130 Q34 132 36 138 Q42 136 40 130 Z" fill="currentColor" stroke="none" opacity="0.7" />
    </svg>
  );
}

// Heart-shaped flourish used as a small inline accent above the letter.
function HeartFlourish({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`${className} text-gold`} fill="currentColor">
      <path d="M12 21 C5 16 1 11 4 6 Q7 2 12 6 Q17 2 20 6 C23 11 19 16 12 21 Z" />
    </svg>
  );
}

export default function LetterFromRonit() {
  return (
    <Section bg="bg-cream-alt" noLogo className="relative overflow-hidden">
      {/* Warm rose + gold blobs for ambient color in opposite corners. */}
      <BlobBackdrop position="top-left" color="bg-accent" size={380} opacity={0.22} />
      <BlobBackdrop position="bottom-right" color="bg-gold" size={420} opacity={0.18} />

      {/* Soft radial spotlight pulls focus to the centered letter card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(195,149,125,0.32) 0%, transparent 65%)',
        }}
      />

      {/* Subtle hatched texture across the cream bg. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(135,87,62,1) 0 1px, transparent 1px 14px)',
        }}
      />

      <Reveal>
        <div className="relative mx-auto max-w-xl">
          {/* Floral sprays flanking the card on tablet/desktop. */}
          <FloralSpray className="hidden sm:block absolute -start-20 lg:-start-28 top-1/2 -translate-y-1/2 h-[320px] w-20 opacity-80" />
          <FloralSpray flipped className="hidden sm:block absolute -end-20 lg:-end-28 top-1/2 -translate-y-1/2 h-[320px] w-20 opacity-80" />

          {/* Tiny heart accent above the kicker. */}
          <div className="flex items-center justify-center gap-2 mb-2" aria-hidden>
            <span className="h-px w-8 bg-gold/50" />
            <HeartFlourish className="h-3 w-3" />
            <span className="h-px w-8 bg-gold/50" />
          </div>

          <figure className="relative rounded-3xl bg-cream p-5 sm:p-8 shadow-card ring-1 ring-gold/30">
            {/* Curly leaf flourishes anchored to the card corners. */}
            <svg
              aria-hidden
              viewBox="0 0 48 48"
              className="absolute -top-4 -start-4 h-10 w-10 text-gold"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              <path d="M4 44 Q4 20 24 4" />
              <path d="M10 36 Q18 28 26 30 Q22 38 10 36 Z" fill="currentColor" opacity="0.6" />
              <path d="M16 28 Q22 22 28 24" />
              <circle cx="6" cy="42" r="1.6" fill="currentColor" />
            </svg>
            <svg
              aria-hidden
              viewBox="0 0 48 48"
              className="absolute -bottom-4 -end-4 h-10 w-10 text-gold"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              <path d="M44 4 Q44 28 24 44" />
              <path d="M38 12 Q30 20 22 18 Q26 10 38 12 Z" fill="currentColor" opacity="0.6" />
              <path d="M32 20 Q26 26 20 24" />
              <circle cx="42" cy="6" r="1.6" fill="currentColor" />
            </svg>

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
        </div>
      </Reveal>
    </Section>
  );
}
