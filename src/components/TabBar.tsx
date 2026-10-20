import type { ComponentType } from 'react';
import { BookOpen, ChartColumn, Dumbbell } from 'lucide-react';
import { HOME, pagePath } from '../pages';
import { inApp } from '../lib/links';

export type TabBarTab = 'sessions' | 'articles' | 'stats';

// Height of the bar, also kept free under the page and under the screens' sticky buttons.
export const TAB_BAR_HEIGHT = '4rem';

const TABS: { id: TabBarTab; label: string; Icon: ComponentType<{ className?: string }>; href?: string }[] = [
  { id: 'sessions', label: 'Séances', Icon: Dumbbell, href: pagePath(HOME, import.meta.env.BASE_URL) },
  { id: 'articles', label: 'Articles', Icon: BookOpen, href: pagePath({ kind: 'articles' }, import.meta.env.BASE_URL) },
  { id: 'stats', label: 'Statistiques', Icon: ChartColumn },
];

// The app's main sections, at the bottom of the screen. Hidden during a session.
export function TabBar({ active, onSelect }: { active: TabBarTab; onSelect: (tab: TabBarTab) => void }) {
  return (
    <nav aria-label="Menu" className="fixed bottom-0 inset-x-0 z-40 bg-brick border-t border-white/20">
      <ul className="max-w-md mx-auto grid grid-cols-3" style={{ height: TAB_BAR_HEIGHT }}>
        {TABS.map(({ id, label, Icon, href }) => {
          const current = id === active;
          const content = (
            <>
              <span className={`px-4 py-1 rounded-full ${current ? 'bg-cream text-ink' : ''}`}>
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-[12px] font-semibold leading-none">{label}</span>
            </>
          );
          const className = `w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer ${current ? 'text-white' : 'text-sand'}`;
          return (
            <li key={id}>
              {href ? (
                <a id={`tab-${id}`} href={href} onClick={inApp(() => onSelect(id))} aria-current={current ? 'page' : undefined} className={className}>{content}</a>
              ) : (
                <button id={`tab-${id}`} onClick={() => onSelect(id)} aria-pressed={current} className={className}>{content}</button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
