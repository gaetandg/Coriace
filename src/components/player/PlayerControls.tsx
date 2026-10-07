import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  canGoBack: boolean;
  onPrev: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
}

export function PlayerControls({ isPlaying, canGoBack, onPrev, onTogglePlay, onNext }: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-1">
      <button
        id="btn-player-prev"
        onClick={onPrev}
        disabled={!canGoBack}
        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <button
        id="btn-player-playpause"
        onClick={onTogglePlay}
        className="px-8 sm:px-12 h-12 rounded-full bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer font-sans"
      >
        {isPlaying ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-black" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Reprendre</span>
          </>
        )}
      </button>

      <button
        id="btn-player-next"
        onClick={onNext}
        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
