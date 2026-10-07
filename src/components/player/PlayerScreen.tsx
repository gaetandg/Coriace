import { WorkoutInterval } from '../../types';
import { WorkoutSession } from '../../hooks/useWorkoutSession';
import { LaneArcs } from '../Logo';
import { CurrentIntervalCard } from './CurrentIntervalCard';
import { NextUpPanel } from './NextUpPanel';
import { PlayerControls } from './PlayerControls';
import { SessionProgress } from './SessionProgress';
import { StepList } from './StepList';

const STAGE_LABELS: Record<WorkoutInterval['stage'], string> = {
  warmup: 'Échauffement',
  main: 'Circuit',
  finisher: 'Finisher',
  cooldown: 'Retour au calme',
};

interface PlayerScreenProps {
  session: WorkoutSession;
  activeInterval: WorkoutInterval;
  isBreak: boolean;
}

export function PlayerScreen({ session, activeInterval, isBreak }: PlayerScreenProps) {
  const {
    intervals,
    currentIntervalIndex,
    secondsRemaining,
    isPlaying,
    progressMetrics,
    blockSteps,
    activeBlockTotalRounds,
    nextUp,
    resetWorkout,
    handlePrevInterval,
    togglePlayPause,
    handleNextInterval,
    handleJumpToBlock,
  } = session;

  const hasTwoBlocks = intervals.some(i => i.blockNumber === 2);
  const stageLabel = activeInterval.stage === 'main' && hasTwoBlocks
    ? `Bloc ${activeInterval.blockNumber === 2 ? 'B' : 'A'}`
    : STAGE_LABELS[activeInterval.stage];

  return (
    <div id="panel-player" className="flex-1 flex flex-col gap-6">
      <LaneArcs className="w-[300px] top-[150px] -right-[150px] opacity-[0.22]" />

      <div className="relative flex items-center gap-2.5 font-semibold text-[15px]">
        <span className="bg-cream text-ink px-3 py-1.5 rounded-full">{stageLabel}</span>
        {activeInterval.roundNumber && (
          <span className="text-sand">Tour {activeInterval.roundNumber} sur {activeBlockTotalRounds || 2}</span>
        )}
        <button id="btn-quit-session" onClick={resetWorkout} className="ml-auto h-11 px-1 text-sand underline underline-offset-4 cursor-pointer">
          Quitter
        </button>
      </div>

      <CurrentIntervalCard interval={activeInterval} secondsRemaining={secondsRemaining} playing={isPlaying} />

      {nextUp && <NextUpPanel nextUp={nextUp} detailed={isBreak} playing={isPlaying} />}

      <div className="mt-auto flex flex-col gap-6">
        <PlayerControls
          isPlaying={isPlaying}
          canGoBack={currentIntervalIndex > 0}
          groundClassName={isBreak ? 'text-grass' : 'text-brick'}
          onPrev={handlePrevInterval}
          onTogglePlay={togglePlayPause}
          onNext={handleNextInterval}
        />

        <SessionProgress
          totalBlocks={Math.round(intervals.length / 2)}
          blockIndex={activeInterval.blockIndex}
          elapsedSeconds={progressMetrics.elapsedSeconds}
          totalSeconds={progressMetrics.totalSeconds}
          percentage={progressMetrics.percentage}
        />

        <StepList steps={blockSteps} activeBlockIndex={activeInterval.blockIndex} onJump={handleJumpToBlock} />
      </div>
    </div>
  );
}
