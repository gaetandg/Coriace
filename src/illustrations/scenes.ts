import { Joints, Pose, Pt, angleTo, figure, skeleton } from './mannequin';
import { Motion, hold, keyframes } from './motion';
import { ANKLE_Y, FLOOR, chair, floor, kettlebell, rope, shadow, step, wall } from './props';

// One animated scene per exercise. Side views face right unless noted.

// `top`: highest point of the scenery, so the frame can be cropped above it.
type Props = { back?: string; front?: string; top?: number };

export interface Scene {
  motion: Motion;
  // Scenery placed once, from the first pose (chairs and steps don't move).
  props?: (first: Joints) => Props;
  // Scenery that follows the body (weights, ropes, shadows).
  dynamic?: (pose: Pose, joints: Joints, ms: number) => { back?: string; front?: string };
}

const STAND_HIP = ANKLE_Y - 55 + 0.5;
const armsDown = { nearUpperArm: 4, nearForearm: 8, farUpperArm: 0, farForearm: 4 };
const flatFeet = { nearFoot: 90, farFoot: 90 };
// Torso angle that puts the shoulders on `shoulder` from a hip at `hip`.
const towards = (hip: Pt, shoulder: Pt) => angleTo(hip, shoulder);
// Hands together in front of the chest (front view), elbows out.
const chestHands = (hipX: number, hipY: number): Pose['ik'] => ({ nearHand: [hipX + 3, hipY - 21], farHand: [hipX - 3, hipY - 21] });
const frontBase = (extra: Partial<Pose>): Pose => ({
  view: 'front', sameTone: true, nearSide: 'right', anchor: ['hip', [100, STAND_HIP]],
  scale: { nearFoot: 0.55, farFoot: 0.55 }, bend: { near: 1, far: -1, nearHand: -1, farHand: 1 }, ...extra,
  angles: { torso: 180, head: 180, nearUpperArm: 8, nearForearm: 4, farUpperArm: -8, farForearm: -4, nearFoot: 70, farFoot: -70, ...extra.angles },
});
const weightAtHands = (_p: Pose, j: Joints) => ({ front: kettlebell([(j['near.hand'][0] + j['far.hand'][0]) / 2, (j['near.hand'][1] + j['far.hand'][1]) / 2 + 5]) });

// --- Calves and ankles ---

const calvesStanding: Scene = {
  motion: keyframes({
    anchor: ['near.toe', [111, 124.5]],
    angles: { torso: 184, head: 188, nearUpperArm: -128, nearForearm: -100, farUpperArm: -124, farForearm: -96, nearThigh: 1, nearShin: -1, nearFoot: -62, farThigh: 1, farShin: -1, farFoot: -62 },
  }, [
    { move: 1000, hold: 250, pose: { angles: { nearFoot: -50, farFoot: -50 } } },
    { move: 4000, hold: 400, pose: { angles: { nearFoot: -108, farFoot: -108, nearUpperArm: -122, farUpperArm: -118 } } },
  ]),
  props: () => ({ back: wall(92) + step(92, 118, 126) }),
};

const seatedRaise = (raised: boolean): Partial<Pose> => ({
  ik: raised ? { near: [110.5, 139.8], far: [108.5, 139.8] } : { near: [108, ANKLE_Y], far: [106, ANKLE_Y] },
  angles: raised ? { nearFoot: 55, farFoot: 55 } : flatFeet,
});
const calvesSeated: Scene = {
  motion: keyframes({
    anchor: ['hip', [80, 117]], bend: { near: -1, far: -1, nearHand: -1, farHand: -1 },
    angles: { torso: 168, head: 172, ...flatFeet }, ik: { nearHand: [101, 104], farHand: [99, 104] },
  }, [
    { move: 900, hold: 500, pose: seatedRaise(true) },
    { move: 1300, hold: 300, pose: seatedRaise(false) },
  ]),
  props: () => ({ back: chair(60, 126, 'left'), top: 86 }),
  dynamic: (_p, j) => ({ front: kettlebell([(j['near.knee'][0] + j['near.hip'][0] * 0.25) / 1.25, j['near.knee'][1] - 11]) }),
};

