import { Volume2, VolumeX } from 'lucide-react';

export type AppTab = 'workout' | 'guide';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function Header({ activeTab, onTabChange, soundEnabled, onToggleSound }: HeaderProps) {
  const tabClassName = (tab: AppTab) =>
    `py-1 transition-all relative cursor-pointer ${
      activeTab === tab
        ? 'text-[#FF6321] font-bold border-b-2 border-[#FF6321]'
        : 'text-white/50 hover:text-white border-b-2 border-transparent'
    }`;

  return (
    <header className="border-b border-white/10 bg-[#050505]/95 backdrop-blur-md sticky top-0 z-50 py-5 px-6 sm:px-8">
      <div id="app-header" className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF6321] rounded-full flex items-center justify-center shrink-0">
            <div className="w-4 h-4 bg-white rotate-45"></div>
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-display font-black tracking-tighter uppercase text-white flex items-center gap-1.5">
              Marathon PPG Coach
            </h1>
            <span className="text-[10px] text-white/50 tracking-widest font-black uppercase block">
              Renforcement musculaire
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6 text-xs font-semibold uppercase tracking-[0.15em]">
            <button id="tab-workout" onClick={() => onTabChange('workout')} className={tabClassName('workout')}>
              Séance
            </button>
            <button id="tab-guide" onClick={() => onTabChange('guide')} className={tabClassName('guide')}>
              Guide
            </button>
          </div>

          {/* Mute button */}
          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            title={soundEnabled ? "Couper le son" : "Activer le son"}
            className={`p-2.5 rounded-full border transition-all ${
              soundEnabled
                ? 'bg-white/5 border-white/10 hover:border-white/30 text-white/85 hover:text-white'
                : 'bg-red-500/10 border-red-500/30 text-red-400 hover:text-red-350'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
