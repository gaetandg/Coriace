import { TriangleAlert } from 'lucide-react';
import { Exercise } from '../../types';
import { EQUIPMENT_LABELS } from '../../lib/groups';
import { ExerciseAnimation, hasAnimation } from '../ExerciseAnimation';

// The full instructions for one exercise, on a cream surface: in the bottom sheet and on the
// exercise's own page.
export function ExerciseDetail({ exercise, heading: Heading, headingId }: {
  exercise: Exercise;
  heading: 'h1' | 'h2';
  headingId?: string;
}) {
  const equipment = exercise.equipmentRequired.length > 0
    ? exercise.equipmentRequired.map(eq => EQUIPMENT_LABELS[eq])
    : ['Sans matériel'];
  const Sub = Heading === 'h1' ? 'h2' : 'h3';

  return (
    <>
      <div className="flex flex-col gap-1.5 pr-10">
        <span className="text-sm font-semibold text-clay">{exercise.target}</span>
        <Heading id={headingId} className="font-display font-extrabold text-[30px] leading-tight tracking-tight">{exercise.name}</Heading>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {equipment.map(label => (
            <span key={label} className="px-3 py-1 rounded-full bg-ink/10 text-[13px] font-semibold">{label}</span>
          ))}
        </div>
      </div>

      {hasAnimation(exercise.id) && (
        <div className="-mx-2 flex justify-center">
          <ExerciseAnimation exerciseId={exercise.id} className="block w-full max-w-[320px]" />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <Sub className="text-sm font-semibold text-clay">Mouvement</Sub>
        <p className="text-base leading-relaxed">{exercise.description}</p>
      </div>

      {exercise.muscles && (
        <div className="flex flex-col gap-1">
          <Sub className="text-sm font-semibold text-clay">Muscles sollicités</Sub>
          <p className="text-base leading-relaxed">{exercise.muscles}</p>
        </div>
      )}

      {exercise.tips && (
        <div className="flex flex-col gap-1">
          <Sub className="text-sm font-semibold text-clay">Conseil</Sub>
          <p className="text-base leading-relaxed">{exercise.tips}</p>
        </div>
      )}

      {(exercise.easier || exercise.harder) && (
        <div className="grid grid-cols-2 gap-2">
          {[
            { title: 'Plus facile', text: exercise.easier },
            { title: 'Plus dur', text: exercise.harder },
          ].filter(level => level.text).map(level => (
            <div key={level.title} className="rounded-2xl bg-ink/[0.06] px-3.5 py-3 flex flex-col gap-0.5">
              <Sub className="text-sm font-semibold text-clay">{level.title}</Sub>
              <p className="text-[15px] leading-snug">{level.text}</p>
            </div>
          ))}
        </div>
      )}

      {exercise.caution && (
        <p className="flex gap-2.5 text-[15px] leading-snug">
          <TriangleAlert className="w-5 h-5 shrink-0 text-clay" aria-label="Attention" />
          {exercise.caution}
        </p>
      )}

      {exercise.instructionHighlight && (
        <div className="rounded-2xl bg-brick text-white px-4 py-3.5 flex flex-col gap-0.5">
          <Sub className="text-sm font-semibold text-sand">À retenir</Sub>
          <p className="text-base font-semibold">{exercise.instructionHighlight}</p>
        </div>
      )}
    </>
  );
}