const lowCalves = (raised: boolean): Partial<Pose> => ({
  anchor: ['hip', raised ? [94, 123] : [92, 128]],
  ik: raised ? { near: [110.5, 139.8], far: [108.5, 139.8] } : { near: [108, ANKLE_Y], far: [106, ANKLE_Y] },
  angles: raised ? { nearFoot: 55, farFoot: 55 } : flatFeet,
});
const calfRaiseLow: Scene = {
  motion: keyframes({
    anchor: ['hip', [92, 128]], bend: { near: 1, far: 1 },
    angles: { torso: 150, head: 165, nearUpperArm: 96, nearForearm: 96, farUpperArm: 92, farForearm: 92, ...flatFeet },
  }, [
    { move: 600, hold: 2000, pose: lowCalves(true) },
    { move: 800, hold: 500, pose: lowCalves(false) },
  ]),
};

// Jump rope, front view. One turn every `period` ms; the body is highest as the rope passes under.
function ropeScene(kind: 'joint' | 'single' | 'running'): Scene {
  const period = kind === 'running' ? 440 : kind === 'joint' ? 480 : 600;
  const base = frontBase({ angles: { torso: 180, head: 180, nearUpperArm: 26, nearForearm: 72, farUpperArm: -26, farForearm: -72, nearFoot: 90, farFoot: -90, nearThigh: 3, nearShin: 1, farThigh: -3, farShin: -1 } });
  const motion: Motion = {
    duration: period * 8,
    at(ms) {
      const turn = (2 * Math.PI * ms) / period;
      const lift = (kind === 'single' ? 6 : 5) * Math.max(0, Math.cos(turn)) ** 1.5;
      const bend = 4 * Math.max(0, -Math.cos(turn));
      const a = { ...base.angles };
      const scale = { ...base.scale };
      let tucked: 'near' | 'far' | null = kind === 'single' ? 'near' : null;
      if (kind === 'running') tucked = Math.floor(ms / period) % 2 ? 'far' : 'near';
      const standing = tucked === 'near' ? 'far' : tucked === 'far' ? 'near' : null;
      if (tucked) {
        a[`${tucked}Thigh`] = tucked === 'near' ? 6 : -6;
        a[`${tucked}Shin`] = tucked === 'near' ? 2 : -2;
        scale[`${tucked}Thigh`] = kind === 'single' ? 0.5 : 0.5 + 0.35 * (1 - Math.max(0, Math.cos(turn)));
      }
      for (const side of standing ? [standing] : ['near', 'far']) {
        const sgn = side === 'near' ? 1 : -1;
        a[`${side}Thigh`] = sgn * (3 + bend);
        a[`${side}Shin`] = sgn * (1 - bend * 1.6);
      }
      return { ...base, angles: a, scale, anchor: ['hip', [100, STAND_HIP - lift + bend * 0.8]], turn, lift } as Pose;
    },
  };
  return {
    motion,
    dynamic: (p, j) => {
      const { turn, lift } = p as Pose & { turn: number; lift: number };
      const r = rope(j['far.hand'], j['near.hand'], turn);
      return { back: shadow(100, 16 - lift, 1 - lift / 12) + r.back, front: r.front };
    },
  };
}

