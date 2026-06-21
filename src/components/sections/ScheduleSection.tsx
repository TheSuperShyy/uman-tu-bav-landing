import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Container from '../layout/Container';
import Reveal from '../motion/Reveal';
import BrandLogo from '../ui/BrandLogo';
import CallPill from '../ui/CallPill';
import { editorial } from '../../content/media';
import { schedule } from '../../content/copy.he';

const TEXT_SHADOW = '0 2px 6px rgba(0,0,0,0.7)';

type Entry = { readonly time: string; readonly text: string };
type Day = (typeof schedule.days)[number];

// A single timetable row. Time pinned to the start (right in RTL) so it
// reads first; description fills the rest. Empty `time` → italic ✦ note.
function EntryRow({ time, text }: Entry) {
  return (
    <li className="flex items-baseline gap-3 text-sm sm:text-base text-ivory/90 text-pretty">
      {time ? (
        <bdi className="flex-none w-12 text-start font-bold text-gold tabular-nums">{time}</bdi>
      ) : (
        <span aria-hidden className="flex-none w-12 text-center text-gold/80">✦</span>
      )}
      <span className={`min-w-0 flex-1 text-start ${time ? '' : 'italic text-ivory/80'}`}>{text}</span>
    </li>
  );
}

// One day panel — kept light: small header, inline date, tight rows.
function DayCard({ day }: { day: Day }) {
  return (
    <div className="rounded-2xl bg-ink-night/45 p-4 ring-1 ring-ivory/10 backdrop-blur-sm">
      <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-ivory/10 pb-2.5">
        <h3 className="text-base sm:text-lg font-bold text-gold">
          {day.day} · {day.hebrewDate}
        </h3>
        <bdi className="flex-none text-[11px] tabular-nums text-ivory/50">{day.gregorianDate}</bdi>
      </div>
      <ul className="space-y-2">
        {day.entries.map((e, j) => (
          <EntryRow key={j} time={e.time} text={e.text} />
        ))}
      </ul>
    </div>
  );
}

// Full day-by-day trip schedule over the golden-hour Uman-spring photo.
// Sits between Gallery and Payment. Parallax photo + dark scrim; the
// schedule lives in translucent panels so timed text stays legible.
export default function ScheduleSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.03, 1.08]);

  // Two chronological columns: right = first half, left = second half.
  // Each column packs its own days tightly (no ragged grid gaps) while
  // reading right-column-then-left stays in date order.
  const mid = Math.ceil(schedule.days.length / 2);
  const columns = [schedule.days.slice(0, mid), schedule.days.slice(mid)];

  return (
    <section
      ref={ref}
      data-header-theme="dark"
      className="relative isolate overflow-hidden text-ivory flex flex-col"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{ y: reduced ? 0 : y, scale: reduced ? 1.03 : scale }}
      >
        <img
          src={editorial.scheduleBackdrop}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-night/85 via-ink-night/88 to-ink-night/95"
      />

      <BrandLogo />

      <Container className="relative w-full py-10 sm:py-14">
        <div className="text-center mb-10">
          <Reveal>
            <p
              style={{ textShadow: TEXT_SHADOW }}
              className="text-xs sm:text-sm tracking-[0.32em] uppercase text-gold mb-3"
            >
              {schedule.besd}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{ textShadow: TEXT_SHADOW }}
              className="text-2xl sm:text-4xl font-extrabold text-balance text-ivory"
            >
              {schedule.title}
            </h2>
          </Reveal>
        </div>

        <Reveal className="mx-auto grid max-w-3xl items-start gap-4 sm:gap-5 md:grid-cols-2">
          {columns.map((col, c) => (
            <div key={c} className="flex flex-col gap-4 sm:gap-5">
              {col.map((day) => (
                <DayCard key={day.gregorianDate} day={day} />
              ))}
            </div>
          ))}
        </Reveal>

        <Reveal className="mx-auto mt-4 max-w-3xl sm:mt-5">
          <div className="rounded-2xl bg-ink-night/45 p-4 ring-1 ring-gold/25 backdrop-blur-sm">
            <h3 className="mb-3 border-b border-ivory/10 pb-2.5 text-base sm:text-lg font-bold text-gold">
              {schedule.returnFlightTitle}
            </h3>
            <ul className="space-y-2">
              {schedule.returnFlight.map((e, j) => (
                <EntryRow key={j} time={e.time} text={e.text} />
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs sm:text-sm italic text-ivory/70">
            {schedule.note}
          </p>
        </Reveal>
      </Container>

      <CallPill theme="dark" />
    </section>
  );
}
