import type { ReactNode } from 'react';
import Container from './Container';

type Props = {
  children: ReactNode;
  bg?: string;
  className?: string;
  id?: string;
  padded?: boolean;
};

// Background classes whose visible color is dark enough that the sticky
// header pill needs the ivory/glass treatment to read. Everything else
// (cream, cream-alt, ivory, white-card overlays) gets the warm-tan pill.
const DARK_BGS = new Set([
  'bg-ink-deep',
  'bg-ink-night',
  'bg-accent',
  'bg-hero',
]);

export default function Section({
  children,
  bg = 'bg-cream',
  className = '',
  id,
  padded = true,
}: Props) {
  const theme = DARK_BGS.has(bg) ? 'dark' : 'light';
  return (
    <section
      id={id}
      data-header-theme={theme}
      className={`${bg} ${padded ? 'py-16 sm:py-20 lg:py-24' : ''} ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}