const heelWalk = (front: 'near' | 'far' | null, swing: 'near' | 'far' | null): Partial<Pose> => {
  const pos = (side: 'near' | 'far'): Pt => side === swing ? [100, 138] : side === front ? [111, 144.7] : [89, 144.7];
  const nearFwd = front === 'near' || swing === 'far';
  return {
    ik: { near: pos('near'), far: pos('far') },
    angles: { nearUpperArm: nearFwd ? -24 : 24, nearForearm: nearFwd ? 0 : 50, farUpperArm: nearFwd ? 24 : -24, farForearm: nearFwd ? 50 : 0 },
  };
};
const heelWalking: Scene = {
  motion: keyframes({
    anchor: ['hip', [100, 90.5]], bend: { near: 1, far: 1 },
    angles: { torso: 180, head: 180, nearFoot: 125, farFoot: 125, ...armsDown },
  }, [
    { move: 380, hold: 0, pose: heelWalk('near', null) },
    { move: 380, hold: 0, pose: heelWalk(null, 'near') },
    { move: 380, hold: 0, pose: heelWalk('far', null) },
    { move: 380, hold: 0, pose: heelWalk(null, 'far') },
  ]),
};

const balance: Scene = {
  motion: hold({
    anchor: ['hip', [100, STAND_HIP]], ik: { near: [101, ANKLE_Y] }, bend: { near: 1 },
    angles: { torso: 180, head: 180, nearFoot: 90, farThigh: 12, farShin: -62, farFoot: -20, nearUpperArm: 34, nearForearm: 54, farUpperArm: 28, farForearm: 48 },
  }, { anchor: ['hip', [101.5, STAND_HIP]], angles: { torso: 177, nearUpperArm: 30, farUpperArm: 32 } }, 2600),
};

// --- Adductors ---

const sumoDown = (down: boolean): Partial<Pose> => ({ anchor: ['hip', [100, down ? 113 : STAND_HIP + 1]], ik: { near: [118, ANKLE_Y], far: [82, ANKLE_Y], ...chestHands(100, down ? 113 : STAND_HIP + 1) } });
const squatSumo: Scene = {
  motion: keyframes(frontBase({ ...sumoDown(false), angles: { torso: 180, head: 180, nearFoot: 55, farFoot: -55 } }), [
    { move: 1500, hold: 300, pose: sumoDown(true) },
    { move: 1200, hold: 400, pose: sumoDown(false) },
  ]),
};

const lateral = (side: 'near' | 'far' | null): Partial<Pose> => {
  const hip: Pt = side === 'near' ? [130, 102] : side === 'far' ? [70, 102] : [100, STAND_HIP];
  return {
    anchor: ['hip', hip],
    ik: { near: side === 'near' ? [150, ANKLE_Y] : [108, ANKLE_Y], far: side === 'far' ? [50, ANKLE_Y] : [92, ANKLE_Y], ...chestHands(hip[0], hip[1]) },
  };
};
const lateralLunges: Scene = {
  motion: keyframes(frontBase(lateral(null)), [
    { move: 1100, hold: 300, pose: lateral('near') },
    { move: 900, hold: 200, pose: lateral(null) },
    { move: 1100, hold: 300, pose: lateral('far') },
    { move: 900, hold: 200, pose: lateral(null) },
  ]),
};

const goblet = (x: number, y: number): Partial<Pose> => ({ anchor: ['hip', [x, y]], ik: { near: [114, ANKLE_Y], far: [86, ANKLE_Y], ...chestHands(x, y) } });
const shiftSquat: Scene = {
  motion: keyframes(frontBase({ ...goblet(100, STAND_HIP + 1) }), [
    { move: 1100, hold: 200, pose: goblet(100, 110) },
    { move: 800, hold: 300, pose: goblet(109, 112) },
    { move: 800, hold: 0, pose: goblet(100, 110) },
    { move: 800, hold: 300, pose: goblet(91, 112) },
    { move: 800, hold: 0, pose: goblet(100, 110) },
    { move: 1000, hold: 300, pose: goblet(100, STAND_HIP + 1) },
  ]),
  dynamic: weightAtHands,
};

