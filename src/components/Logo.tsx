// Three running lanes curving into a C.
export function Logo({ size = 30, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M26.5 7.5A13 13 0 1 0 26.5 24.5" />
        <path d="M22.6 10.4A8.2 8.2 0 1 0 22.6 21.6" />
        <path d="M18.8 13.3A3.4 3.4 0 1 0 18.8 18.7" />
      </g>
    </svg>
  );
}

// Decorative lane lines in the background of a screen.
export function LaneArcs({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 300" aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <g fill="none" stroke="#FFFFFF" strokeWidth="2">
        <circle cx="150" cy="150" r="146" />
        <circle cx="150" cy="150" r="118" />
        <circle cx="150" cy="150" r="90" />
        <circle cx="150" cy="150" r="62" />
      </g>
    </svg>
  );
}
