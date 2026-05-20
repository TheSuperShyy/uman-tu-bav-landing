import type { ReactNode } from 'react';
import Container from './Container';

type Props = {
  children: ReactNode;
  bg?: string;
  className?: string;
  id?: string;
  padded?: boolean;
};

export default function Section({
  children,
  bg = 'bg-cream',
  className = '',
  id,
  padded = true,
}: Props) {
  return (
    <section
      id={id}
      className={`${bg} ${padded ? 'py-16 sm:py-20 lg:py-24' : ''} ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}
