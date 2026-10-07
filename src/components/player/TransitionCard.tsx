interface TransitionCardProps {
  progress: number; // 0 to 1
  headerLeft: string;
  headerRight: string;
  fromLabel: string;
  toLabel: string;
  caption: string;
  headerClassName: string;
  captionClassName: string;
  nextClassName: string; // "next" pill colors
}

// Animated "A done → B next" banner shown during round and block transitions.
export function TransitionCard({ progress, headerLeft, headerRight, fromLabel, toLabel, caption, headerClassName, captionClassName, nextClassName }: TransitionCardProps) {
  return (
    <div className="max-w-md mx-auto bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 sm:p-5 mt-4 space-y-3 shadow-xl">
      <div className={`flex items-center justify-between text-[10px] font-bold font-mono tracking-widest ${headerClassName} uppercase`}>
        <span>{headerLeft}</span>
        <span>{headerRight}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-lg flex flex-col items-center justify-center shrink-0 min-w-[64px]">
          <span className="text-[8px] uppercase tracking-wide opacity-75">{fromLabel}</span>
          <span className="text-xs font-bold leading-none mt-1">Acquis ✓</span>
        </div>

        <div className="flex-1 space-y-1 text-center">
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-[#FF6321] transition-all duration-300 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className={`text-[9px] ${captionClassName} font-bold block font-mono uppercase tracking-wider`}>{caption}</span>
        </div>

        <div className={`px-3 py-1.5 ${nextClassName} rounded-lg flex flex-col items-center justify-center shrink-0 min-w-[64px] animate-pulse`}>
          <span className="text-[8px] uppercase tracking-wide opacity-75">{toLabel}</span>
          <span className="text-xs font-bold leading-none mt-1">Suivant ➔</span>
        </div>
      </div>
    </div>
  );
}
