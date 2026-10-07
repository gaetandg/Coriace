import { useState } from 'react';
import { WeekStats } from '../../lib/stats';
import { plural } from '../../lib/format';

const shortDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });

// Recommended pace during a marathon build-up.
const TARGET = 2;

// Sessions per week as columns; tap a column to read its week.
export function WeeklyChart({ weeks }: { weeks: WeekStats[] }) {
  const current = weeks.length - 1;
  const [selected, setSelected] = useState(current);
  const max = Math.max(TARGET + 1, ...weeks.map(w => w.count));
  const ticks = Array.from({ length: max + 1 }, (_, i) => i).filter(i => max <= 5 || i % 2 === 0);
  const week = weeks[selected];
  const weekLabel = selected === current ? 'Cette semaine' : `Semaine du ${shortDate.format(week.start)}`;

  return (
    <section className="bg-cream text-ink rounded-[18px] px-4 pt-4 pb-3.5 flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-display font-bold text-lg leading-tight">Séances par semaine</h2>
        <p className="text-sm text-clay" aria-live="polite">
          {weekLabel} : {week.count === 0 ? 'aucune séance' : `${plural(week.count, 'séance')}, ${week.minutes} min`}
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative w-3 h-32 text-[11px] text-clay" aria-hidden="true">
          {ticks.map(t => (
            <span key={t} className="absolute right-0 leading-none translate-y-1/2" style={{ bottom: `${(t / max) * 100}%` }}>
              {t}
            </span>
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="relative h-32" onMouseLeave={() => setSelected(current)}>
            {ticks.map(t => (
              <div
                key={t}
                className={`absolute inset-x-0 h-px ${t === TARGET ? 'bg-clay/60' : 'bg-cream-line'}`}
                style={{ bottom: `${(t / max) * 100}%` }}
              />
            ))}
            <div className="absolute inset-0 flex">
              {weeks.map((w, i) => (
                <button
                  key={w.start.getTime()}
                  onClick={() => setSelected(i)}
                  onMouseEnter={() => setSelected(i)}
                  aria-label={`Semaine du ${shortDate.format(w.start)} : ${plural(w.count, 'séance')}`}
                  aria-pressed={i === selected}
                  className="flex-1 h-full flex items-end justify-center cursor-pointer"
                >
                  {w.count > 0 && (
                    <span
                      className={`block w-[60%] max-w-6 rounded-t-[4px] transition-colors ${i === selected ? 'bg-ink' : 'bg-brick'}`}
                      style={{ height: `${(w.count / max) * 100}%` }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-[11px] text-clay">
            <span>{shortDate.format(weeks[0].start)}</span>
            <span>cette semaine</span>
          </div>
        </div>
      </div>

      <p className="flex items-center gap-2 text-[13px] text-clay">
        <span className="w-4 h-px bg-clay/60" aria-hidden="true" />
        {TARGET} par semaine, le rythme conseillé en préparation
      </p>
    </section>
  );
}
