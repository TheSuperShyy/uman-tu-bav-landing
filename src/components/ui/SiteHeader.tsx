import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { editorial } from '../../content/media';
import { footer } from '../../content/copy.he';

// Sticky centered header. Starts transparent over the hero so the
// video backdrop reads cleanly, then fades to cream + blur once the
// user scrolls into content sections. Hooks (useScroll/useTransform)
// are always called; we only branch in the rendered style object so
// reduced-motion users get the solid state immediately.
export default function SiteHeader() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 240], ['rgba(255,252,249,0)', 'rgba(255,252,249,0.94)']);
  const border = useTransform(scrollY, [0, 240], ['rgba(107,69,50,0)', 'rgba(107,69,50,0.1)']);
  const blurPx = useTransform(scrollY, [0, 240], [0, 10]);
  const blur = useTransform(blurPx, (v) => `blur(${v}px)`);
  // Phone text color flips from ivory (over the dark hero) to ink-deep
  // (once on the cream-tinted background). Logo is gold so it reads
  // on both surfaces without a color shift.
  const phoneColor = useTransform(
    scrollY,
    [0, 240],
    ['rgba(250,246,238,0.95)', 'rgba(107,69,50,1)'],
  );

  return (
    <motion.header
      style={
        reduced
          ? {
              backgroundColor: 'rgba(255,252,249,0.94)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderBottomColor: 'rgba(107,69,50,0.1)',
            }
          : {
              backgroundColor: bg,
              backdropFilter: blur,
              WebkitBackdropFilter: blur,
              borderBottomColor: border,
            }
      }
      className="fixed top-0 inset-x-0 z-50 border-b flex flex-col items-center justify-center gap-1 py-2 sm:py-2.5"
    >
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="חזרה לראש הדף"
        className="bg-transparent border-0 p-0 cursor-pointer"
      >
        <img
          src={editorial.logo}
          alt="אור הצדיק"
          className="block h-12 w-12 sm:h-14 sm:w-14"
          loading="eager"
          decoding="async"
        />
      </button>
      <motion.a
        href={`tel:${footer.phone.replace(/-/g, '')}`}
        style={{
          color: reduced ? 'rgba(107,69,50,1)' : phoneColor,
          textShadow: '0 1px 3px rgba(0,0,0,0.35)',
        }}
        className="text-xs sm:text-sm font-semibold transition-colors hover:opacity-80"
      >
        {footer.phoneLabel}: <bdi>{footer.phone}</bdi>
      </motion.a>
    </motion.header>
  );
}
