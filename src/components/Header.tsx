import { Volume2, VolumeX } from 'lucide-react';
import { Logo } from './Logo';

export type AppTab = 'workout' | 'guide';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function Header({ activeTab, onTabChange, soundEnabled, onToggleSound }: HeaderProps) {
  return (
    <header className="relative flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Logo />
        <span className="font-display font-extrabold text-[23px] tracking-tight">Coriace</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          id="tab-guide"
          onClick={() => onTabChange(activeTab === 'guide' ? 'workout' : 'guide')}
          className="h-11 px-3 font-semibold text-[15px] cursor-pointer hover:underline underline-offset-4"
        >
          {activeTab === 'guide' ? 'Séance' : 'Guide'}
        </button>
        <button
          id="btn-toggle-sound"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Couper le son' : 'Activer le son'}
          className={`w-11 h-11 rounded-full flex items-center justify-center ${soundEnabled ? 'border-[1.5px] border-white/55' : 'bg-ink/40'} cursor-pointer`}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
