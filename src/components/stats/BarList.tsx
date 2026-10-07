import { ReactNode } from 'react';

interface BarListProps {
  title: string;
  subtitle?: string;
  items: { label: string; value: number; valueLabel: string }[];
  footer?: ReactNode;
}

// Labelled horizontal bars on a cream card, value at the tip.
export function BarList({ title, subtitle, items, footer }: BarListProps) {
  const max = Math.max(1, ...items.map(i => i.value));
  return (
    <section className="bg-cream text-ink rounded-[18px] px-4 py-4 flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-display font-bold text-lg leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-clay">{subtitle}</p>}
      </div>
      <ul className="flex flex-col gap-2.5">
        {items.map(item => (
          <li key={item.label} className="grid grid-cols-[minmax(0,8.5rem)_1fr] items-center gap-3">
            <span className="text-[15px] font-semibold leading-tight">{item.label}</span>
            <span className="flex items-center gap-2">
              {item.value > 0 && <span className="h-2 rounded-r-[4px] bg-brick" style={{ width: `${(item.value / max) * 70}%` }} />}
              <span className="text-[13px] text-clay shrink-0">{item.valueLabel}</span>
            </span>
          </li>
        ))}
      </ul>
      {footer && <p className="text-[13px] text-clay leading-snug">{footer}</p>}
    </section>
  );
}
