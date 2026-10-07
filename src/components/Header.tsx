import { Volume2, VolumeX } from 'lucide-react';
import { Logo } from './Logo';

export type AppTab = 'workout' | 'guide';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  soundOn: boolean;
  onOpenSound: () => void;
}

export function Header({ activeTab, onTabChange, soundOn, onOpenSound }: HeaderProps) {
  return (
    <header className="relative flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Logo size={42} />
        <div className="flex flex-col">
          <span className="font-display font-extrabold text-[23px] leading-tight tracking-tight">Coriace</span>
          <span className="text-[13px] leading-tight text-sand min-[350px]:whitespace-nowrap">Le renfo pour les coureurs</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          id="tab-guide"
          onClick={() => onTabChange(activeTab === 'guide' ? 'workout' : 'guide')}
          className="h-11 px-2 font-semibold text-[15px] cursor-pointer hover:underline underline-offset-4"
        >
          {activeTab === 'guide' ? 'Séance' : 'Guide'}
        </button>
        <button
          id="btn-toggle-sound"
          onClick={onOpenSound}
          aria-label="Réglages du son"
          className={`w-11 h-11 rounded-full flex items-center justify-center ${soundOn ? 'border-[1.5px] border-white/55' : 'bg-ink/40'} cursor-pointer`}
        >
          {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
