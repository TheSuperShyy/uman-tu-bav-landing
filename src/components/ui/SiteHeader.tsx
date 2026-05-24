import { useEffect, useState } from 'react';
import { editorial } from '../../content/media';
import { footer } from '../../content/copy.he';

// Sticky transparent chrome — logo floats at the top, call-pill floats
// at the bottom. The pill restyles each time it crosses a section
// boundary so it always reads against the background it's sitting on.
// Section components emit a `data-header-theme="dark"|"light"` attribute
// (the Section primitive derives it from its `bg` prop; full-bleed photo
// sections — Hero, CinematicMoment, VideoMoment, etc. — set it manually).
type Theme = 'dark' | 'light';

const PILL_BOTTOM_OFFSET = 80; // approx px above viewport bottom where the pill sits

const STYLES: Record<Theme, { bg: string; border: string; color: string }> = {
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
};

export default function SiteHeader() {
  // Start dark — the hero is the first thing rendered and it's dark.
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Pick whichever themed element currently spans the line just
    // above the viewport bottom (where the pill sits). Reading
    // getBoundingClientRect on every scroll is cheap; sections are
    // big rectangles and there are ~15 of them.
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-header-theme]'));

    function pick() {
      const probe = window.innerHeight - PILL_BOTTOM_OFFSET;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          const t = el.dataset.headerTheme;
          if (t === 'dark' || t === 'light') {
            setTheme(t);
            return;
          }
        }
      }
    }

    pick();
    window.addEventListener('scroll', pick, { passive: true });
    window.addEventListener('resize', pick, { passive: true });
    return () => {
      window.removeEventListener('scroll', pick);
      window.removeEventListener('resize', pick);
    };
  }, []);

  const s = STYLES[theme];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-center py-1.5 sm:py-2 pointer-events-none">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="חזרה לראש הדף"
          className="pointer-events-auto bg-transparent border-0 p-0 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img
            src={editorial.logo}
            alt="אור הצדיק"
            className="block h-32 w-32 sm:h-36 sm:w-36 lg:h-40 lg:w-40"
            loading="eager"
            decoding="async"
          />
        </button>
      </header>

      <div className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-center pb-4 sm:pb-5 pointer-events-none">
        <a
          href={`tel:${footer.phone.replace(/-/g, '')}`}
          style={{
            backgroundColor: s.bg,
            borderColor: s.border,
            color: s.color,
            transition: 'background-color 0.35s ease, border-color 0.35s ease, color 0.35s ease',
          }}
          className="pointer-events-auto group inline-flex items-center gap-2 sm:gap-2.5 rounded-full border px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold tracking-wide hover:scale-[1.02] backdrop-blur-sm"
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
    </>
  );
}
