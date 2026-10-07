interface SessionProgressProps {
  totalBlocks: number;
  blockIndex: number;
  secondsRemaining: number;
}

// Global progress across the one-minute blocks of the session.
export function SessionProgress({ totalBlocks, blockIndex, secondsRemaining }: SessionProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] sm:text-xs text-white/50 px-1 font-bold tracking-wider uppercase">
        <span>Progression</span>
        <span className="font-mono text-[#FF6321] text-xs font-bold">Minute {blockIndex + 1} / {totalBlocks}</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-[#FF6321] to-red-500 transition-all duration-350"
          style={{ width: `${((blockIndex + (secondsRemaining === 0 ? 1 : 0)) / totalBlocks) * 100}%` }}
        />
      </div>
    </div>
  );
}
