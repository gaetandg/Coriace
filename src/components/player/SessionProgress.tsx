import { formatTime } from '../../lib/format';

interface SessionProgressProps {
  totalBlocks: number;
  blockIndex: number;
  elapsedSeconds: number;
  totalSeconds: number;
  percentage: number;
}

// Progress across the whole session, drawn as a lane between two lines.
export function SessionProgress({ totalBlocks, blockIndex, elapsedSeconds, totalSeconds, percentage }: SessionProgressProps) {
  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex justify-between text-sm font-medium text-sand">
        <span>Minute {blockIndex + 1} sur {totalBlocks}</span>
        <span>{formatTime(elapsedSeconds)} / {formatTime(totalSeconds)}</span>
      </div>
      <div className="flex flex-col gap-1" aria-hidden="true">
        <div className="h-0.5 bg-white/30" />
        <div className="h-1.5 rounded-full bg-white/30 overflow-hidden">
          <div className="h-full bg-white transition-[width] duration-1000 ease-linear" style={{ width: `${percentage}%` }} />
        </div>
        <div className="h-0.5 bg-white/30" />
      </div>
    </div>
  );
}
