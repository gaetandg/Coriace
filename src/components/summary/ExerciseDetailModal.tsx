import { X } from 'lucide-react';
import { Exercise } from '../../types';
import { getBodyPart } from '../../workoutGenerator';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
}

export function ExerciseDetailModal({ exercise, onClose }: ExerciseDetailModalProps) {
  const bodyPart = getBodyPart(exercise);

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#121212] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button top right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 bg-[#FF6321]/15 border border-[#FF6321]/30 text-[#FF6321] text-[10px] font-bold uppercase rounded-md tracking-wider font-mono">
              {exercise.target}
            </span>
            <span className="px-3 py-0.5 bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold uppercase rounded-md tracking-wider font-mono">
              {bodyPart === 'bras' ? '💪 Bras' : bodyPart === 'abdos' ? '🧘 Abdos' : '🦵 Jambes'}
            </span>
            {exercise.equipmentRequired.length > 0 ? (
              exercise.equipmentRequired.map(eq => (
                <span key={eq} className="px-3 py-0.5 bg-orange-400/15 border border-orange-400/30 text-orange-400 text-[10px] font-bold uppercase rounded-md tracking-wider font-mono">
                  🛠️ {eq === 'poids_8kg' ? 'Poids 8kg' : eq === 'chaise' ? 'Chaise' : eq === 'corde_a_sauter' ? 'Corde à sauter' : eq}
                </span>
              ))
            ) : (
              <span className="px-3 py-0.5 bg-emerald-400/15 border border-emerald-400/30 text-emerald-400 text-[10px] font-bold uppercase rounded-md tracking-wider font-mono">
                🍃 Poids de corps
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight leading-tight uppercase pr-8">
            {exercise.name}
          </h3>
        </div>

        <div className="border-t border-white/10 pt-4 space-y-4 text-left">
          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold font-mono">Description du mouvement</h4>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
              {exercise.description}
            </p>
          </div>

          {/* Tips */}
          {exercise.tips && (
            <div className="bg-white/3 border border-white/5 rounded-2xl p-4 space-y-1.5">
              <h4 className="text-[10px] uppercase tracking-widest text-[#FF6321] font-extrabold font-mono flex items-center gap-1.5">
                <span>💡</span> Conseils d'exécution
              </h4>
              <p className="text-xs text-white/85 leading-relaxed font-sans">
                {exercise.tips}
              </p>
            </div>
          )}

          {/* Instruction Highlight */}
          {exercise.instructionHighlight && (
            <div className="bg-[#FF6321]/5 border border-[#FF6321]/25 rounded-2xl p-4 space-y-1">
              <h4 className="text-[10px] uppercase tracking-widest text-[#FF6321] font-bold font-mono flex items-center gap-1.5">
                <span>🚨</span> Consigne d'or
              </h4>
              <p className="text-xs text-[#FF6321] font-bold leading-relaxed font-mono">
                {exercise.instructionHighlight}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[#FF6321] hover:bg-[#FF6321]/90 text-black font-extrabold py-3 rounded-xl transition-all uppercase tracking-widest text-xs cursor-pointer focus:outline-none"
        >
          Compris, fermer
        </button>
      </div>
    </div>
  );
}
