// Shared class names for the Piste look.

export const primaryButton =
  'h-15 rounded-[18px] bg-cream text-ink font-display font-extrabold text-[19px] flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] transition-transform';

export const outlineButton =
  'border-[1.5px] border-white/55 text-white font-semibold cursor-pointer hover:bg-white/10 transition-colors';

export const sectionLabel = 'text-sm font-semibold text-sand';

// Two- or three-option switch, e.g. rhythm or session mode; add the grid-cols-N class.
export const segmentedTrack = 'grid gap-1 p-1 rounded-2xl bg-ink/35';
export const segmentedOption = (selected: boolean) =>
  `rounded-xl cursor-pointer transition-colors ${selected ? 'bg-cream text-ink' : 'text-white hover:bg-white/10'}`;
