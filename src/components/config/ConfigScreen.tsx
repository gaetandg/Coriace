import { ReactNode } from 'react';
import { Activity, Check, Flame, Volume2 } from 'lucide-react';
import { EXERCISE_DATABASE } from '../../exercises';
import { getBodyPart } from '../../workoutGenerator';
import { bodyPartEmoji } from '../../lib/bodyPart';
import { EquipmentKey, WorkoutSession } from '../../hooks/useWorkoutSession';
import { WorkoutConfig } from '../../types';

const EQUIPMENT_OPTIONS: { key: EquipmentKey; id: string; emoji: string; label: string; detail: string }[] = [
  { key: 'none', id: 'chk-eq-none', emoji: '🧘', label: 'Aucun matériel', detail: 'Poids du corps' },
  { key: 'chaise', id: 'chk-eq-chaise', emoji: '🪑', label: 'Chaise', detail: 'Solide et stable' },
  { key: 'poids_8kg', id: 'chk-eq-weight', emoji: '🏋️', label: 'Poids de 8 kg', detail: 'Haltère, kettlebell ou bidon' },
  { key: 'corde_a_sauter', id: 'chk-eq-corde', emoji: '🪢', label: 'Corde à sauter', detail: 'Pour les sauts' },
];

const RYTHME_OPTIONS: {
  value: WorkoutConfig['rythme'];
  id: string;
  title: string;
  description: string;
  selectedCard: string;
  selectedDot: string;
  titleColor: string;
}[] = [
  {
    value: 'equilibre',
    id: 'rad-rythme-equilibre',
    title: 'Équilibré · 30 s / 30 s',
    description: "30 secondes d'effort, 30 secondes de récupération. Le bon choix pour commencer.",
    selectedCard: 'bg-white/10 border-emerald-500 shadow-lg shadow-emerald-950/10',
    selectedDot: 'border-emerald-500 bg-emerald-500',
    titleColor: 'text-emerald-400',
  },
  {
    value: 'intense',
    id: 'rad-rythme-intense',
    title: 'Intense · 40 s / 20 s',
    description: "40 secondes d'effort, 20 secondes de récupération. Plus exigeant : tu travailles sous fatigue.",
    selectedCard: 'bg-white/10 border-[#FF6321] shadow-lg shadow-orange-950/10',
    selectedDot: 'border-[#FF6321] bg-[#FF6321]',
    titleColor: 'text-[#FF6321]',
  },
];

const BLOCK_OPTIONS = [
  {
    value: 1,
    title: 'Un circuit',
    description: 'Les mêmes exercices répétés sur plusieurs tours. Plus facile à mémoriser.',
  },
  {
    value: 2,
    title: 'Deux circuits',
    description: 'Un bloc A puis un bloc B, avec des exercices différents. Plus varié.',
  },
];

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <label className="text-xs font-semibold tracking-widest text-white/50 uppercase block">
      {children}
    </label>
  );
}

