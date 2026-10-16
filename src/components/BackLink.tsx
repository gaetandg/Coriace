import { ArrowLeft } from 'lucide-react';
import { inApp } from '../lib/links';

// "← Previous page", at the top of a page: a link to its address, opened inside the app.
export function BackLink({ href, label, onBack }: { href: string; label: string; onBack: () => void }) {
  return (
    <a href={href} onClick={inApp(onBack)} className="-ml-2.5 self-start h-11 pr-3 flex items-center gap-2 text-sand font-semibold text-[15px] cursor-pointer">
      <ArrowLeft className="w-[22px] h-[22px] text-white" />
      {label}
    </a>
  );
}