const copenhagenBase: Pose = {
  view: 'front', nearSide: 'right', anchor: ['far.elbow', [40, 145]],
  angles: { torso: -74, head: -78, nearUpperArm: 184, nearForearm: 182, farUpperArm: 2, farForearm: -90, nearThigh: 104, nearShin: 104, nearFoot: 178, farThigh: 70, farShin: 40, farFoot: 130 },
  scale: { nearFoot: 0.6, farFoot: 0.6 },
};
const copenhagen: Scene = {
  motion: hold(copenhagenBase, { angles: { torso: -72.5, nearThigh: 103, nearShin: 103 } }),
  props: j => { const [x, y] = j['near.ankle']; return { back: chair(Math.round(x - 12), Math.round(y + 3.5), 'right'), top: y + 3.5 - 40 }; },
};

// --- Thighs ---

const squatPose = (down: boolean, depth = 1): Partial<Pose> => ({
  anchor: ['hip', down ? [100 - 14 * depth, STAND_HIP + 27 * depth] : [100, STAND_HIP]],
  angles: down ? { torso: 180 - 32 * depth, head: 180 - 15 * depth, nearUpperArm: 98, nearForearm: 96, farUpperArm: 94, farForearm: 92 } : { torso: 180, head: 182, ...armsDown },
});
const squatMotion = (depth: number) => keyframes({
  anchor: ['hip', [100, STAND_HIP]], ik: { near: [110, ANKLE_Y], far: [108, ANKLE_Y] }, bend: { near: 1, far: 1 },
  angles: { torso: 180, head: 182, ...armsDown, ...flatFeet },
}, [
  { move: 1700, hold: 250, pose: squatPose(true, depth) },
  { move: 1300, hold: 500, pose: squatPose(false) },
]);
const squat: Scene = { motion: squatMotion(1) };

const lunge = (front: 'near' | 'far' | null): Partial<Pose> => {
  if (!front) return { anchor: ['hip', [100, STAND_HIP]], ik: { near: [102, ANKLE_Y], far: [98, ANKLE_Y] }, angles: flatFeet };
  const back = front === 'near' ? 'far' : 'near';
  return {
    anchor: ['hip', [100, 114]],
    ik: { [front]: [126, ANKLE_Y], [back]: [74, 141] },
    angles: { [`${front}Foot`]: 90, [`${back}Foot`]: 52 },
  } as Partial<Pose>;
};
const lunges: Scene = {
  motion: keyframes({ ...lunge(null), bend: { near: 1, far: 1 }, angles: { torso: 180, head: 180, ...armsDown, ...flatFeet } } as Pose, [
    { move: 1200, hold: 300, pose: lunge('near') },
    { move: 1000, hold: 200, pose: lunge(null) },
    { move: 1200, hold: 300, pose: lunge('far') },
    { move: 1000, hold: 200, pose: lunge(null) },
  ]),
};

const wallSit: Scene = {
  motion: hold({
    anchor: ['hip', [73, 118]], ik: { near: [101, ANKLE_Y], far: [99, ANKLE_Y] }, bend: { near: 1, far: 1 },
    angles: { torso: 180, head: 180, nearUpperArm: 34, nearForearm: 82, farUpperArm: 30, farForearm: 80, ...flatFeet },
  }, { angles: { head: 176, nearForearm: 86, farForearm: 84 } }),
  props: () => ({ back: wall(63) }),
};

const stepUpPose = (top: boolean): Partial<Pose> => top
  ? { anchor: ['hip', [122, 63.5]], ik: { near: [122, 118.4], far: [134, 104] }, angles: { torso: 180, head: 180, nearFoot: 90, farFoot: 60, nearUpperArm: -30, nearForearm: 10, farUpperArm: 50, farForearm: 120 } }
  : { anchor: ['hip', [96, 94]], ik: { near: [122, 118.4], far: [88, ANKLE_Y] }, angles: { torso: 170, head: 175, ...flatFeet, ...armsDown } };
const stepUp: Scene = {
  motion: keyframes({ ...stepUpPose(false), bend: { near: 1, far: 1 } } as Pose, [
    { move: 1300, hold: 350, pose: stepUpPose(true) },
    { move: 1500, hold: 300, pose: stepUpPose(false) },
  ]),
  props: () => ({ back: chair(112, 122, 'right'), top: 82 }),
};

