import { useEffect, useRef } from 'react';
import type { FormulaId } from '../../sessionFormulas';

interface FormulaPickerProps {
  options: { id: FormulaId; label: string; hint: string }[];
  selected: FormulaId;
  onChange: (formula: FormulaId) => void;
}

// A row of formulas that scrolls sideways, the chosen one in cream, its description below.
export function FormulaPicker({ options, selected, onChange }: FormulaPickerProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  // Opening on a formula further right (Mollets, Cardio…) brings it into view.
  useEffect(() => {
    const row = rowRef.current;
    const chip = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (row && chip) row.scrollLeft = chip.offsetLeft - row.offsetLeft - 20;
    // Only on opening: later taps are on chips already in view.
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={rowRef}
        id="formula-picker"
        className="-mx-5 px-5 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {options.map(option => {
          const isSelected = option.id === selected;
          return (
            <button
              key={option.id}
              id={`formula-${option.id}`}
              aria-pressed={isSelected}
              onClick={() => onChange(option.id)}
              className={`shrink-0 h-10 px-4 rounded-full font-semibold text-[15px] border-[1.5px] cursor-pointer transition-colors ${
                isSelected ? 'bg-cream text-ink border-cream' : 'border-white/55 text-white hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p id="formula-hint" className="text-sm text-sand">{options.find(o => o.id === selected)?.hint}</p>
    </div>
  );
}
