import { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { EquipmentKey, WorkoutSession } from '../../hooks/useWorkoutSession';
import { WorkoutConfig } from '../../types';
import { outlineButton, primaryButton, sectionLabel, segmentedOption, segmentedTrack } from '../../lib/ui';
import { LaneArcs } from '../Logo';
import { ExercisePicker } from './ExercisePicker';

const EQUIPMENT_OPTIONS: { key: EquipmentKey; id: string; label: string }[] = [
  { key: 'none', id: 'chk-eq-none', label: 'Aucun' },
  { key: 'chaise', id: 'chk-eq-chaise', label: 'Chaise' },
  { key: 'poids_8kg', id: 'chk-eq-weight', label: 'Poids 8 kg' },
  { key: 'corde_a_sauter', id: 'chk-eq-corde', label: 'Corde' },
];

const RYTHME_OPTIONS: { value: WorkoutConfig['rythme']; id: string; title: string; label: string }[] = [
  { value: 'equilibre', id: 'rad-rythme-equilibre', title: '30 / 30', label: 'Équilibré' },
  { value: 'intense', id: 'rad-rythme-intense', title: '40 / 20', label: 'Intense' },
];

const DURATIONS = [15, 20, 30, 45, 60];

export function ConfigScreen({ session }: { session: WorkoutSession }) {
  const { config, setConfig, previewExercises, handleEquipmentChange, handleGenerateWorkoutPlan } = session;
  const [showExercises, setShowExercises] = useState(false);

  if (showExercises) {
    return <ExercisePicker session={session} onBack={() => setShowExercises(false)} />;
  }

  const durationMinutes = config.durationMinutes || 30;
  const numBlocks = config.numBlocks || 1;

  return (
    <div id="panel-config" className="flex-1 flex flex-col gap-[22px]">
      <LaneArcs className="w-[300px] -top-[100px] -right-[140px] opacity-[0.18]" />

      <h1 className="relative mt-1.5 font-display font-extrabold text-[44px] leading-none tracking-[-0.03em]">
        Prépare<br />ta séance
      </h1>

      <div className="relative flex flex-col gap-2.5">
        <span className={sectionLabel}>Matériel</span>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map(option => {
            const selected = config.equipment[option.key];
            return (
              <button
                key={option.key}
                id={option.id}
                aria-pressed={selected}
                onClick={() => handleEquipmentChange(option.key)}
                className={`h-11 px-4 rounded-full font-semibold text-[15px] flex items-center gap-1.5 ${
                  selected ? 'bg-cream text-ink cursor-pointer' : `${outlineButton}`
                }`}
              >
                {selected && <Check className="w-4 h-4" strokeWidth={3} />}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative flex flex-col gap-2.5">
        <span className={sectionLabel}>Rythme</span>
        <div className={segmentedTrack}>
          {RYTHME_OPTIONS.map(option => {
            const selected = config.rythme === option.value;
            return (
              <button
                key={option.value}
                id={option.id}
                aria-pressed={selected}
                onClick={() => setConfig(prev => ({ ...prev, rythme: option.value }))}
                className={`h-14 flex flex-col items-center justify-center ${segmentedOption(selected)}`}
              >
                <span className="font-display font-extrabold text-xl leading-tight">{option.title}</span>
                <span className={`text-[13px] font-medium ${selected ? '' : 'text-sand'}`}>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <span className={sectionLabel}>Durée</span>
          <span className="font-display font-extrabold text-[26px]">{durationMinutes} min</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {DURATIONS.map(mins => {
            const selected = durationMinutes === mins;
            return (
              <button
                key={mins}
                aria-pressed={selected}
                aria-label={`${mins} minutes`}
                onClick={() => setConfig(prev => ({ ...prev, durationMinutes: mins }))}
                className={`h-11 rounded-xl text-[15px] ${selected ? 'bg-cream text-ink font-bold cursor-pointer' : outlineButton}`}
              >
                {mins}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative flex flex-col gap-2.5">
        <span className={sectionLabel}>Circuit</span>
        <div className={segmentedTrack}>
          {[1, 2].map(value => (
            <button
              key={value}
              aria-pressed={numBlocks === value}
              onClick={() => setConfig(prev => ({ ...prev, numBlocks: value }))}
              className={`h-11 font-semibold text-[15px] ${segmentedOption(numBlocks === value)}`}
            >
              {value === 1 ? 'Un circuit' : 'Deux circuits'}
            </button>
          ))}
        </div>
      </div>

      <button
        id="btn-exercises"
        onClick={() => setShowExercises(true)}
        className="relative flex items-center justify-between py-3.5 border-y border-white/30 cursor-pointer"
      >
        <span className="font-semibold text-base">Exercices</span>
        <span className="flex items-center gap-1.5 text-sand text-[15px]">
          {previewExercises.length} sélectionnés
          <ChevronRight className="w-[18px] h-[18px]" />
        </span>
      </button>

      <div className="sticky bottom-0 mt-auto -mx-5 px-5 pt-3 pb-1 bg-brick">
        <button id="btn-generate-launch" onClick={handleGenerateWorkoutPlan} className={`w-full ${primaryButton}`}>
          Créer la séance
        </button>
      </div>
    </div>
  );
}
