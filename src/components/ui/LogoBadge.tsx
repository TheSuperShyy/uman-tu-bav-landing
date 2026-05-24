import { editorial } from '../../content/media';

export default function LogoBadge() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="חזרה לראש הדף"
      className="fixed top-3 start-3 sm:top-5 sm:start-5 z-50 bg-transparent border-0 p-0 cursor-pointer"
    >
      <img
        src={editorial.logo}
        alt="אור הצדיק"
        className="block h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
        loading="eager"
        decoding="async"
      />
    </button>
  );
}
