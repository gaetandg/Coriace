import { useEffect } from 'react';
import { X } from 'lucide-react';
import { track } from '../../lib/analytics';
import { Exercise } from '../../types';
import { useBackHandler } from '../../hooks/useBackHandler';
import { ExerciseDetail } from '../exercises/ExerciseDetail';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
}

// Bottom sheet with the full instructions for one exercise.
export function ExerciseDetailModal({ exercise, onClose }: ExerciseDetailModalProps) {
  useBackHandler(true, onClose);
  useEffect(() => { track('fiche-exercice', { exercice: exercise.id }); }, [exercise.id]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-detail-title"
        className="relative w-full max-w-md max-h-[88dvh] overflow-y-auto bg-cream text-ink rounded-t-3xl px-6 pt-6 pb-8 flex flex-col gap-5 *:shrink-0"
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

        <ExerciseDetail exercise={exercise} heading="h2" headingId="exercise-detail-title" />

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
