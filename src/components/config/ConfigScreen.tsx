import { useState } from 'react';
import { Check, Info } from 'lucide-react';
import { EXERCISE_DATABASE } from '../../exercises';
import { EXERCISE_GROUPS } from '../../lib/groups';
import { EquipmentKey, SessionMode, WorkoutSession } from '../../hooks/useWorkoutSession';
import { PresetList } from './PresetList';
import { Exercise, WorkoutConfig } from '../../types';
import { ExerciseDetailModal } from '../summary/ExerciseDetailModal';
import { outlineButton, primaryButton, sectionLabel, segmentedOption, segmentedTrack } from '../../lib/ui';
import { LaneArcs } from '../Logo';

const EQUIPMENT_OPTIONS: { key: EquipmentKey; id: string; label: string }[] = [
  { key: 'none', id: 'chk-eq-none', label: 'Aucun' },
  { key: 'chaise', id: 'chk-eq-chaise', label: 'Chaise' },
  { key: 'poids_8kg', id: 'chk-eq-weight', label: 'Poids 4–10 kg' },
  { key: 'corde_a_sauter', id: 'chk-eq-corde', label: 'Corde à sauter' },
];

const RYTHME_OPTIONS: { value: WorkoutConfig['rythme']; id: string; title: string; label: string }[] = [
  { value: 'equilibre', id: 'rad-rythme-equilibre', title: '30 / 30', label: 'Équilibré' },
  { value: 'intense', id: 'rad-rythme-intense', title: '40 / 20', label: 'Intense' },
];

const DURATIONS = [15, 20, 30, 45, 60];

const MODE_OPTIONS: { value: SessionMode; label: string }[] = [
  { value: 'custom', label: 'Sur mesure' },
  { value: 'preset', label: 'Séances prédéfinies' },
];

