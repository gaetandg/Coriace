import { bodyPartEmoji, exerciseBodyPart } from '../../lib/bodyPart';
import { BlockStep } from '../../lib/plan';

interface StepItemProps {
  step: BlockStep;
  labelPrefix: string;
  activeBlockIndex: number;
  onJump: (blockIndex: number) => void;
}

function StepItem({ step, labelPrefix, activeBlockIndex, onJump }: StepItemProps) {
  const isPassed = step.blockIndex < activeBlockIndex;
  const isActive = step.blockIndex === activeBlockIndex;

  // Icon mapping
  const bPart = exerciseBodyPart(step.exercise);

  let stateStyle = "border-white/5 bg-white/3 hover:bg-white/5 hover:border-white/10 text-white/60";
  let ringStyle = "";

  if (isActive) {
    if (step.stage === 'warmup') {
      stateStyle = "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
      ringStyle = "ring-1 ring-emerald-500";
    } else if (step.stage === 'finisher') {
      stateStyle = "border-red-500/40 bg-red-500/10 text-red-300";
      ringStyle = "ring-1 ring-red-500";
    } else {
      stateStyle = "border-[#FF6321]/40 bg-[#FF6321]/10 text-[#FF6321]";
      ringStyle = "ring-1 ring-[#FF6321]";
    }
  } else if (isPassed) {
    stateStyle = "border-white/5 bg-[#121212]/30 text-white/30";
  }

  // Label badge color
  let badgeStyle = "bg-white/10 text-white/50";
  if (isActive) {
    badgeStyle = step.stage === 'warmup'
      ? 'bg-emerald-500/20 text-emerald-400'
      : step.stage === 'finisher'
      ? 'bg-red-500/20 text-red-400'
      : 'bg-[#FF6321]/20 text-[#FF6321]';
  }

  return (
    <button
      type="button"
      onClick={() => onJump(step.blockIndex)}
      className={`w-full p-2.5 rounded-xl border flex items-center gap-2.5 text-xs text-left transition-all cursor-pointer ${stateStyle} ${ringStyle} focus:outline-none`}
    >
      {/* Num / status indicator */}
      {isPassed ? (
        <span className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-400 font-mono shrink-0">
          ✓
        </span>
      ) : (
        <span className={`w-5 h-5 rounded-md border flex items-center justify-center text-[9px] font-mono font-bold shrink-0 ${badgeStyle}`}>
          {labelPrefix}{step.blockIndex + 1}
        </span>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0 leading-snug">
        <div className="font-bold flex items-center justify-between gap-1.5">
          <span className={`truncate ${isActive ? 'text-white' : ''}`}>
            {step.title.replace('Échauffement : ', '')}
          </span>
          <span className="opacity-60 text-[10px]" title={bPart}>{bodyPartEmoji(bPart)}</span>
        </div>
        <div className="text-[10px] opacity-50 truncate mt-0.5">
          {step.target.split(' - ')[0]}
        </div>
      </div>

      {/* Active light indicator */}
      {isActive && (
        <span className="flex h-2 w-2 relative shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            step.stage === 'warmup' ? 'bg-emerald-400' : step.stage === 'finisher' ? 'bg-red-400' : 'bg-[#FF6321]'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            step.stage === 'warmup' ? 'bg-emerald-500' : step.stage === 'finisher' ? 'bg-red-500' : 'bg-[#FF6321]'
          }`}></span>
        </span>
      )}
    </button>
  );
}

interface StepListProps {
  steps: BlockStep[];
  activeBlockIndex: number;
  onJump: (blockIndex: number) => void;
}

// Clickable list of every step of the session, grouped by stage.
export function StepList({ steps, activeBlockIndex, onJump }: StepListProps) {
  const warmupSteps = steps.filter(s => s.stage === 'warmup');
  const mainSteps = steps.filter(s => s.stage === 'main');
  const finisherSteps = steps.filter(s => s.stage === 'finisher');

  const hasSeparateBlocks = mainSteps.some(s => s.blockNumber === 2);
  const blockASteps = hasSeparateBlocks ? mainSteps.filter(s => (s.blockNumber || 1) === 1) : [];
  const blockBSteps = hasSeparateBlocks ? mainSteps.filter(s => s.blockNumber === 2) : [];

  const groups: { key: string; label: string; headingClassName: string; prefix: string; steps: BlockStep[] }[] = [
    { key: 'warmup', label: '🔥 Echauffement', headingClassName: 'text-emerald-400/80', prefix: '', steps: warmupSteps },
    ...(hasSeparateBlocks
      ? [
          { key: 'blockA', label: '⚡ Bloc A', headingClassName: 'text-[#FF6321]/80', prefix: 'A', steps: blockASteps },
          { key: 'blockB', label: '⚡ Bloc B', headingClassName: 'text-orange-400', prefix: 'B', steps: blockBSteps },
        ]
      : [{ key: 'main', label: '⚡ Circuit Principal', headingClassName: 'text-[#FF6321]/80', prefix: '', steps: mainSteps }]),
    { key: 'finisher', label: '🏁 Le Finisher', headingClassName: 'text-red-400', prefix: 'F', steps: finisherSteps },
  ];

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 md:p-6 space-y-4 max-h-[660px] overflow-y-auto flex flex-col text-left">
      <div className="border-b border-white/10 pb-3 flex flex-col">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#FF6321]">
          📋 Déroulé de la Séance
        </h3>
        <p className="text-[10px] text-white/40 mt-1">Cliquez sur une étape pour y sauter directement</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-4">
          {groups.filter(g => g.steps.length > 0).map(group => (
            <div key={group.key} className="space-y-1.5">
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${group.headingClassName} flex items-center gap-1`}>
                {group.label} ({group.steps.length} min)
              </span>
              <div className="space-y-1">
                {group.steps.map(s => (
                  <StepItem key={s.blockIndex} step={s} labelPrefix={group.prefix} activeBlockIndex={activeBlockIndex} onJump={onJump} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
