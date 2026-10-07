import { memo } from 'react';
import { SCENES, sceneThumb } from '../illustrations/scenes';

// Still picture of an exercise, to tell list rows apart at a glance.
export const ExerciseThumb = memo(function ExerciseThumb({ exerciseId, className = '' }: { exerciseId: string; className?: string }) {
  const scene = SCENES[exerciseId];
  if (!scene) return <span className={`bg-cream rounded-xl shrink-0 ${className}`} aria-hidden="true" />;
  const { viewBox, svg } = sceneThumb(scene);
  return (
    <svg viewBox={viewBox} aria-hidden="true" className={`bg-cream rounded-xl shrink-0 ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />
  );
});
