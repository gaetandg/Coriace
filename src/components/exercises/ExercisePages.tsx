import { ChevronRight } from 'lucide-react';
import { EXERCISE_DATABASE } from '../../exercises';
import { EXERCISE_GROUPS } from '../../lib/groups';
import { inApp } from '../../lib/links';
import { EXERCISES_PAGE, HOME, pagePath } from '../../pages';
import { PresetCategory, categoriesWithExercise, categoryLabel } from '../../sessions';
import { Exercise } from '../../types';
import { BackLink } from '../BackLink';
import { ExerciseThumb } from '../ExerciseThumb';
import { ExerciseDetail } from './ExerciseDetail';

const base = import.meta.env.BASE_URL;

function ExerciseRow({ exercise, onOpen }: { exercise: Exercise; onOpen: (exerciseId: string) => void }) {
  return (
    <li className="border-b border-white/20">
      <a
        href={pagePath({ kind: 'exercise', exerciseId: exercise.id }, base)}
        onClick={inApp(() => onOpen(exercise.id))}
        className="py-3 flex items-center gap-3.5 cursor-pointer"
      >
        <ExerciseThumb exerciseId={exercise.id} className="w-[60px] h-12" />
        <span className="flex-1 flex flex-col">
          <span className="font-semibold text-base">{exercise.name}</span>
          <span className="text-sm text-sand">{exercise.target}</span>
        </span>
        <ChevronRight className="w-5 h-5 shrink-0 text-sand" aria-hidden="true" />
      </a>
    </li>
  );
}

// Every exercise, by group, each leading to its page.
export function ExerciseList({ onBack, onOpen }: { onBack: () => void; onOpen: (exerciseId: string) => void }) {
  return (
    <div id="exercise-list-page" className="flex-1 flex flex-col gap-5">
      <BackLink href={pagePath(HOME, base)} label="Accueil" onBack={onBack} />
      <h1 className="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">Les exercices</h1>
      <p className="text-base leading-snug">{EXERCISES_PAGE.intro}</p>
      {EXERCISE_GROUPS.map(group => {
        const exercises = EXERCISE_DATABASE.filter(ex => ex.group === group.id);
        if (exercises.length === 0) return null;
        return (
          <section key={group.id} className="flex flex-col">
            <h2 className="font-display font-bold text-lg pb-1 border-b border-white/30">{group.label}</h2>
            <ul className="flex flex-col">
              {exercises.map(ex => <ExerciseRow key={ex.id} exercise={ex} onOpen={onOpen} />)}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// One exercise: its sheet, the pages of sessions that use it and the other exercises of its group.
export function ExercisePage({ exerciseId, onBack, onOpen, onOpenCategory }: {
  exerciseId: string;
  onBack: () => void;
  onOpen: (exerciseId: string) => void;
  onOpenCategory: (category: PresetCategory) => void;
}) {
  const exercise = EXERCISE_DATABASE.find(ex => ex.id === exerciseId)!;
  const used = categoriesWithExercise(exercise.id);
  const sameGroup = EXERCISE_DATABASE.filter(ex => ex.group === exercise.group && ex.id !== exercise.id);
  const group = EXERCISE_GROUPS.find(g => g.id === exercise.group)!;

  return (
    <div id="exercise-page" className="flex-1 flex flex-col gap-5">
      <BackLink href={pagePath({ kind: 'exercises' }, base)} label="Tous les exercices" onBack={onBack} />
      <article className="bg-cream text-ink rounded-3xl px-6 pt-6 pb-7 flex flex-col gap-5 *:shrink-0">
        <ExerciseDetail exercise={exercise} heading="h1" />
      </article>

      {used.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <h2 className="font-display font-extrabold text-[26px] leading-tight">Dans les séances</h2>
          <ul className="flex flex-col gap-2.5">
            {used.map(({ category, count }) => (
              <li key={category}>
                <a
                  href={pagePath({ kind: 'category', category }, base)}
                  onClick={inApp(() => onOpenCategory(category))}
                  className="w-full bg-cream text-ink rounded-[18px] px-4 py-3.5 flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform"
                >
                  <span className="flex-1 font-display font-bold text-[22px] leading-tight">{categoryLabel(category)}</span>
                  <span className="text-sm font-semibold text-clay shrink-0">{count} séance{count > 1 ? 's' : ''}</span>
                  <ChevronRight className="w-5 h-5 shrink-0 text-clay" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {sameGroup.length > 0 && (
        <section className="flex flex-col">
          <h2 className="font-display font-extrabold text-[26px] leading-tight pb-1 border-b border-white/30">{group.label}</h2>
          <ul className="flex flex-col">
            {sameGroup.map(ex => <ExerciseRow key={ex.id} exercise={ex} onOpen={onOpen} />)}
          </ul>
        </section>
      )}
    </div>
  );
}
