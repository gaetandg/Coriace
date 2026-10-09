import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { LEVELS, OBJECTIVES, Objective, PresetSession, RACE_SESSIONS, TARGETED_SESSIONS, presetEquipment } from '../../sessions';
import { segmentedOption, segmentedTrack } from '../../lib/ui';

// The weight can always be done without: the loaded exercises are then swapped.
const EQUIPMENT_LABELS = { chaise: 'Chaise', poids_8kg: 'Poids facultatif', corde_a_sauter: 'Corde à sauter' } as const;
const OBJECTIVE_KEY = 'coriace:objective';

// The race distance last looked at, kept in this browser.
function loadObjective(): Objective {
  try {
    const stored = localStorage.getItem(OBJECTIVE_KEY);
    if (OBJECTIVES.some(o => o.id === stored)) return stored as Objective;
  } catch {
    // Storage unavailable: start from the first distance.
  }
  return OBJECTIVES[0].id;
}

interface PresetCardProps {
  preset: PresetSession;
  title: string;
  overline?: string; // the race distance, recalled above the level
  onStart: (preset: PresetSession) => void;
}

function PresetCard({ preset, title, overline, onStart }: PresetCardProps) {
  const equipment = presetEquipment(preset);
  return (
    <li>
      <button
        id={`preset-${preset.id}`}
        onClick={() => onStart(preset)}
        className="w-full bg-cream text-ink rounded-[18px] px-4 py-3.5 flex items-center gap-3 text-left cursor-pointer active:scale-[0.99] transition-transform"
      >
        <span className="flex-1 flex flex-col gap-1">
          {overline && <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-clay">{overline}</span>}
          <span className="flex items-baseline justify-between gap-3">
            <span className="font-display font-bold text-[21px] leading-tight">{title}</span>
            <span className="font-display font-extrabold text-[17px] shrink-0">{preset.durationMinutes} min</span>
          </span>
          <span className="text-[15px] leading-snug text-clay">{preset.description}</span>
          <span className="flex flex-wrap gap-1.5 pt-1">
            {(equipment.length > 0 ? equipment.map(eq => EQUIPMENT_LABELS[eq]) : ['Sans matériel']).map(label => (
              <span key={label} className="px-2.5 py-0.5 rounded-full bg-ink/10 text-[13px] font-semibold">{label}</span>
            ))}
          </span>
        </span>
        <ChevronRight className="w-5 h-5 shrink-0 text-clay" aria-hidden="true" />
      </button>
    </li>
  );
}

// Ready-made sessions: by race distance and level, then targeted ones. Tapping one opens its summary.
export function PresetList({ onStart }: { onStart: (preset: PresetSession) => void }) {
  const [objective, setObjective] = useState<Objective>(loadObjective);
  const choose = (id: Objective) => {
    setObjective(id);
    try { localStorage.setItem(OBJECTIVE_KEY, id); } catch { /* not kept, that's all */ }
  };
  const current = OBJECTIVES.find(o => o.id === objective)!;

  return (
    <div id="preset-list" className="relative flex flex-col gap-6">
      <section className="flex flex-col gap-2.5">
        <h2 className="font-display font-extrabold text-[26px] leading-tight">Tu prépares quoi ?</h2>
        <div className={`${segmentedTrack} grid-cols-4`}>
          {OBJECTIVES.map(o => (
            <button
              key={o.id}
              id={`objective-${o.id}`}
              aria-pressed={o.id === objective}
              onClick={() => choose(o.id)}
              className={`h-14 font-display font-extrabold text-[14px] tracking-tight min-[360px]:text-[16px] min-[400px]:text-[18px] ${segmentedOption(o.id === objective)}`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-sand">{current.hint}</p>
        <ul className="flex flex-col gap-2.5">
          {LEVELS.map(level => {
            const preset = RACE_SESSIONS.find(p => p.objective === objective && p.level === level.id);
            return preset ? <PresetCard key={preset.id} preset={preset} title={level.label} overline={current.label} onStart={onStart} /> : null;
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-2.5">
        <h2 className="font-display font-extrabold text-[26px] leading-tight">Séances ciblées</h2>
        <ul className="flex flex-col gap-2.5">
          {TARGETED_SESSIONS.map(preset => <PresetCard key={preset.id} preset={preset} title={preset.name} onStart={onStart} />)}
        </ul>
      </section>
    </div>
  );
}
