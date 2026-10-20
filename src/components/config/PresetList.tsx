import { ChevronRight } from 'lucide-react';
import {
  LEVELS, OBJECTIVES, PRESET_EQUIPMENT_LABELS, PresetCategory, PresetSession, RACE_SESSIONS, TARGETED_HINT, TARGETED_INTRO,
  TARGETED_SESSIONS, categoryLabel, presetEquipment,
} from '../../sessions';
import { EXERCISE_DATABASE } from '../../exercises';
import { HOME, pagePath } from '../../pages';
import { inApp } from '../../lib/links';
import { BackLink } from '../BackLink';
import { visibleArticles } from '../../articles';
import { SHOW_DRAFTS } from '../articles/ArticlePages';

const chip = 'px-2.5 py-0.5 rounded-full bg-ink/10 text-[13px] font-semibold';

// Home of the ready-made sessions: one row per race distance, then the targeted sessions, then
// the exercises.
export function PresetCategories({ onOpen, onOpenExercises, onOpenArticles }: {
  onOpen: (category: PresetCategory) => void;
  onOpenExercises: () => void;
  onOpenArticles: () => void;
}) {
  const articles = visibleArticles(SHOW_DRAFTS);
  const base = import.meta.env.BASE_URL;
  const categoryRow = (category: PresetCategory, label: string, hint: string, count: number) => ({
    id: `category-${category}`,
    href: pagePath({ kind: 'category', category }, base),
    open: () => onOpen(category),
    label, hint, count: `${count} séances`,
  });
  const rows = [
    ...OBJECTIVES.map(o => categoryRow(o.id, o.label, o.hint, RACE_SESSIONS.filter(p => p.objective === o.id).length)),
    categoryRow('ciblees', categoryLabel('ciblees'), TARGETED_HINT, TARGETED_SESSIONS.length),
    {
      id: 'exercises-link', href: pagePath({ kind: 'exercises' }, base), open: onOpenExercises,
      label: 'Les exercices', hint: 'Chaque mouvement expliqué et animé.', count: `${EXERCISE_DATABASE.length} fiches`,
    },
    ...(articles.length > 0 ? [{
      id: 'articles-link', href: pagePath({ kind: 'articles' }, base), open: onOpenArticles,
      label: 'Les articles', hint: 'Le renfo raconté par un coureur, chiffres à l\'appui.', count: `${articles.length} article${articles.length > 1 ? 's' : ''}`,
    }] : []),
  ];
  return (
    <div id="preset-list" className="relative flex flex-col gap-2.5">
      <h2 className="font-display font-extrabold text-[26px] leading-tight">Tu prépares quoi ?</h2>
      <ul className="flex flex-col gap-2.5">
        {rows.map((row, i) => (
          <li key={row.id} className={i >= OBJECTIVES.length ? 'mt-3' : ''}>
            <a
              id={row.id}
              href={row.href}
              onClick={inApp(row.open)}
              className="w-full bg-cream text-ink rounded-[18px] px-4 py-3.5 flex items-center gap-3 text-left cursor-pointer active:scale-[0.99] transition-transform"
            >
              <span className="flex-1 flex flex-col gap-0.5">
                <span className="font-display font-bold text-[22px] leading-tight">{row.label}</span>
                <span className="text-[15px] leading-snug text-clay">{row.hint}</span>
              </span>
              <span className="text-sm font-semibold text-clay shrink-0">{row.count}</span>
              <ChevronRight className="w-5 h-5 shrink-0 text-clay" aria-hidden="true" />
            </a>
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
            {(equipment.length > 0 ? equipment.map(eq => PRESET_EQUIPMENT_LABELS[eq]) : ['Sans matériel']).map(label => (
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
      <BackLink href={pagePath(HOME, import.meta.env.BASE_URL)} label="Séances prédéfinies" onBack={onBack} />
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
