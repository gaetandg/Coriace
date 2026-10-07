import { WorkoutInterval } from '../../types';
import { getBodyPart } from '../../workoutGenerator';
import { bodyPartEmoji } from '../../lib/bodyPart';
import { formatTime } from '../../lib/format';
import { TransitionCard } from './TransitionCard';

interface CurrentIntervalCardProps {
  interval: WorkoutInterval;
  secondsRemaining: number;
  totalRounds: number;
  elapsedSeconds: number;
  totalSeconds: number;
}

// Timer ring, current exercise and coaching tip.
export function CurrentIntervalCard({ interval, secondsRemaining, totalRounds, elapsedSeconds, totalSeconds }: CurrentIntervalCardProps) {
  const isTransition = interval.isRoundTransition || interval.isBlockTransition;
  const phaseTextColor = isTransition ? 'text-amber-400' : interval.type === 'work' ? 'text-[#FF6321]' : 'text-emerald-400';
  const progress = 1 - secondsRemaining / interval.duration;
  const rounds = totalRounds || 2;

  return (
    <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 sm:p-10 md:p-12 shadow-2xl overflow-hidden flex flex-col items-center text-center">
      {/* Visual pulsating background lights representing target */}
      <div className={`absolute inset-0 filter blur-3xl pointer-events-none transition-all duration-700 opacity-20 ${
        isTransition
          ? 'bg-amber-500/25'
          : interval.type === 'work'
          ? 'bg-[#FF6321]/15'
          : 'bg-emerald-500/15'
      }`} />

      <div className="relative z-10 w-full space-y-4 sm:space-y-6">
        {/* Timer Circular visualizer svg */}
        <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto flex items-center justify-center font-sans">
          <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
            {/* Gray track background */}
            <circle
              className="text-white/5"
              strokeWidth="5"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
            {/* Vibrant dynamic stroke */}
            <circle
              className={`transition-all duration-100 ease-linear ${phaseTextColor}`}
              strokeWidth="5"
              strokeDasharray="263.89"
              strokeDashoffset={263.89 * progress}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
          </svg>

          {/* Timer content label */}
          <div className="text-center space-y-0.5 sm:space-y-1 relative">
            {interval.roundNumber && (
              <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest block font-mono leading-none pb-0.5">
                ROUND {interval.roundNumber}/{rounds}
              </span>
            )}
            <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] block transition ${phaseTextColor}`}>
              {isTransition ? 'Transition' : interval.type === 'work' ? 'Travail' : 'Récupération'}
            </span>
            <span className="text-3xl sm:text-5xl md:text-6xl font-display font-black leading-none tracking-tighter text-[#FF6321] block">
              {secondsRemaining < 10 ? `00:0${secondsRemaining}` : `00:${secondsRemaining}`}
            </span>
            <span className="text-[9px] sm:text-[10px] text-white/40 font-mono block uppercase tracking-wider">
              TEMPS {formatTime(elapsedSeconds)} / {formatTime(totalSeconds)}
            </span>
          </div>
        </div>

        {/* Present Exercise Details */}
        <div className="space-y-2 sm:space-y-4 max-w-xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-3.5 py-1 bg-[#FF6321]/15 border border-[#FF6321]/30 text-[#FF6321] text-[9px] sm:text-[10px] font-bold uppercase rounded-full tracking-wider font-mono">
              Cible : {interval.target}
            </span>
            {interval.exercise && (() => {
              const bPart = getBodyPart(interval.exercise);
              return (
                <span className="px-3.5 py-1 bg-white/5 border border-white/10 text-white/85 text-[9px] sm:text-[10px] font-bold uppercase rounded-full tracking-wider font-mono flex items-center gap-1">
                  {bodyPartEmoji(bPart)} {bPart.toUpperCase()}
                </span>
              );
            })()}
          </div>
          <h3 className="text-xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight leading-none uppercase">
            {interval.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/75 font-sans max-w-xl mx-auto leading-relaxed pb-1">
            {interval.description}
          </p>

          {interval.isRoundTransition && interval.roundTransitionFrom && interval.roundTransitionTo && (
            <TransitionCard
              progress={progress}
              headerLeft={`Rond ${interval.roundTransitionFrom} / ${rounds} Terminé`}
              headerRight={`Rond ${interval.roundTransitionTo} / ${rounds} Suivant`}
              fromLabel={`ROND ${interval.roundTransitionFrom}`}
              toLabel={`ROND ${interval.roundTransitionTo}`}
              caption="Changement de Round"
              headerClassName="text-amber-400"
              captionClassName="text-amber-400/95"
              nextClassName="bg-[#FF6321]/15 border border-[#FF6321]/30 text-[#FF6321]"
            />
          )}

          {interval.isBlockTransition && (
            <TransitionCard
              progress={progress}
              headerLeft="Bloc A Terminé"
              headerRight="Bloc B Suivant"
              fromLabel="BLOC A"
              toLabel="BLOC B"
              caption="Changement de Bloc (+30s)"
              headerClassName="text-orange-400"
              captionClassName="text-orange-400"
              nextClassName="bg-orange-400/15 border border-orange-400/30 text-orange-400"
            />
          )}
        </div>

        {/* Coach insight advice box if effort is active */}
        {interval.exercise && (
          <div className="hidden sm:flex bg-white/5 border border-white/10 rounded-xl p-4 text-left max-w-xl mx-auto items-start gap-4">
            <span className="text-xl shrink-0">💡</span>
            <div className="space-y-0.5">
              <span className="font-bold text-xs uppercase tracking-wider text-white">Conseil de Prévention</span>
              <p className="text-xs text-white/60 leading-relaxed font-sans">
                {interval.exercise.tips}
              </p>
              <span className="inline-block text-[10px] text-[#FF6321] font-mono uppercase tracking-widest font-bold pt-1">
                ↳ {interval.exercise.instructionHighlight}
              </span>
            </div>
          </div>
        )}

        {/* Simple encouragement tip during rest stages */}
        {!interval.exercise && (
          <div className="hidden sm:flex bg-white/5 border border-white/10 rounded-xl p-4 text-left max-w-xl mx-auto items-start gap-4">
            <span className="text-xl shrink-0">💧</span>
            <div className="space-y-0.5">
              <span className="font-bold text-xs uppercase tracking-wider text-white font-sans">Hydratation & Relâchement</span>
              <p className="text-xs text-white/60 leading-relaxed font-sans">
                Profitez du temps imparti pour relâcher vos muscles et décrisper vos trapèzes. Inspirez profondément pour oxygéner vos fibres.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
