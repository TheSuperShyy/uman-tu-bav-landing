import { footer } from '../../content/copy.he';
import { usePageNav } from './PageNavContext';

// Sticky bottom nav bar — Back · dot indicator · phone · Next.
// RTL-aware: "next" chevron points left (Hebrew reading direction).
export default function PageNav() {
  const { current, total, goNext, goBack, goTo } = usePageNav();
  const isFirst = current === 0;
  const isLast = current === total - 1;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-center pb-4 sm:pb-5 pointer-events-none">
      <div
        className="pointer-events-auto flex items-center gap-2 sm:gap-3 rounded-full border px-2 sm:px-3 py-1.5 sm:py-2 backdrop-blur-md shadow-cta"
        style={{
          backgroundColor: 'rgba(255,252,249,0.94)',
          borderColor: 'rgba(107,69,50,0.22)',
          color: 'rgba(107,69,50,1)',
        }}
      >
        {/* Home — jumps back to the first page. Disabled when already there. */}
        <button
          type="button"
          onClick={() => goTo(0)}
          disabled={isFirst}
          aria-label="לעמוד הראשון"
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-button hover:bg-button/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 11l9-8 9 8" />
            <path d="M5 10v10h14V10" />
            <path d="M10 20v-6h4v6" />
          </svg>
        </button>

        {/* Back — chevron points right (RTL "previous"). Disabled on first page. */}
        <button
          type="button"
          onClick={goBack}
          disabled={isFirst}
          aria-label="הקודם"
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-button hover:bg-button/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>

        {/* Dot indicator — active dot is a longer pill. */}
        <div className="flex items-center gap-1.5 px-1" aria-hidden>
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={
                i === current
                  ? 'h-1.5 w-5 rounded-full bg-button transition-all'
                  : 'h-1.5 w-1.5 rounded-full bg-button/30 transition-all'
              }
            />
          ))}
        </div>

        {/* Phone link — icon-only since the per-section CallPill shows
            the visible number on every page. */}
        <a
          href={`tel:${footer.phone.replace(/-/g, '')}`}
          aria-label={`${footer.phoneLabel}: ${footer.phone}`}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-button hover:bg-button/10 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </svg>
        </a>

        {/* Next — chevron points left (RTL "next"). Disabled on last page. */}
        <button
          type="button"
          onClick={goNext}
          disabled={isLast}
          aria-label="הבא"
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-button text-cream hover:bg-button/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
