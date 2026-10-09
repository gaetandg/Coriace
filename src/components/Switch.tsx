// On/off row: a label, an explanation and the switch itself.
export function Switch({ id, checked, label, hint, onChange }: {
  id: string;
  checked: boolean;
  label: string;
  hint: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="py-2 flex items-center gap-4 text-left cursor-pointer"
    >
      <span className="flex-1 flex flex-col gap-0.5">
        <span className="font-semibold text-base">{label}</span>
        <span className="text-sm text-sand">{hint}</span>
      </span>
      <span className={`w-13 h-8 rounded-full p-1 shrink-0 transition-colors ${checked ? 'bg-cream' : 'bg-ink/35'}`}>
        <span className={`block w-6 h-6 rounded-full transition-transform ${checked ? 'translate-x-5 bg-brick' : 'bg-white/80'}`} />
      </span>
    </button>
  );
}
