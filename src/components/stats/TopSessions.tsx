
// Most completed sessions as horizontal bars, count at the tip.
export function TopSessions({ sessions }: { sessions: { name: string; count: number }[] }) {
  const max = Math.max(...sessions.map(s => s.count));
  return (
    <section className="bg-cream text-ink rounded-[18px] px-4 py-4 flex flex-col gap-3">
      <h2 className="font-display font-bold text-lg leading-tight">Séances les plus faites</h2>
      <ul className="flex flex-col gap-2.5">
        {sessions.map(s => (
          <li key={s.name} className="flex flex-col gap-1">
            <span className="text-[15px] font-semibold">{s.name}</span>
            <span className="flex items-center gap-2">
              <span className="h-2 rounded-r-[4px] bg-brick" style={{ width: `${(s.count / max) * 80}%` }} />
              <span className="text-[13px] text-clay shrink-0">{s.count} fois</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