const bulgarianPose = (down: boolean): Partial<Pose> => ({
  anchor: ['hip', down ? [94, 116] : [101, 94]],
  angles: { torso: down ? 165 : 172, head: down ? 172 : 176 },
});
const bulgarian: Scene = {
  motion: keyframes({
    ...bulgarianPose(false), ik: { near: [118, ANKLE_Y], far: [66, 117] }, bend: { near: 1, far: 1 },
    angles: { torso: 172, head: 176, nearFoot: 90, farFoot: -100, ...armsDown },
  } as Pose, [
    { move: 1400, hold: 300, pose: bulgarianPose(true) },
    { move: 1100, hold: 400, pose: bulgarianPose(false) },
  ]),
  props: () => ({ back: chair(34, 122, 'left'), top: 82 }),
};

// --- Glutes and hamstrings (lying on the back, head on the left) ---

const bridgeBase = (hip: Pt, up: boolean, feet: Pt[], footAngle: number, single: boolean): Partial<Pose> => {
  const shoulder: Pt = [hip[0] - (up ? Math.sqrt(27.7 ** 2 - (141 - hip[1]) ** 2) : 27.7), 141];
  return {
    anchor: ['hip', hip],
    angles: { torso: up ? towards(hip, shoulder) : -90, head: up ? -110 : -90, nearUpperArm: 90, nearForearm: 90, farUpperArm: 90, farForearm: 90, nearFoot: footAngle, farFoot: footAngle },
    ik: single ? { near: feet[0] } : { near: feet[0], far: feet[1] },
    farLegFollowsNearThigh: single,
  };
};
const singleLegBridge: Scene = {
  motion: keyframes({ ...bridgeBase([112, 141], false, [[134, ANKLE_Y]], 90, true), bend: { near: 1 } } as Pose, [
    { move: 1100, hold: 700, pose: bridgeBase([112, 121], true, [[134, ANKLE_Y]], 90, true) },
    { move: 1400, hold: 300, pose: bridgeBase([112, 141], false, [[134, ANKLE_Y]], 90, true) },
  ]),
};
const hamstringBridge: Scene = {
  motion: keyframes({ ...bridgeBase([96, 141], false, [[139, 116], [137, 116]], 150, false), bend: { near: 1, far: 1 } } as Pose, [
    { move: 1100, hold: 500, pose: bridgeBase([100, 122], true, [[139, 116], [137, 116]], 150, false) },
    { move: 1500, hold: 300, pose: bridgeBase([96, 141], false, [[139, 116], [137, 116]], 150, false) },
  ]),
  props: () => ({ back: chair(134, 122, 'right'), top: 82 }),
};

// Lying on the side, seen from the front: the near side is on top.
const abduction: Scene = {
  motion: keyframes({
    view: 'front', nearSide: 'right', anchor: ['hip', [112, 136]],
    angles: { torso: -90, head: -90, nearUpperArm: 90, nearForearm: 90, farUpperArm: -90, farForearm: -90, nearThigh: 90, nearShin: 90, nearFoot: 90, farThigh: 90, farShin: 90, farFoot: 90 },
    scale: { nearFoot: 0.5, farFoot: 0.5 },
  }, [
    { move: 1000, hold: 500, pose: { angles: { nearThigh: 108, nearShin: 108, nearFoot: 108 } } },
    { move: 1500, hold: 300, pose: { angles: { nearThigh: 90, nearShin: 90, nearFoot: 90 } } },
  ]),
};

const rdl = (down: boolean): Partial<Pose> => down
  ? { anchor: ['hip', [94, 96]], angles: { torso: 96, head: 100, farThigh: -86, farShin: -86, farFoot: -4, nearUpperArm: 2, nearForearm: 0, farUpperArm: -2, farForearm: -2 } }
  : { anchor: ['hip', [100, STAND_HIP]], angles: { torso: 180, head: 180, farThigh: -4, farShin: -12, farFoot: 60, ...armsDown } };
