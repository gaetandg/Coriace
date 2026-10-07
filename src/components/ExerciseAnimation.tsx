import { useEffect, useRef } from 'react';
import { SCENES, sceneFrame, sceneTop } from '../illustrations/scenes';

interface ExerciseAnimationProps {
  exerciseId: string;
  // Paused sessions freeze the animation where it is.
  playing?: boolean;
  className?: string;
}

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const hasAnimation = (exerciseId: string) => exerciseId in SCENES;

// The exercise drawn by the mannequin and played in a loop.
export function ExerciseAnimation({ exerciseId, playing = true, className = '' }: ExerciseAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const elapsed = useRef(0);
  const scene = SCENES[exerciseId];

  useEffect(() => {
    elapsed.current = 0;
  }, [exerciseId]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!scene || !svg) return;
    const cache = {};
    const draw = (ms: number) => { svg.innerHTML = sceneFrame(scene, ms, cache); };
    if (reducedMotion()) {
      draw(scene.motion.still ?? 0);
      return;
    }
    draw(elapsed.current);
    if (!playing) return;
    let frame = 0, last = performance.now(), visible = true;
    // No drawing while off screen, to spare the battery.
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(svg);
    const tick = (now: number) => {
      elapsed.current += Math.min(now - last, 100);
      last = now;
      if (visible) draw(elapsed.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [scene, playing]);

  if (!scene) return null;
  const top = sceneTop(scene);
  return <svg ref={svgRef} viewBox={`0 ${top} 200 ${160 - top}`} role="img" aria-label="Animation du mouvement" className={className} />;
}