function RadioDot({ selected, selectedClassName }: { selected: boolean; selectedClassName: string }) {
  return (
    <div className={`mt-1 rounded-full w-4 h-4 border flex items-center justify-center shrink-0 ${
      selected ? selectedClassName : 'border-white/30'
    }`}>
      {selected && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
    </div>
  );
}

export function ConfigScreen({ session }: { session: WorkoutSession }) {
  const {
    config,
    setConfig,
    compatibleExercises,
    previewExercises,
    handleEquipmentChange,
    toggleExerciseSelection,
    handleSelectAllExercises,
    testBeeps,
    handleGenerateWorkoutPlan,
  } = session;

  const durationMinutes = config.durationMinutes || 30;
  const numBlocks = config.numBlocks || 1;

  return (
    <div id="panel-config" className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-fade-in">
      <div className="text-center max-w-xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-[#FF6321]/15 text-[#FF6321] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#FF6321]/20">
          <Flame className="w-3.5 h-3.5" /> Séance de {durationMinutes} min
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
          Prépare ta séance
        </h2>
        <p className="text-xs sm:text-sm text-white/55 leading-relaxed font-sans max-w-lg mx-auto">
          Choisis ton matériel, ton rythme et la durée. La séance enchaîne un échauffement, un circuit de renforcement (mollets, adducteurs, gainage) et un finisher.
        </p>
      </div>

      {/* EQUIPMENT CHOICES checkboxes */}
      <div className="space-y-4">
        <SectionLabel>1. Matériel</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EQUIPMENT_OPTIONS.map(option => {
            const selected = config.equipment[option.key];
            return (
              <button
                key={option.key}
                id={option.id}
                onClick={() => handleEquipmentChange(option.key)}
                className={`flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  selected
                    ? 'bg-white/15 border-[#FF6321]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.emoji}</span>
                  <div>
                    <span className="font-display font-bold text-sm block text-white">{option.label}</span>
                    <span className={option.key === 'none' ? 'text-[10px] text-white/40 font-medium' : 'text-[10px] text-white/40 font-medium font-mono'}>{option.detail}</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                  selected ? 'bg-[#FF6321] border-[#FF6321] text-black' : 'border-white/20'
                }`}>
                  {selected && <Check className="w-3 h-3 stroke-[4]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PACE SELECTION TIMERS */}
      <div className="space-y-4">
        <SectionLabel>2. Rythme</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RYTHME_OPTIONS.map(option => {
            const selected = config.rythme === option.value;
            return (
              <button
                key={option.value}
                id={option.id}
                onClick={() => setConfig(prev => ({ ...prev, rythme: option.value }))}
                className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                  selected ? option.selectedCard : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <RadioDot selected={selected} selectedClassName={option.selectedDot} />
                  <div>
                    <span className={`font-display font-bold text-sm block ${option.titleColor} uppercase tracking-tight`}>{option.title}</span>
                    <span className="text-xs text-white/60 leading-relaxed block mt-2">
                      {option.description}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DURATION SELECTION */}
      <div className="space-y-4">
        <SectionLabel>3. Durée</SectionLabel>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="font-display font-bold text-lg text-white">
                {durationMinutes} minutes
              </span>
              <span className="text-xs text-white/55 block font-sans">
                Échauffement et finisher compris.
              </span>
            </div>
            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              {[15, 20, 30, 45, 60].map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, durationMinutes: mins }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer transition ${
                    durationMinutes === mins
                      ? 'bg-[#FF6321] text-black shadow-lg shadow-[#FF6321]/10'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Slider input */}
          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={durationMinutes}
              onChange={(e) => setConfig(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) }))}
              className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#FF6321]"
            />
            <div className="flex justify-between text-[10px] text-white/40 font-mono uppercase tracking-wider">
              <span>15 min</span>
              <span>30 min</span>
              <span>45 min</span>
              <span>60 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCKS SELECTION */}
      <div className="space-y-4">
        <SectionLabel>4. Circuit</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BLOCK_OPTIONS.map(option => {
            const selected = numBlocks === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, numBlocks: option.value }))}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  selected
                    ? 'bg-white/10 border-[#FF6321] text-white shadow-lg shadow-[#FF6321]/5'
                    : 'bg-white/5 border-white/5 text-white/45 hover:bg-white/8 hover:text-white/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <RadioDot selected={selected} selectedClassName="border-[#FF6321] bg-[#FF6321]" />
                  <div>
                    <span className="font-display font-bold text-xs sm:text-sm block text-[#FF6321] uppercase tracking-tight">{option.title}</span>
                    <span className="text-[11px] sm:text-xs text-white/60 leading-relaxed block mt-2">
                      {option.description}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* INDIVIDUAL EXERCISE SELECTION CHECKBOXES */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <SectionLabel>5. Exercices ({previewExercises.length} sélectionnés)</SectionLabel>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSelectAllExercises(true)}
              className="text-[10px] text-[#FF6321] hover:underline uppercase tracking-wider font-extrabold cursor-pointer"
            >
              Tout cocher
            </button>
            <span className="text-white/20 text-xs">|</span>
            <button
              type="button"
              onClick={() => handleSelectAllExercises(false)}
              className="text-[10px] text-[#FF6321] hover:underline uppercase tracking-wider font-extrabold cursor-pointer"
            >
              Tout décocher
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {compatibleExercises.map((ex) => {
            const isSelected = (config.selectedExerciseIds || EXERCISE_DATABASE.map(e => e.id)).includes(ex.id);
            const bodyPart = getBodyPart(ex);
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => toggleExerciseSelection(ex.id)}
                className={`flex items-start text-left gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white/10 border-[#FF6321] shadow-lg shadow-[#FF6321]/5 text-white'
                    : 'bg-white/5 border-white/5 text-white/45 hover:bg-white/8 hover:text-white/70'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                  isSelected ? 'bg-[#FF6321] border-[#FF6321] text-black' : 'border-white/20 bg-[#050505]'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[4]" />}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 font-display font-bold text-sm tracking-tight">
                    <span>{ex.name}</span>
                    <span className="shrink-0 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-md text-[10px] font-mono flex items-center gap-1 text-white/75 font-normal">
                      {bodyPartEmoji(bodyPart)} {bodyPart.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#FF6321] block font-mono uppercase tracking-wider">{ex.target}</span>
                  <p className="text-xs leading-relaxed font-sans mt-1 opacity-85">{ex.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTION BUILT LAUNCHERS */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          id="btn-test-beep"
          onClick={testBeeps}
          className="text-xs text-white/60 hover:text-white flex items-center gap-2 bg-white/5 hover:bg-white/10 w-full sm:w-auto px-5 h-12 rounded-full border border-white/10 hover:border-white/20 transition-all font-bold uppercase tracking-wider justify-center cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-[#FF6321]" /> Tester le son
        </button>

        <button
          id="btn-generate-launch"
          onClick={handleGenerateWorkoutPlan}
          className="w-full sm:w-auto bg-[#FF6321] hover:bg-[#FF6321]/95 text-black font-extrabold px-10 h-14 rounded-full shadow-lg shadow-[#FF6321]/15 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-widest cursor-pointer"
        >
          <Activity className="w-4 h-4 shrink-0" /> Créer la séance
        </button>
      </div>
    </div>
  );
}
