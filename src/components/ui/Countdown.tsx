import { useEffect, useState } from 'react';
import { tripDate } from '../../content/copy.he';

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diffToParts(targetMs: number): Parts | null {
  const delta = targetMs - Date.now();
  if (delta <= 0) return null;
  const totalSeconds = Math.floor(delta / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const targetMs = new Date(tripDate.iso).getTime();

export default function Countdown() {
  const [parts, setParts] = useState<Parts | null>(() => diffToParts(targetMs));

  useEffect(() => {
    const id = setInterval(() => setParts(diffToParts(targetMs)), 1000);
    return () => clearInterval(id);
  }, []);

  if (!parts) {
    return (
      <p className="text-base sm:text-lg text-ivory/90 mb-10">
        {tripDate.afterFlightMessage}
      </p>
    );
  }

  const cells: Array<[number, string]> = [
    [parts.days, tripDate.labels.days],
    [parts.hours, tripDate.labels.hours],
    [parts.minutes, tripDate.labels.minutes],
    [parts.seconds, tripDate.labels.seconds],
  ];

  return (
    <div
      // dir="ltr" so the boxes lay out days→seconds regardless of RTL parent
      dir="ltr"
      className="mx-auto mb-10 grid max-w-md grid-cols-4 gap-2 sm:gap-3"
    >
      {cells.map(([n, label]) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center rounded-2xl bg-cream/95 px-2 py-3 sm:py-4 shadow-card ring-1 ring-ink-deep/10"
        >
          <span className="text-2xl sm:text-4xl font-extrabold text-ink-deep tabular-nums leading-none">
            {String(n).padStart(2, '0')}
          </span>
          <span className="mt-1.5 text-[10px] sm:text-xs uppercase tracking-widest text-ink-deep/60">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
