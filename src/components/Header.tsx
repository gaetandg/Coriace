import { UserRound, Volume2, VolumeX } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  soundOn: boolean;
  onOpenSound: () => void;
  // null when accounts aren't available; otherwise the initial of the signed-in runner, or '' when signed out.
  accountInitial: string | null;
  onOpenAccount: () => void;
}

export function Header({ soundOn, onOpenSound, accountInitial, onOpenAccount }: HeaderProps) {
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
          id="btn-toggle-sound"
          onClick={onOpenSound}
          aria-label="Réglages du son"
          className={`w-11 h-11 rounded-full flex items-center justify-center ${soundOn ? 'border-[1.5px] border-white/55' : 'bg-ink/40'} cursor-pointer`}
        >
          {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        {accountInitial !== null && (
          <button
            id="btn-account"
            onClick={onOpenAccount}
            aria-label="Compte"
            className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer ${accountInitial ? 'bg-cream text-ink font-display font-extrabold text-lg' : 'border-[1.5px] border-white/55'}`}
          >
            {accountInitial || <UserRound className="w-5 h-5" />}
          </button>
        )}
      </div>
    </header>
  );
}
