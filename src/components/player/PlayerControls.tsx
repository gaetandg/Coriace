import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  canGoBack: boolean;
  groundClassName: string; // pause icon takes the ground color
  onPrev: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
}

const sideButton = 'w-14 h-14 rounded-full border-[1.5px] border-white/55 flex items-center justify-center cursor-pointer hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none';

export function PlayerControls({ isPlaying, canGoBack, groundClassName, onPrev, onTogglePlay, onNext }: PlayerControlsProps) {
  return (
    <div className="relative flex items-center justify-center gap-5">
      <button id="btn-player-prev" onClick={onPrev} disabled={!canGoBack} aria-label="Étape précédente" className={sideButton}>
        <ArrowLeft className="w-[22px] h-[22px]" />
      </button>

      <button
        id="btn-player-playpause"
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pause' : 'Reprendre'}
        className={`w-20 h-20 rounded-full bg-cream ${groundClassName} flex items-center justify-center cursor-pointer active:scale-95 transition-transform`}
      >
        {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
      </button>

      <button id="btn-player-next" onClick={onNext} aria-label="Étape suivante" className={sideButton}>
        <ArrowRight className="w-[22px] h-[22px]" />
      </button>
    </div>
  );
}
