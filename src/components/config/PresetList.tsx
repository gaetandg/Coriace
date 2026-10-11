import { ArrowLeft, ChevronRight } from 'lucide-react';
import {
  LEVELS, OBJECTIVES, PresetCategory, PresetSession, RACE_SESSIONS, TARGETED_INTRO, TARGETED_SESSIONS, presetEquipment,
} from '../../sessions';

// The weight can always be done without: the loaded exercises are then swapped.
const EQUIPMENT_LABELS = { chaise: 'Chaise', poids_8kg: 'Poids facultatif', corde_a_sauter: 'Corde à sauter' } as const;

export const categoryLabel = (category: PresetCategory) =>
  category === 'ciblees' ? 'Séances ciblées' : OBJECTIVES.find(o => o.id === category)!.label;

const chip = 'px-2.5 py-0.5 rounded-full bg-ink/10 text-[13px] font-semibold';

// Home of the ready-made sessions: one row per race distance, then the targeted sessions.
export function PresetCategories({ onOpen }: { onOpen: (category: PresetCategory) => void }) {
  const rows: { id: PresetCategory; label: string; hint: string; count: number }[] = [
    ...OBJECTIVES.map(o => ({ id: o.id, label: o.label, hint: o.hint, count: RACE_SESSIONS.filter(p => p.objective === o.id).length })),
    { id: 'ciblees', label: 'Séances ciblées', hint: 'Une zone précise : mollets, gainage, genoux…', count: TARGETED_SESSIONS.length },
  ];
  return (
    <div id="preset-list" className="relative flex flex-col gap-2.5">
      <h2 className="font-display font-extrabold text-[26px] leading-tight">Tu prépares quoi ?</h2>
      <ul className="flex flex-col gap-2.5">
        {rows.map((row, i) => (
          <li key={row.id} className={i === OBJECTIVES.length ? 'mt-3' : ''}>
            <button
              id={`category-${row.id}`}
              onClick={() => onOpen(row.id)}
              className="w-full bg-cream text-ink rounded-[18px] px-4 py-3.5 flex items-center gap-3 text-left cursor-pointer active:scale-[0.99] transition-transform"
            >
              <span className="flex-1 flex flex-col gap-0.5">
                <span className="font-display font-bold text-[22px] leading-tight">{row.label}</span>
                <span className="text-[15px] leading-snug text-clay">{row.hint}</span>
              </span>
              <span className="text-sm font-semibold text-clay shrink-0">{row.count} séances</span>
              <ChevronRight className="w-5 h-5 shrink-0 text-clay" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PresetCard({ preset, onStart }: { preset: PresetSession; onStart: (preset: PresetSession) => void }) {
  const equipment = presetEquipment(preset);
  return (
    <li>
      <button
        id={`preset-${preset.id}`}
        onClick={() => onStart(preset)}
        className="w-full bg-cream text-ink rounded-[18px] px-4 py-3.5 flex items-center gap-3 text-left cursor-pointer active:scale-[0.99] transition-transform"
      >
        <span className="flex-1 flex flex-col gap-1">
          <span className="flex items-baseline justify-between gap-3">
            <span className="font-display font-bold text-[21px] leading-tight">{preset.formula ?? preset.name}</span>
            <span className="font-display font-extrabold text-[17px] shrink-0">{preset.durationMinutes} min</span>
          </span>
          <span className="text-[15px] leading-snug text-clay">{preset.description}</span>
          <span className="flex flex-wrap gap-1.5 pt-1">
            {(equipment.length > 0 ? equipment.map(eq => EQUIPMENT_LABELS[eq]) : ['Sans matériel']).map(label => (
              <span key={label} className={chip}>{label}</span>
            ))}
          </span>
        </span>
        <ChevronRight className="w-5 h-5 shrink-0 text-clay" aria-hidden="true" />
      </button>
    </li>
  );
}

// The sessions of one page, with what they are for: a race distance's sessions by level, or the
// targeted sessions. Tapping one opens it.
export function PresetCategoryPage({ category, onBack, onStart }: {
  category: PresetCategory;
  onBack: () => void;
  onStart: (preset: PresetSession) => void;
}) {
  const intro = category === 'ciblees' ? TARGETED_INTRO : OBJECTIVES.find(o => o.id === category)!.intro;
  const list = (sessions: PresetSession[]) => (
    <ul className="flex flex-col gap-2.5">
      {sessions.map(preset => <PresetCard key={preset.id} preset={preset} onStart={onStart} />)}
    </ul>
  );
  return (
    <div id="preset-category" className="flex-1 flex flex-col gap-5">
      <button onClick={onBack} className="-ml-2.5 self-start h-11 pr-3 flex items-center gap-2 text-sand font-semibold text-[15px] cursor-pointer">
        <ArrowLeft className="w-[22px] h-[22px] text-white" />
        Séances prédéfinies
      </button>
      <h1 className="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">{categoryLabel(category)}</h1>
      <p className="text-base leading-snug">{intro}</p>
      {category !== 'ciblees' && (
        <p id="category-count" className="text-base font-semibold">
          {RACE_SESSIONS.filter(p => p.objective === category).length} séances, en trois durées : 20, 30 et 45 minutes.
        </p>
      )}
      {category === 'ciblees'
        ? list(TARGETED_SESSIONS)
        : LEVELS.map(level => (
          <section key={level.id} id={`level-${level.id}`} className="flex flex-col gap-2.5 mt-2">
            <div className="flex flex-col gap-0.5">
              <h2 className="font-display font-extrabold text-[26px] leading-tight">{level.heading}</h2>
              <p className="text-sm text-sand">{level.hint}</p>
            </div>
            {list(RACE_SESSIONS.filter(p => p.objective === category && p.level === level.id))}
          </section>
        ))}
    </div>
  );
}
