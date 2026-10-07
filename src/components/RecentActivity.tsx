import { ChevronRight } from 'lucide-react';
import { plural } from '../lib/format';

interface RecentActivityProps {
  count: number; // sessions in the last 7 days
  onOpen: () => void;
}

// Recent activity on the home screen; opens the stats.
export function RecentActivity({ count, onOpen }: RecentActivityProps) {
  return (
    <button
      id="btn-recent-stats"
      onClick={onOpen}
      className="relative w-full flex items-center justify-between gap-3 py-3 border-y border-white/30 text-left cursor-pointer"
    >
      <span className="font-semibold text-[15px]">
        {count === 0 ? 'Aucune séance' : plural(count, 'séance')}
        <span className="font-normal text-sand"> les 7 derniers jours</span>
      </span>
      <span className="flex items-center gap-1 text-sm text-sand">
        Stats
        <ChevronRight className="w-[18px] h-[18px]" />
      </span>
    </button>
  );
}
