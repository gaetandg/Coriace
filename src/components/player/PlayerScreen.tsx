import { WorkoutInterval } from '../../types';
import { WorkoutSession } from '../../hooks/useWorkoutSession';
import { CurrentIntervalCard } from './CurrentIntervalCard';
import { NextUpPanel } from './NextUpPanel';
import { PlayerControls } from './PlayerControls';
import { SessionProgress } from './SessionProgress';
import { StepList } from './StepList';

interface PlayerScreenProps {
  session: WorkoutSession;
  activeInterval: WorkoutInterval;
}

export function PlayerScreen({ session, activeInterval }: PlayerScreenProps) {
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

  const isBreak = activeInterval.type === 'rest' || activeInterval.isRoundTransition || activeInterval.isBlockTransition;

  return (
    <div id="panel-player" className="space-y-4 md:space-y-6 animate-fade-in text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
        <button
          id="btn-quit-session"
          onClick={resetWorkout}
          className="text-xs text-white/50 hover:text-white flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/25 px-4 h-10 rounded-full transition-all cursor-pointer self-start font-sans"
        >
          Quitter la séance
        </button>

        <div className="flex items-center gap-2 sm:self-center">
          <span className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full border ${
            activeInterval.stage === 'warmup'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : activeInterval.stage === 'main'
              ? 'bg-[#FF6321]/10 text-[#FF6321] border-[#FF6321]/20'
              : 'bg-red-500/10 text-red-400 border-red-500/25'
          }`}>
            {activeInterval.stage === 'warmup' ? 'Échauffement' : activeInterval.stage === 'main' ? 'Circuit' : 'Finisher'}
          </span>

          {activeInterval.roundNumber && (
            <span className="text-[10px] sm:text-xs font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white/70">
              Tour {activeInterval.roundNumber}/{activeBlockTotalRounds || 2}
            </span>
          )}
        </div>
      </div>

      {/* TWO PANEL GRID (Left: Player / Right: Step Playlist Checklist) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT: Central Player card + controls */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <CurrentIntervalCard
            interval={activeInterval}
            secondsRemaining={secondsRemaining}
            totalRounds={activeBlockTotalRounds}
            elapsedSeconds={progressMetrics.elapsedSeconds}
            totalSeconds={progressMetrics.totalSeconds}
          />

          {nextUp && <NextUpPanel nextUp={nextUp} highlighted={!!isBreak} />}

          <PlayerControls
            isPlaying={isPlaying}
            canGoBack={currentIntervalIndex > 0}
            onPrev={handlePrevInterval}
            onTogglePlay={togglePlayPause}
            onNext={handleNextInterval}
          />

          <SessionProgress
            totalBlocks={Math.round(intervals.length / 2)}
            blockIndex={activeInterval.blockIndex}
            secondsRemaining={secondsRemaining}
          />
        </div>

        {/* RIGHT: ALL STEPS GROUP LIST INTERACTIVE PLAYLIST */}
        <StepList steps={blockSteps} activeBlockIndex={activeInterval.blockIndex} onJump={handleJumpToBlock} />
      </div>
    </div>
  );
}
