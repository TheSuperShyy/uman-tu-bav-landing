import type { ReactNode } from 'react';

export default function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-ink-deep/10 px-4 py-1.5 text-sm font-semibold text-ink-deep ring-1 ring-ink-deep/15">
      {children}
    </span>
  );
}
