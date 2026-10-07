import { ArrowLeft, Check } from 'lucide-react';
import { EXERCISE_DATABASE } from '../../exercises';
import { WorkoutSession } from '../../hooks/useWorkoutSession';
import { primaryButton } from '../../lib/ui';

interface ExercisePickerProps {
  session: WorkoutSession;
  onBack: () => void;
}

// Choose which of the exercises compatible with the equipment can be drawn.
export function ExercisePicker({ session, onBack }: ExercisePickerProps) {
  const { config, compatibleExercises, previewExercises, toggleExerciseSelection, handleSelectAllExercises } = session;
  const selectedIds = config.selectedExerciseIds || EXERCISE_DATABASE.map(e => e.id);

  return (
    <div id="panel-exercises" className="flex-1 flex flex-col gap-5">
      <button onClick={onBack} className="-ml-2.5 self-start h-11 pr-3 flex items-center gap-2 text-sand font-semibold text-[15px] cursor-pointer">
        <ArrowLeft className="w-[22px] h-[22px] text-white" />
        Réglages
      </button>

      <div className="flex flex-col gap-2">
        <h1 className="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">Exercices</h1>
        <p className="text-sand text-[15px]">
          {previewExercises.length} sur {compatibleExercises.length} avec ton matériel.
        </p>
      </div>

      <div className="flex gap-4 text-[15px] font-semibold">
        <button onClick={() => handleSelectAllExercises(true)} className="h-11 underline underline-offset-4 cursor-pointer">Tout cocher</button>
        <button onClick={() => handleSelectAllExercises(false)} className="h-11 underline underline-offset-4 cursor-pointer">Tout décocher</button>
      </div>

      <ul className="flex flex-col">
        {compatibleExercises.map(ex => {
          const isSelected = selectedIds.includes(ex.id);
          return (
            <li key={ex.id} className="border-b border-white/25">
              <button
                aria-pressed={isSelected}
                onClick={() => toggleExerciseSelection(ex.id)}
                className="w-full py-3.5 flex items-start gap-3.5 text-left cursor-pointer"
              >
                <span className={`mt-0.5 w-6 h-6 rounded-md shrink-0 flex items-center justify-center ${isSelected ? 'bg-cream text-ink' : 'border-[1.5px] border-white/55'}`}>
                  {isSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className={`font-semibold text-base ${isSelected ? '' : 'text-sand'}`}>{ex.name}</span>
                  <span className="text-sm text-sand">{ex.target}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-0 mt-auto -mx-5 px-5 pt-3 pb-1 bg-brick">
        <button onClick={onBack} className={`w-full ${primaryButton}`}>Valider</button>
      </div>
    </div>
  );
}
