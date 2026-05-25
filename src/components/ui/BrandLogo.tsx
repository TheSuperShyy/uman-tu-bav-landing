import { editorial } from '../../content/media';

// Centered logo strip — used at the top of every section so the brand
// is visually owned by each "page" instead of floating over content.
// Clicking the logo scrolls the user back to the very top.
export default function BrandLogo() {
  return (
    <div className="w-full flex items-center justify-center pt-1 pb-0 sm:pt-2">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="חזרה לראש הדף"
        className="bg-transparent border-0 p-0 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <img
          src={editorial.logo}
          alt="אור הצדיק"
          className="block h-48 w-48 sm:h-56 sm:w-56 lg:h-64 lg:w-64"
          loading="lazy"
          decoding="async"
        />
      </button>
    </div>
  );
}
