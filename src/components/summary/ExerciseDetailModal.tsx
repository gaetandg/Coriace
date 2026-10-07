import { X } from 'lucide-react';
import { Exercise } from '../../types';

const EQUIPMENT_LABELS: Record<Exercise['equipmentRequired'][number], string> = {
  chaise: 'Chaise',
  poids_8kg: 'Poids 8 kg',
  corde_a_sauter: 'Corde à sauter',
};

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
}

// Bottom sheet with the full instructions for one exercise.
export function ExerciseDetailModal({ exercise, onClose }: ExerciseDetailModalProps) {
  const equipment = exercise.equipmentRequired.length > 0
    ? exercise.equipmentRequired.map(eq => EQUIPMENT_LABELS[eq])
    : ['Sans matériel'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-detail-title"
        className="relative w-full max-w-md max-h-[88dvh] overflow-y-auto bg-cream text-ink rounded-t-3xl px-6 pt-6 pb-8 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la fiche"
          className="absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center hover:bg-ink/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-1.5 pr-10">
          <span className="text-sm font-semibold text-clay">{exercise.target}</span>
          <h2 id="exercise-detail-title" className="font-display font-extrabold text-[30px] leading-tight tracking-tight">{exercise.name}</h2>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {equipment.map(label => (
              <span key={label} className="px-3 py-1 rounded-full bg-ink/10 text-[13px] font-semibold">{label}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-clay">Mouvement</h3>
          <p className="text-base leading-relaxed">{exercise.description}</p>
        </div>

        {exercise.tips && (
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-clay">Conseil</h3>
            <p className="text-base leading-relaxed">{exercise.tips}</p>
          </div>
        )}

        {exercise.instructionHighlight && (
          <div className="rounded-2xl bg-brick text-white px-4 py-3.5 flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold text-sand">À retenir</h3>
            <p className="text-base font-semibold">{exercise.instructionHighlight}</p>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="h-14 rounded-[18px] bg-ink text-cream font-display font-extrabold text-lg cursor-pointer"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