const singleLegRdl: Scene = {
  motion: keyframes({ ...rdl(false), ik: { near: [102, ANKLE_Y] }, bend: { near: 1 }, angles: { ...rdl(false).angles, nearFoot: 90 } } as Pose, [
    { move: 1500, hold: 400, pose: rdl(true) },
    { move: 1200, hold: 400, pose: rdl(false) },
  ]),
};

// --- Core ---

// Plank seen from the side, head on the left: shoulders at `sh`, feet on the floor.
const plank = (sh: Pt, nearHand: Pt, farHand: Pt): Partial<Pose> => {
  const feet: Pt = [134, 139];
  const v = [feet[0] - sh[0], feet[1] - sh[1]], d = Math.hypot(v[0], v[1]);
  const hip: Pt = [sh[0] + (v[0] / d) * 27.7, sh[1] + (v[1] / d) * 27.7];
  const torso = towards(hip, sh);
  return { anchor: ['hip', hip], angles: { torso, head: torso + 4, nearFoot: -12, farFoot: -12 }, ik: { near: feet, far: [feet[0] - 2, feet[1]], nearHand, farHand } };
};
const FOREARM: Pt = [35, 146.5], HAND: Pt = [50, 146.5];
const plankCommando: Scene = {
  motion: keyframes({ ...plank([52, 127], FOREARM, [33, 146.5]), bend: { near: 1, far: 1, nearHand: 1, farHand: 1 } } as Pose, [
    { move: 600, hold: 100, pose: plank([52, 119], HAND, [33, 146.5]) },
    { move: 600, hold: 400, pose: plank([52, 110.5], HAND, [48, 146.5]) },
    { move: 600, hold: 100, pose: plank([52, 119], FOREARM, [48, 146.5]) },
    { move: 600, hold: 400, pose: plank([52, 127], FOREARM, [33, 146.5]) },
  ]),
};
const forearmPlank: Scene = {
  motion: hold({ ...plank([52, 127], FOREARM, [33, 146.5]), bend: { near: 1, far: 1, nearHand: 1, farHand: 1 } } as Pose, plank([52, 125.5], FOREARM, [33, 146.5])),
};

const sidePlankBase: Pose = {
  view: 'front', nearSide: 'right', anchor: ['far.elbow', [40, 145]],
  angles: { torso: -100, head: -102, nearUpperArm: 184, nearForearm: 182, farUpperArm: 2, farForearm: -90, nearThigh: 80, nearShin: 80, nearFoot: 170, farThigh: 80, farShin: 80, farFoot: 170 },
  scale: { nearFoot: 0.5, farFoot: 0.5 },
};
const sidePlank: Scene = {
  motion: hold(sidePlankBase, { angles: { torso: -98.5, nearThigh: 81.5, nearShin: 81.5, farThigh: 81.5, farShin: 81.5 } }),
};

const deadBug: Scene = {
  motion: keyframes({
    anchor: ['hip', [118, 140]],
    angles: { torso: -90, head: -96, nearUpperArm: 180, nearForearm: 180, farUpperArm: 176, farForearm: 176, nearThigh: 180, nearShin: 90, nearFoot: 180, farThigh: 176, farShin: 88, farFoot: 178 },
  }, [
    { move: 1600, hold: 300, pose: { angles: { nearUpperArm: -96, nearForearm: -94, farThigh: 104, farShin: 98, farFoot: 170 } } },
    { move: 1200, hold: 300, pose: { angles: {} } },
    { move: 1600, hold: 300, pose: { angles: { farUpperArm: -98, farForearm: -96, nearThigh: 102, nearShin: 96, nearFoot: 172 } } },
    { move: 1200, hold: 300, pose: { angles: {} } },
  ]),
};

