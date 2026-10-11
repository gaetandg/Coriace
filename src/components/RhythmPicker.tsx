import { WorkoutConfig } from '../types';
import { RHYTHMS } from '../lib/rhythm';
import { sectionLabel, segmentedOption, segmentedTrack } from '../lib/ui';

type Rhythm = WorkoutConfig['rythme'];
const OPTIONS: Rhythm[] = ['doux', 'equilibre', 'intense'];

// Seconds of work and rest: three choices, the chosen one explained below.
export function RhythmPicker({ value, onChange }: { value: Rhythm; onChange: (rythme: Rhythm) => void }) {
  return (
    <div className="relative flex flex-col gap-2.5">
      <span className={sectionLabel}>Rythme</span>
      <div className={`${segmentedTrack} grid-cols-3`}>
        {OPTIONS.map(option => {
          const selected = value === option;
          return (
            <button
              key={option}
              id={`rad-rythme-${option}`}
              aria-pressed={selected}
              onClick={() => onChange(option)}
              className={`h-14 flex flex-col items-center justify-center ${segmentedOption(selected)}`}
            >
              <span className="font-display font-extrabold text-[17px] min-[360px]:text-xl leading-tight">{RHYTHMS[option].label}</span>
              <span className={`text-[13px] font-medium ${selected ? '' : 'text-sand'}`}>
                {RHYTHMS[option].work} s / {RHYTHMS[option].rest} s
              </span>
            </button>
          );
        })}
      </div>
      <p id="rythme-hint" className="text-sm text-sand">{RHYTHMS[value].hint}</p>
    </div>
  );
}