export function ConfigScreen({ session }: { session: WorkoutSession }) {
  const {
    config,
    setConfig,
    compatibleExercises,
    previewExercises,
    handleEquipmentChange,
    toggleExerciseSelection,
    setExercisesSelected,
    handleGenerateWorkoutPlan,
    mode,
    setMode,
    handleStartPreset,
  } = session;
  const noExercise = previewExercises.length === 0;
  const selectedIds = config.selectedExerciseIds || EXERCISE_DATABASE.map(e => e.id);
  const [detailExercise, setDetailExercise] = useState<Exercise | null>(null);

  const durationMinutes = config.durationMinutes || 30;

  return (
    <div id="panel-config" className="flex-1 flex flex-col gap-[22px]">
      <LaneArcs className="w-[300px] -top-[100px] -right-[140px] opacity-[0.18]" />

      <div className="relative mt-1.5 flex flex-col gap-3">
        <h1 className="font-display font-extrabold text-[44px] leading-none tracking-[-0.03em]">
          Prépare<br />ta séance
        </h1>
        <p className="text-base leading-snug text-sand max-w-[320px]">
          Le renfo des coureurs : mollets, adducteurs, fessiers et gainage, pour tenir ta foulée jusqu'au bout. Guidé à la voix, à la maison.
        </p>
      </div>

      <div className={`relative ${segmentedTrack}`}>
        {MODE_OPTIONS.map(option => (
          <button
            key={option.value}
            id={`mode-${option.value}`}
            aria-pressed={mode === option.value}
            onClick={() => setMode(option.value)}
            className={`h-11 font-semibold text-[15px] ${segmentedOption(mode === option.value)}`}
          >
            {option.label}
          </button>
        ))}
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

      {mode === 'preset' ? (
        <PresetList onStart={handleStartPreset} />
      ) : (
        <>
        <div className="relative flex flex-col gap-2.5">
          <span className={sectionLabel}>Matériel</span>
          <div className="grid grid-cols-2 gap-2">
            {EQUIPMENT_OPTIONS.map(option => {
              const selected = config.equipment[option.key];
              return (
                <button
                  key={option.key}
                  id={option.id}
                  aria-pressed={selected}
                  onClick={() => handleEquipmentChange(option.key)}
                  className={`h-11 pl-4 pr-3 rounded-full font-semibold text-[15px] flex items-center justify-between gap-1.5 border-[1.5px] ${
                    selected ? 'bg-cream text-ink border-cream cursor-pointer' : outlineButton
                  }`}
                >
                  {option.label}
                  {/* The tick always keeps its place so checking a chip doesn't move the text */}
                  <Check className={`w-4 h-4 shrink-0 ${selected ? '' : 'invisible'}`} strokeWidth={3} />
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

        <div id="exercise-list" className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <span className={sectionLabel}>Exercices</span>
              <span className="text-sm text-sand">{previewExercises.length} sur {compatibleExercises.length}</span>
            </div>
            <div className="flex gap-4 text-sm font-semibold">
              <button onClick={() => setExercisesSelected(compatibleExercises.map(ex => ex.id), true)} className="h-11 underline underline-offset-4 cursor-pointer">Tout cocher</button>
              <button onClick={() => setExercisesSelected(compatibleExercises.map(ex => ex.id), false)} className="h-11 underline underline-offset-4 cursor-pointer">Tout décocher</button>
            </div>
          </div>

          {EXERCISE_GROUPS.map(group => {
            const exercises = compatibleExercises.filter(ex => ex.group === group.id);
            if (exercises.length === 0) return null;
            const selectedCount = exercises.filter(ex => selectedIds.includes(ex.id)).length;
            const allSelected = selectedCount === exercises.length;
            return (
              <section key={group.id} className="flex flex-col">
                <div className="flex items-center justify-between gap-3 border-b border-white/30">
                  <h3 className="font-display font-bold text-lg">
                    {group.label} <span className="font-sans font-normal text-sm text-sand">{selectedCount}/{exercises.length}</span>
                  </h3>
                  <button
                    onClick={() => setExercisesSelected(exercises.map(ex => ex.id), !allSelected)}
                    className="h-11 text-sm font-semibold underline underline-offset-4 cursor-pointer"
                  >
                    {allSelected ? 'Tout décocher' : 'Tout cocher'}
                  </button>
                </div>
                <ul className="flex flex-col">
                  {exercises.map(ex => {
                    const isSelected = selectedIds.includes(ex.id);
                    return (
                      <li key={ex.id} className="border-b border-white/20 flex items-center">
                        <button
                          aria-pressed={isSelected}
                          onClick={() => toggleExerciseSelection(ex.id)}
                          className="flex-1 py-3 flex items-center gap-3.5 text-left cursor-pointer"
                        >
                          <span className={`w-6 h-6 rounded-md shrink-0 flex items-center justify-center ${isSelected ? 'bg-cream text-ink' : 'border-[1.5px] border-white/55'}`}>
                            {isSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                          </span>
                          <span className="flex flex-col">
                            <span className={`font-semibold text-base ${isSelected ? '' : 'text-sand'}`}>{ex.name}</span>
                            <span className="text-sm text-sand">{ex.target}</span>
                          </span>
                        </button>
                        <button
                          onClick={() => setDetailExercise(ex)}
                          aria-label={`Voir les consignes : ${ex.name}`}
                          className="w-11 h-11 -mr-2 shrink-0 rounded-full flex items-center justify-center text-sand hover:bg-white/10 cursor-pointer"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="sticky bottom-0 mt-auto -mx-5 px-5 pt-3 pb-1 bg-brick">
          <button
            id="btn-generate-launch"
            onClick={handleGenerateWorkoutPlan}
            aria-disabled={noExercise}
            className={`w-full ${primaryButton} ${noExercise ? 'opacity-45' : ''}`}
          >
            Créer la séance
          </button>
        </div>

        </>
      )}

      {detailExercise && <ExerciseDetailModal exercise={detailExercise} onClose={() => setDetailExercise(null)} />}
    </div>
  );
}
