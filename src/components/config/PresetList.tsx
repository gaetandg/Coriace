import { ChevronRight } from 'lucide-react';
import { PRESET_SESSIONS, PresetSession, presetEquipment } from '../../sessions';

const EQUIPMENT_LABELS = { chaise: 'Chaise', poids_8kg: 'Poids 4–10 kg', corde_a_sauter: 'Corde à sauter' } as const;

// Ready-made sessions; tapping one opens its summary.
export function PresetList({ onStart }: { onStart: (preset: PresetSession) => void }) {
  return (
    <ul id="preset-list" className="relative flex flex-col gap-2.5">
      {PRESET_SESSIONS.map(preset => {
        const equipment = presetEquipment(preset);
        return (
          <li key={preset.id}>
            <button
              onClick={() => onStart(preset)}
              className="w-full bg-cream text-ink rounded-[18px] px-4 py-3.5 flex items-center gap-3 text-left cursor-pointer active:scale-[0.99] transition-transform"
            >
              <span className="flex-1 flex flex-col gap-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-display font-bold text-[21px] leading-tight">{preset.name}</span>
                  <span className="font-display font-extrabold text-[17px] shrink-0">{preset.durationMinutes} min</span>
                </span>
                <span className="text-[15px] leading-snug text-clay">{preset.description}</span>
                <span className="flex flex-wrap gap-1.5 pt-1">
                  {(equipment.length > 0 ? equipment.map(eq => EQUIPMENT_LABELS[eq]) : ['Sans matériel']).map(label => (
                    <span key={label} className="px-2.5 py-0.5 rounded-full bg-ink/10 text-[13px] font-semibold">{label}</span>
                  ))}
                </span>
              </span>
              <ChevronRight className="w-5 h-5 shrink-0 text-clay" aria-hidden="true" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
