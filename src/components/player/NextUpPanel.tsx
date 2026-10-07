import { ChevronRight } from 'lucide-react';
import { WorkoutInterval } from '../../types';

interface NextUpPanelProps {
  nextUp: WorkoutInterval;
  // During rest and transitions the panel is highlighted so the runner can get ready.
  highlighted: boolean;
}

export function NextUpPanel({ nextUp, highlighted }: NextUpPanelProps) {
  return (
    <div id="pnl-next-up" className={`border rounded-xl p-3.5 md:p-4 text-left transition duration-300 ${
      highlighted
        ? 'bg-[#FF6321]/5 border-[#FF6321]/20 shadow-md shadow-[#FF6321]/5'
        : 'bg-white/5 border border-white/10 hover:border-[#FF6321]/30'
    }`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1 pr-4">
          <span className="text-white/40 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest block font-sans">
            {highlighted ? '🚀 Prochaine Étape (À anticiper)' : 'Prochaine Étape'}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display font-bold text-xs sm:text-sm text-white uppercase tracking-tight">{nextUp.title}</span>
            <span className="px-2.5 py-0.5 bg-[#FF6321]/15 border border-[#FF6321]/30 text-[#FF6321] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded-full font-mono">{nextUp.target}</span>
          </div>

          {/* Rich Anticipation Detail */}
          {nextUp.exercise && (
            <div className="mt-2.5 space-y-1.5 text-xs text-white/70 font-sans border-t border-white/10 pt-2.5">
              <p className="leading-relaxed">
                <span className="font-semibold text-white/90">Cible & But :</span> {nextUp.exercise.description}
              </p>
              {nextUp.exercise.tips && (
                <p className="text-white/50 text-[11px] leading-relaxed italic flex items-start gap-1">
                  <span className="shrink-0 text-orange-400">💡</span>
                  <span>{nextUp.exercise.tips}</span>
                </p>
              )}
              {nextUp.exercise.instructionHighlight && (
                <p className="text-[#FF6321]/90 text-[11px] font-mono font-bold leading-relaxed flex items-start gap-1">
                  <span className="shrink-0">🚨</span>
                  <span>Consigne : {nextUp.exercise.instructionHighlight}</span>
                </p>
              )}
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-[#FF6321] shrink-0 mt-0.5" />
      </div>
    </div>
  );
}