// On all fours, facing right.
const birdDogBase: Pose = {
  anchor: ['hip', [80, 117]],
  angles: { torso: 104, head: 112, nearUpperArm: 0, nearForearm: 0, farUpperArm: 0, farForearm: 0, nearThigh: 0, nearShin: -90, nearFoot: -90, farThigh: 0, farShin: -90, farFoot: -90 },
};
const reachOut = (arm: 'near' | 'far', leg: 'near' | 'far') => ({ angles: { [`${arm}UpperArm`]: 96, [`${arm}Forearm`]: 96, [`${leg}Thigh`]: -92, [`${leg}Shin`]: -92, [`${leg}Foot`]: -92 } });
const birdDog: Scene = {
  motion: keyframes(birdDogBase, [
    { move: 1000, hold: 1800, pose: reachOut('near', 'far') },
    { move: 900, hold: 200, pose: { angles: {} } },
    { move: 1000, hold: 1800, pose: reachOut('far', 'near') },
    { move: 900, hold: 200, pose: { angles: {} } },
  ]),
};

const chop = (high: boolean): Partial<Pose> => ({
  anchor: ['hip', high ? [101, STAND_HIP + 2] : [97, 100]],
  angles: { torso: high ? 174 : 188, head: high ? 172 : 186 },
  ik: { near: [114, ANKLE_Y], far: [86, ANKLE_Y], nearHand: high ? [127, 50] : [80, 114], farHand: high ? [125, 52] : [82, 116] },
});
const woodchop: Scene = {
  motion: keyframes(frontBase({ ...chop(false), bend: { near: 1, far: -1, nearHand: 1, farHand: 1 } }), [
    { move: 900, hold: 200, pose: chop(true) },
    { move: 1600, hold: 200, pose: chop(false) },
  ]),
  dynamic: weightAtHands,
};

// --- Upper body and cardio ---

const pushups: Scene = {
  motion: keyframes({ ...plank([52, 110.5], HAND, [48, 146.5]), bend: { near: 1, far: 1, nearHand: 1, farHand: 1 } } as Pose, [
    { move: 1300, hold: 200, pose: plank([54, 131], HAND, [48, 146.5]) },
    { move: 900, hold: 300, pose: plank([52, 110.5], HAND, [48, 146.5]) },
  ]),
};

const jack = (open: boolean): Partial<Pose> => ({
  anchor: ['hip', [100, open ? STAND_HIP + 2.5 : STAND_HIP]],
  ik: open ? { near: [122, ANKLE_Y], far: [78, ANKLE_Y] } : { near: [104, ANKLE_Y], far: [96, ANKLE_Y] },
  angles: open ? { nearUpperArm: 148, nearForearm: 164, farUpperArm: -148, farForearm: -164 } : { nearUpperArm: 8, nearForearm: 4, farUpperArm: -8, farForearm: -4 },
});
const jumpingJacksMotion = (speed: number) => keyframes(frontBase(jack(false)), [
  { move: 330 * speed, hold: 60 * speed, pose: jack(true) },
  { move: 330 * speed, hold: 60 * speed, pose: jack(false) },
]);
const jumpingJacks: Scene = { motion: jumpingJacksMotion(1) };

const knee = (up: 'near' | 'far'): Partial<Pose> => {
  const down = up === 'near' ? 'far' : 'near';
  return {
    angles: {
      [`${up}Thigh`]: 84, [`${up}Shin`]: 4, [`${up}Foot`]: 60, [`${down}Thigh`]: 0, [`${down}Shin`]: 0, [`${down}Foot`]: 70,
      [`${down}UpperArm`]: 42, [`${down}Forearm`]: 120, [`${up}UpperArm`]: -36, [`${up}Forearm`]: 30,
    },
  } as Partial<Pose>;
};
const highKnees: Scene = {
  // Running on the spot: the standing leg is straight, so the hip sits a leg's length above the floor.
  motion: keyframes({ anchor: ['hip', [100, STAND_HIP - 3]], angles: { torso: 182, head: 182, ...knee('near').angles } } as Pose, [
    { move: 300, hold: 0, pose: knee('far') },
    { move: 300, hold: 0, pose: knee('near') },
  ]),
};

