import { footer } from '../../content/copy.he';

// Centered call-pill — used at the bottom of every section. Colors
// adapt to the section's background via the `theme` prop (passed in by
// the section so we don't need a global scroll listener). The big
// bottom padding leaves room for the fixed PageNav so the two don't
// stack on top of each other on viewport-height sections (Hero etc.).
type Props = { theme?: 'dark' | 'light' };

const STYLES = {
  dark: {
    bg: 'rgba(250,246,238,0.16)',
    border: 'rgba(250,246,238,0.35)',
    color: 'rgba(250,246,238,0.95)',
  },
  light: {
    bg: 'rgba(135,87,62,0.08)',
    border: 'rgba(135,87,62,0.22)',
    color: 'rgba(107,69,50,1)',
  },
} as const;

export default function CallPill({ theme = 'light' }: Props) {
  const s = STYLES[theme];
  return (
    <div className="w-full flex items-center justify-center pt-2 pb-24 sm:pt-3 sm:pb-28">
      <a
        href={`tel:${footer.phone.replace(/-/g, '')}`}
        style={{
          backgroundColor: s.bg,
          borderColor: s.border,
          color: s.color,
        }}
        className="group inline-flex items-center gap-2 sm:gap-2.5 rounded-full border px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold tracking-wide hover:scale-[1.02] backdrop-blur-sm"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-none"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
        </svg>
        <span className="opacity-80">{footer.phoneLabel}</span>
        <span aria-hidden className="opacity-40">·</span>
        <bdi className="font-bold">{footer.phone}</bdi>
      </a>
    </div>
  );
}
