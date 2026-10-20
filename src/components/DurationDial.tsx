// A clock face filled for the session's minutes, out of an hour: a quarter for 15 min, half for
// 30, three quarters for 45. Tells the durations apart at a glance.
export function DurationDial({ minutes, className = '' }: { minutes: number; className?: string }) {
  const fraction = Math.min(Math.max(minutes / 60, 0), 1);
  const angle = fraction * 2 * Math.PI;
  const r = 9;
  const x = 12 + r * Math.sin(angle);
  const y = 12 - r * Math.cos(angle);
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {fraction >= 1
        ? <circle cx="12" cy="12" r={r} fill="currentColor" />
        : fraction > 0 && <path d={`M12 12 L12 ${12 - r} A${r} ${r} 0 ${fraction > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`} fill="currentColor" />}
    </svg>
  );
}
