import { Pose, Pt } from './mannequin';

export interface Motion {
  duration: number; // ms, one loop
  at: (ms: number) => Pose;
  // Moment that best shows the exercise, used as a still image.
  still?: number;
}

const ease = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixPt = (a: Pt, b: Pt, t: number): Pt => [mix(a[0], b[0], t), mix(a[1], b[1], t)];
// Angles turn the short way round: 180 to -96 is a quarter turn, not three.
const mixAngle = (a: number, b: number, t: number) => a + ((((b - a) % 360) + 540) % 360 - 180) * t;

export function blend(p: Pose, q: Pose, t: number): Pose {
  const angles: Record<string, number> = {};
  for (const k of new Set([...Object.keys(p.angles), ...Object.keys(q.angles)])) angles[k] = mixAngle(p.angles[k] ?? q.angles[k], q.angles[k] ?? p.angles[k], t);
  const scale: Record<string, number> = {};
  for (const k of new Set([...Object.keys(p.scale || {}), ...Object.keys(q.scale || {})])) scale[k] = mix(p.scale?.[k] ?? 1, q.scale?.[k] ?? 1, t);
  const ik: Pose['ik'] = {};
  for (const k of ['near', 'far', 'nearHand', 'farHand'] as const) {
    const a = p.ik?.[k], b = q.ik?.[k];
    if (a && b) ik[k] = mixPt(a, b, t);
    else if (a || b) ik[k] = (t < 0.5 ? a : b) ?? undefined;
  }
  return { ...q, angles, scale, ik, anchor: [q.anchor[0], mixPt(p.anchor[1], q.anchor[1], t)] };
}

export interface Key {
  move: number; // ms to reach this pose from the previous one
  hold: number; // ms spent on it
  pose: Partial<Pose>;
}

// Poses reached one after the other, the last one leading back to the first.
export function keyframes(base: Pose, keys: Key[]): Motion {
  const poses = keys.map(k => ({
    ...base, ...k.pose,
    angles: { ...base.angles, ...k.pose.angles },
    scale: { ...base.scale, ...k.pose.scale },
    ik: { ...base.ik, ...k.pose.ik },
    bend: { ...base.bend, ...k.pose.bend },
  } as Pose));
  const duration = keys.reduce((s, k) => s + k.move + k.hold, 0);
  return {
    duration,
    still: keys[0].move,
    at(ms) {
      let t = ((ms % duration) + duration) % duration;
      for (let i = 0; i < keys.length; i++) {
        const from = poses[(i + keys.length - 1) % keys.length], to = poses[i];
        if (t < keys[i].move) return blend(from, to, ease(t / keys[i].move));
        t -= keys[i].move;
        if (t < keys[i].hold) return to;
        t -= keys[i].hold;
      }
      return poses[0];
    },
  };
}

// Held positions just breathe: a slow, small move between two close poses.
export function hold(base: Pose, breath: Partial<Pose>, period = 3200): Motion {
  return keyframes(base, [
    { move: period / 2, hold: 0, pose: {} },
    { move: period / 2, hold: 0, pose: breath },
  ]);
}
