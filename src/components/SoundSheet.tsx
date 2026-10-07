import { SoundSettings } from '../hooks/useWorkoutSession';

interface SoundSheetProps {
  sound: SoundSettings;
  speechSupported: boolean;
  onChange: (key: keyof SoundSettings, value: boolean) => void;
  onTest: () => void;
  onClose: () => void;
}

const OPTIONS: { key: keyof SoundSettings; label: string; description: string }[] = [
  { key: 'beeps', label: 'Bips', description: 'À chaque changement et sur les 3 dernières secondes d\'un exercice.' },
  { key: 'voice', label: 'Voix', description: 'Annonce le prochain exercice pendant les pauses et compte « 3, 2, 1 » avant de repartir.' },
];

// Bottom sheet with the sound switches.
export function SoundSheet({ sound, speechSupported, onChange, onTest, onClose }: SoundSheetProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sound-title"
        className="w-full max-w-md bg-cream text-ink rounded-t-3xl px-6 pt-6 pb-8 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="sound-title" className="font-display font-extrabold text-[30px] leading-tight">Son</h2>

        <div className="flex flex-col">
          {OPTIONS.map(option => {
            const unavailable = option.key === 'voice' && !speechSupported;
            const checked = sound[option.key] && !unavailable;
            return (
              <button
                key={option.key}
                id={`switch-${option.key}`}
                role="switch"
                aria-checked={checked}
                disabled={unavailable}
                onClick={() => onChange(option.key, !sound[option.key])}
                className="py-3.5 border-b border-cream-line flex items-center gap-4 text-left cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="flex-1 flex flex-col gap-0.5">
                  <span className="font-semibold text-lg">{option.label}</span>
                  <span className="text-sm text-clay">
                    {unavailable ? 'Ton navigateur ne propose pas de voix.' : option.description}
                  </span>
                </span>
                <span className={`w-13 h-8 rounded-full p-1 shrink-0 transition-colors ${checked ? 'bg-brick' : 'bg-ink/20'}`}>
                  <span className={`block w-6 h-6 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`} />
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onTest}
            disabled={!sound.beeps && !(sound.voice && speechSupported)}
            className="h-14 px-5 rounded-[18px] border-[1.5px] border-ink/40 font-semibold cursor-pointer disabled:opacity-40"
          >
            Tester
          </button>
          <button onClick={onClose} className="flex-1 h-14 rounded-[18px] bg-ink text-cream font-display font-extrabold text-lg cursor-pointer">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
