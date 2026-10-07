import { WorkoutInterval } from '../../types';
import { formatClock } from '../../lib/format';
import { ExerciseAnimation, hasAnimation } from '../ExerciseAnimation';

interface CurrentIntervalCardProps {
  interval: WorkoutInterval;
  secondsRemaining: number;
  playing: boolean;
}

// Big countdown and what to do right now.
export function CurrentIntervalCard({ interval, secondsRemaining, playing }: CurrentIntervalCardProps) {
  const progress = 1 - secondsRemaining / interval.duration;
  const phaseLabel = interval.isRoundTransition
    ? 'Changement de tour'
    : interval.isBlockTransition
    ? 'Changement de bloc'
    : interval.type === 'work'
    ? 'Effort'
    : 'Récupération';

  return (
    <div className="relative flex flex-col gap-5">
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-[17px] text-sand">{phaseLabel}</span>
        <span
          role="timer"
          aria-live="off"
          className="font-display font-extrabold text-[140px] leading-[0.9] tracking-[-0.05em] tabular-nums"
        >
          {formatClock(secondsRemaining)}
        </span>
        <div className="mt-2 h-1 rounded-full bg-white/25 overflow-hidden">
          <div className="h-full bg-white transition-[width] duration-1000 ease-linear" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {interval.exercise ? (
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display font-bold text-[34px] leading-[1.05] tracking-[-0.02em]">
            {interval.title}
          </h1>
          <span className="text-base text-sand">{interval.target}</span>
          {hasAnimation(interval.exercise.id) && (
            <div className="mt-3 bg-cream rounded-[18px] flex justify-center">
              <ExerciseAnimation exerciseId={interval.exercise.id} playing={playing} className="block w-full max-w-[250px]" />
            </div>
          )}
          <p className="mt-2 text-lg font-semibold leading-snug">{interval.exercise.instructionHighlight}</p>
          <p className="text-[15px] leading-relaxed text-sand">{interval.exercise.description}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display font-bold text-[34px] leading-[1.05] tracking-[-0.02em]">{interval.title}</h1>
          <p className="text-lg leading-snug text-sand">{interval.description}</p>
        </div>
      )}
    </div>
  );
}