const pogoMotion: Motion = {
  duration: 450 * 6,
  at(ms) {
    const phase = (2 * Math.PI * ms) / 450;
    const lift = 7 * Math.max(0, Math.sin(phase)) ** 1.2;
    const give = 3 * Math.max(0, -Math.sin(phase));
    return {
      anchor: ['hip', [100, STAND_HIP - 4.5 - lift + give]],
      angles: { torso: 180, head: 180, nearThigh: give, nearShin: -give, farThigh: give - 1, farShin: -give - 1, nearFoot: 58 - lift, farFoot: 58 - lift, nearUpperArm: -12, nearForearm: 50, farUpperArm: -16, farForearm: 46 },
      lift,
    } as Pose;
  },
};
const pogo: Scene = {
  motion: pogoMotion,
  dynamic: (p) => { const lift = (p as Pose & { lift: number }).lift; return { back: shadow(100, 14 - lift, 1 - lift / 12) }; },
};

export const SCENES: Record<string, Scene> = {
  copenhagen_plank: copenhagen,
  calves_standing_slow: calvesStanding,
  calves_seated: calvesSeated,
  squat_sumo: squatSumo,
  lateral_lunges: lateralLunges,
  plank_commando: plankCommando,
  woodchop,
  squat_classic: squat,
  alternating_lunges: lunges,
  wall_sit: wallSit,
  step_up: stepUp,
  pushups,
  jumping_jacks: jumpingJacks,
  high_knees: highKnees,
  pogo_jumps: pogo,
  calf_raise_isometric_low: calfRaiseLow,
  sauts_corde_bas: ropeScene('joint'),
  rope_running_step: ropeScene('running'),
  rope_single_leg: ropeScene('single'),
  marche_talons_inversion: heelWalking,
  single_leg_balance: balance,
  shift_squat_goblet: shiftSquat,
  single_leg_bridge: singleLegBridge,
  hamstring_bridge_chair: hamstringBridge,
  side_lying_abduction: abduction,
  single_leg_rdl: singleLegRdl,
  bulgarian_split_squat: bulgarian,
  side_plank: sidePlank,
  dead_bug: deadBug,
  bird_dog: birdDog,
  // Warm-up moves reuse a gentler version of a close exercise.
  warmup_1: { motion: squatMotion(0.55) },
  warmup_2: lateralLunges,
  warmup_3: forearmPlank,
  warmup_4: { motion: jumpingJacksMotion(1.4) },
};

const tops = new WeakMap<Scene, number>();
// Top of the frame: just above the highest point the body and the scenery reach.
// Floor exercises get a short, wide frame instead of a lot of empty space.
export function sceneTop(scene: Scene): number {
  let top = tops.get(scene);
  if (top === undefined) {
    let min = scene.props?.(skeleton(scene.motion.at(0))).top ?? FLOOR;
    for (let i = 0; i < 48; i++) {
      const j = skeleton(scene.motion.at((i / 48) * scene.motion.duration));
      for (const k in j) min = Math.min(min, j[k][1] - (k === 'head' ? 10 : 7));
    }
    top = Math.max(0, Math.min(90, Math.floor(min / 10) * 10));
    tops.set(scene, top);
  }
  return top;
}

// Inner SVG of one frame, in a 200 x 160 box (see sceneTop for the visible part).
export function sceneFrame(scene: Scene, ms: number, cache: { props?: Props }): string {
  const pose = scene.motion.at(ms);
  const joints = skeleton(pose);
  if (!cache.props) cache.props = scene.props?.(skeleton(scene.motion.at(0))) ?? {};
  const dyn = scene.dynamic?.(pose, joints, ms) ?? {};
  return (cache.props.back ?? '') + floor() + (dyn.back ?? '') + figure(pose, joints) + (dyn.front ?? '') + (cache.props.front ?? '');
}
