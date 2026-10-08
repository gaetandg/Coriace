import { Joints, Pose, Pt, angleTo, figure, skeleton } from './mannequin';
import { Key, Motion, hold, keyframes } from './motion';
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
  // Moment shown as a still thumbnail, when the first key pose isn't the most telling.
  thumb?: number;
}

const STAND_HIP = ANKLE_Y - 55 + 0.5;
const armsDown = { nearUpperArm: 4, nearForearm: 8, farUpperArm: 0, farForearm: 4 };
const flatFeet = { nearFoot: 90, farFoot: 90 };
// Torso angle that puts the shoulders on `shoulder` from a hip at `hip`.
const towards = (hip: Pt, shoulder: Pt) => angleTo(hip, shoulder);
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
    anchor: ['hip', [80, 117]], bend: { near: 1, far: 1, nearHand: 1, farHand: 1 },
    angles: { torso: 172, head: 176, ...flatFeet }, ik: { nearHand: [104, 104], farHand: [102, 104] },
  }, [
    { move: 900, hold: 500, pose: seatedRaise(true) },
    { move: 1300, hold: 300, pose: seatedRaise(false) },
  ]),
  props: () => ({ back: chair(60, 126, 'left'), top: 86 }),
  // The weight rests across the thighs, just behind the knees.
  dynamic: (_p, j) => ({ front: kettlebell([j['near.knee'][0] - 4, j['near.knee'][1] - 11]) }),
};

const lowCalves = (raised: boolean): Partial<Pose> => ({
  anchor: ['hip', raised ? [98, 123] : [96, 128]],
  ik: raised ? { near: [110.5, 139.8], far: [108.5, 139.8] } : { near: [108, ANKLE_Y], far: [106, ANKLE_Y] },
  angles: raised ? { nearFoot: 55, farFoot: 55 } : flatFeet,
});
const calfRaiseLow: Scene = {
  motion: keyframes({
    anchor: ['hip', [96, 128]], bend: { near: 1, far: 1 },
    angles: { torso: 146, head: 162, nearUpperArm: 96, nearForearm: 96, farUpperArm: 92, farForearm: 92, ...flatFeet },
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
      const tucked: 'near' | 'far' | null = kind === 'single' ? 'near' : null;
      const standing = tucked === 'near' ? 'far' : null;
      if (tucked) {
        a.nearThigh = 6;
        a.nearShin = 2;
        scale.nearThigh = 0.5;
      }
      if (kind === 'running') {
        // One foot per pass: the near foot is up at even passes, the far one at odd passes.
        const half = Math.cos(turn / 2);
        scale.nearThigh = 1 - 0.45 * Math.max(0, half) ** 1.5;
        scale.farThigh = 1 - 0.45 * Math.max(0, -half) ** 1.5;
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

// Walking on the heels on the spot, like on a treadmill: the planted foot slides back along
// the floor while the other one swings forward through the air.
const heelStep = (nearAt: 'front' | 'mid' | 'back' | 'air', farAt: 'front' | 'mid' | 'back' | 'air', nearArmFwd: boolean): Partial<Pose> => {
  const at = { front: [111, 144.7], mid: [100, 144.7], back: [89, 144.7], air: [100, 137] } as Record<string, Pt>;
  return {
    ik: { near: at[nearAt], far: at[farAt] },
    angles: { nearUpperArm: nearArmFwd ? 24 : -24, nearForearm: nearArmFwd ? 50 : 0, farUpperArm: nearArmFwd ? -24 : 24, farForearm: nearArmFwd ? 0 : 50 },
  };
};
const heelWalking: Scene = {
  motion: keyframes({
    anchor: ['hip', [100, 90.5]], bend: { near: 1, far: 1 },
    angles: { torso: 180, head: 180, nearFoot: 125, farFoot: 125, ...armsDown },
  }, [
    { move: 380, hold: 0, pose: heelStep('front', 'back', false) },
    { move: 380, hold: 0, pose: heelStep('mid', 'air', true) },
    { move: 380, hold: 0, pose: heelStep('back', 'front', true) },
    { move: 380, hold: 0, pose: heelStep('air', 'mid', false) },
  ]),
};

const balance: Scene = {
  motion: hold({
    anchor: ['hip', [100, STAND_HIP]], ik: { near: [101, ANKLE_Y] }, bend: { near: 1 },
    angles: { torso: 180, head: 180, nearFoot: 90, farThigh: 12, farShin: -62, farFoot: -20, nearUpperArm: 34, nearForearm: 54, farUpperArm: 28, farForearm: 48 },
  }, { anchor: ['hip', [101.5, STAND_HIP]], angles: { torso: 177, nearUpperArm: 30, farUpperArm: 32 } }, 2600),
};

// --- Adductors ---

const sumoDown = (down: boolean): Partial<Pose> => ({ anchor: ['hip', [100, down ? 121 : STAND_HIP + 1]], ik: { near: [119, ANKLE_Y], far: [81, ANKLE_Y] }, hands: [0, 16] });
const squatSumo: Scene = {
  // Feet flat, toes turned out.
  motion: keyframes(frontBase({ ...sumoDown(false), angles: { torso: 180, head: 180, nearFoot: 90, farFoot: -90 }, scale: { nearFoot: 0.7, farFoot: 0.7 } }), [
    { move: 1500, hold: 300, pose: sumoDown(true) },
    { move: 1200, hold: 400, pose: sumoDown(false) },
  ]),
};

const lateral = (side: 'near' | 'far' | null): Partial<Pose> => {
  const hip: Pt = side === 'near' ? [130, 102] : side === 'far' ? [70, 102] : [100, STAND_HIP];
  return {
    anchor: ['hip', hip],
    ik: { near: side === 'near' ? [150, ANKLE_Y] : [108, ANKLE_Y], far: side === 'far' ? [50, ANKLE_Y] : [92, ANKLE_Y] }, hands: [0, 16],
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

const goblet = (x: number, y: number): Partial<Pose> => ({ anchor: ['hip', [x, y]], ik: { near: [114, ANKLE_Y], far: [86, ANKLE_Y] }, hands: [0, 16] });
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
  angles: { torso: -74, head: -78, nearUpperArm: 184, nearForearm: 182, farUpperArm: 2, farForearm: -90, nearThigh: 104, nearShin: 104, nearFoot: 178, farThigh: 70, farShin: 70, farFoot: 160 },
  scale: { nearFoot: 0.6, farFoot: 0.6 },
};
const copenhagen: Scene = {
  motion: hold(copenhagenBase, { angles: { torso: -72.5, nearThigh: 103, nearShin: 103 } }),
  props: j => { const [x, y] = j['near.ankle']; return { back: chair(Math.round(x - 12), Math.round(y + 3.5), 'right'), top: y + 3.5 - 40 }; },
};

// --- Thighs ---

const squatPose = (down: boolean, depth = 1): Partial<Pose> => ({
  anchor: ['hip', down ? [100 - 12 * depth, STAND_HIP + 39 * depth] : [100, STAND_HIP]],
  angles: down ? { torso: 180 - 40 * depth, head: 180 - 18 * depth, nearUpperArm: 98, nearForearm: 96, farUpperArm: 94, farForearm: 92 } : { torso: 180, head: 182, ...armsDown },
});
const squatMotion = (depth: number) => keyframes({
  anchor: ['hip', [100, STAND_HIP]], ik: { near: [101, ANKLE_Y], far: [99, ANKLE_Y] }, bend: { near: 1, far: 1 },
  angles: { torso: 180, head: 182, ...armsDown, ...flatFeet },
}, [
  { move: 1700, hold: 250, pose: squatPose(true, depth) },
  { move: 1300, hold: 500, pose: squatPose(false) },
]);
const squat: Scene = { motion: squatMotion(1) };

// Forward lunge: one foot steps forward through the air, the other stays where it is and its heel rises.
const lungeKeys = (front: 'near' | 'far'): Key[] => {
  const back = front === 'near' ? 'far' : 'near';
  const stay: Pt = front === 'near' ? [99, ANKLE_Y] : [101, ANKLE_Y];
  const heelUp: Pt = [stay[0] + 11 - 11 * Math.sin((52 * Math.PI) / 180), ANKLE_Y - 11 * Math.cos((52 * Math.PI) / 180) + 1];
  const pose = (hip: Pt, frontFoot: Pt, backFoot: Pt, backAngle: number): Partial<Pose> => ({
    anchor: ['hip', hip], ik: { [front]: frontFoot, [back]: backFoot }, angles: { [`${front}Foot`]: 90, [`${back}Foot`]: backAngle },
  } as Partial<Pose>);
  return [
    { move: 400, hold: 0, pose: pose([110, 92], [126, 135], stay, 90) },
    { move: 350, hold: 150, pose: pose([118, 97], [140, ANKLE_Y], stay, 90) },
    { move: 900, hold: 300, pose: pose([120, 114], [140, ANKLE_Y], heelUp, 52) },
    { move: 700, hold: 100, pose: pose([118, 97], [140, ANKLE_Y], stay, 90) },
    { move: 350, hold: 0, pose: pose([110, 92], [126, 135], stay, 90) },
    { move: 350, hold: 300, pose: pose([100, STAND_HIP], [front === 'near' ? 101 : 99, ANKLE_Y], stay, 90) },
  ];
};
const lunges: Scene = {
  thumb: 1800,
  motion: keyframes({
    anchor: ['hip', [100, STAND_HIP]], ik: { near: [101, ANKLE_Y], far: [99, ANKLE_Y] }, bend: { near: 1, far: 1 },
    angles: { torso: 180, head: 180, ...armsDown, ...flatFeet },
  }, [...lungeKeys('near'), ...lungeKeys('far')]),
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

// Plank seen from the side, head on the left, toes fixed on the floor. The body stays straight:
// the shoulders sit on a circle around the ankles, at the length of legs plus trunk.
const ANKLES: Pt = [134, 140];
const BODY_LINE = 55 + 27.7;
const plank = (shoulderY: number, nearHand: Pt, farHand: Pt): Partial<Pose> => {
  const sh: Pt = [ANKLES[0] - Math.sqrt(BODY_LINE ** 2 - (ANKLES[1] - shoulderY) ** 2), shoulderY];
  const hip: Pt = [sh[0] + (ANKLES[0] - sh[0]) * (27.7 / BODY_LINE), sh[1] + (ANKLES[1] - sh[1]) * (27.7 / BODY_LINE)];
  const torso = towards(hip, sh);
  return { anchor: ['hip', hip], angles: { torso, head: torso + 4, nearFoot: -14, farFoot: -14 }, ik: { near: ANKLES, far: [ANKLES[0] - 1, ANKLES[1]], nearHand, farHand } };
};
const FOREARM_X = 36, HAND_X = 53;
const forearm = (x = 0): Pt => [FOREARM_X + x, 146.5];
const hand = (x = 0): Pt => [HAND_X + x, 146.5];
// Lowering onto a forearm: the hand comes off the floor while the elbow goes down, then the forearm lands flat.
const lifted = (x = 0): Pt => [HAND_X - 9 + x, 136];
const plankBends = { bend: { near: 1, far: 1, nearHand: 1, farHand: 1 } };
const plankCommando: Scene = {
  thumb: 2000,
  motion: keyframes({ ...plank(127, forearm(), forearm(-2)), ...plankBends } as Pose, [
    { move: 300, hold: 0, pose: plank(126, lifted(), forearm(-2)) },
    { move: 300, hold: 0, pose: plank(124, hand(), forearm(-2)) },
    { move: 350, hold: 100, pose: plank(119, hand(), forearm(-2)) },
    { move: 300, hold: 0, pose: plank(118, hand(), lifted(-2)) },
    { move: 300, hold: 0, pose: plank(116, hand(), hand(-2)) },
    { move: 350, hold: 400, pose: plank(110.5, hand(), hand(-2)) },
    { move: 350, hold: 0, pose: plank(116, lifted(), hand(-2)) },
    { move: 350, hold: 100, pose: plank(119, forearm(), hand(-2)) },
    { move: 350, hold: 0, pose: plank(124, forearm(), lifted(-2)) },
    { move: 350, hold: 400, pose: plank(127, forearm(), forearm(-2)) },
  ]),
};

const sidePlankBase: Pose = {
  view: 'front', nearSide: 'right', anchor: ['far.elbow', [40, 145]],
  angles: { torso: -106, head: -108, nearUpperArm: 184, nearForearm: 182, farUpperArm: 2, farForearm: -90, nearThigh: 74, nearShin: 74, nearFoot: 164, farThigh: 74, farShin: 74, farFoot: 164 },
  scale: { nearFoot: 0.5, farFoot: 0.5 },
};
const sidePlank: Scene = {
  // Tilted so the bottom foot rests on the floor; breathing barely moves it.
  motion: hold(sidePlankBase, { angles: { torso: -105.2, nearThigh: 74.8, nearShin: 74.8, farThigh: 74.8, farShin: 74.8 } }),
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
  anchor: ['hip', high ? [101, STAND_HIP + 2] : [97, 99]],
  angles: { torso: high ? 174 : 187, head: high ? 174 : 184 },
  ik: { near: [114, ANKLE_Y], far: [86, ANKLE_Y] },
  hands: high ? [19, -22] : [-18, 23],
});
const woodchop: Scene = {
  // Elbow sides chosen so both elbows stay down from the low to the high position.
  motion: keyframes(frontBase({ ...chop(false), bend: { near: 1, far: -1, nearHand: 1, farHand: -1 } }), [
    { move: 900, hold: 200, pose: chop(true) },
    { move: 1600, hold: 200, pose: chop(false) },
  ]),
  dynamic: weightAtHands,
};

// --- Upper body and cardio ---

const pushups: Scene = {
  motion: keyframes({ ...plank(110.5, hand(), hand(-2)), ...plankBends } as Pose, [
    { move: 1300, hold: 200, pose: plank(132, hand(), hand(-2)) },
    { move: 900, hold: 300, pose: plank(110.5, hand(), hand(-2)) },
  ]),
};

const jack = (open: boolean): Partial<Pose> => ({
  anchor: ['hip', [100, open ? STAND_HIP + 2.5 : STAND_HIP]],
  ik: open ? { near: [122, ANKLE_Y], far: [78, ANKLE_Y] } : { near: [104, ANKLE_Y], far: [96, ANKLE_Y] },
  angles: open ? { nearUpperArm: 148, nearForearm: 164, farUpperArm: -148, farForearm: -164 } : { nearUpperArm: 8, nearForearm: 4, farUpperArm: -8, farForearm: -4 },
});
// In the air between the two positions: feet off the floor, arms level.
const jackAir: Partial<Pose> = {
  anchor: ['hip', [100, STAND_HIP - 8]], ik: { near: [113, ANKLE_Y - 9], far: [87, ANKLE_Y - 9] },
  angles: { nearUpperArm: 90, nearForearm: 96, farUpperArm: -90, farForearm: -96 },
};
const jumpingJacksMotion = (speed: number) => keyframes(frontBase(jack(false)), [
  { move: 170 * speed, hold: 0, pose: jackAir },
  { move: 170 * speed, hold: 90 * speed, pose: jack(true) },
  { move: 170 * speed, hold: 0, pose: jackAir },
  { move: 170 * speed, hold: 90 * speed, pose: jack(false) },
]);
const jumpingJacks: Scene = { motion: jumpingJacksMotion(1), thumb: 340 };

const knee = (up: 'near' | 'far'): Partial<Pose> => {
  const down = up === 'near' ? 'far' : 'near';
  return {
    anchor: ['hip', [100, STAND_HIP - 3]],
    angles: {
      [`${up}Thigh`]: 90, [`${up}Shin`]: 0, [`${up}Foot`]: 75, [`${down}Thigh`]: 0, [`${down}Shin`]: 0, [`${down}Foot`]: 62,
      [`${down}UpperArm`]: 35, [`${down}Forearm`]: 125, [`${up}UpperArm`]: -35, [`${up}Forearm`]: 55,
    },
  } as Partial<Pose>;
};
// Between two knees, a small jump: both feet leave the floor.
const bothDown: Partial<Pose> = {
  anchor: ['hip', [100, STAND_HIP - 10]],
  angles: { nearThigh: 6, nearShin: -6, nearFoot: 62, farThigh: 4, farShin: -8, farFoot: 62, nearUpperArm: 0, nearForearm: 90, farUpperArm: 0, farForearm: 90 },
};
const highKnees: Scene = {
  thumb: 280,
  dynamic: (p) => { const lift = Math.max(0, STAND_HIP - 3 - p.anchor[1][1]); return { back: shadow(100, 16 - lift, 1 - lift / 14) }; },
  // Running on the spot: the standing leg is straight, so the hip sits a leg's length above the floor.
  motion: keyframes({ anchor: ['hip', [100, STAND_HIP - 3]], angles: { torso: 182, head: 182, ...knee('near').angles } } as Pose, [
    { move: 130, hold: 0, pose: bothDown },
    { move: 150, hold: 120, pose: knee('far') },
    { move: 130, hold: 0, pose: bothDown },
    { move: 150, hold: 120, pose: knee('near') },
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

// --- Descents, hills and reactivity ---

// Standing on a step on the near leg, the far foot lowered slowly to touch the floor in front.
const stepDown: Scene = {
  motion: keyframes({
    anchor: ['hip', [108, 66.5]], ik: { near: [110, 121.5], far: [122, 112] }, bend: { near: 1, far: 1 },
    angles: { torso: 180, head: 182, nearFoot: 90, farFoot: 100, nearUpperArm: 30, nearForearm: 70, farUpperArm: 26, farForearm: 66 },
  }, [
    { move: 2600, hold: 250, pose: { anchor: ['hip', [103, 88]], ik: { near: [110, 121.5], far: [136, 141] }, angles: { torso: 168, head: 172, farFoot: 120 } } },
    { move: 1100, hold: 350, pose: {} },
  ]),
  props: () => ({ back: step(84, 124, 126) }),
};

const tempoSquat: Scene = {
  motion: keyframes({
    anchor: ['hip', [100, STAND_HIP]], ik: { near: [101, ANKLE_Y], far: [99, ANKLE_Y] }, bend: { near: 1, far: 1 },
    angles: { torso: 180, head: 182, ...armsDown, ...flatFeet },
  }, [
    { move: 4000, hold: 300, pose: squatPose(true, 0.85) },
    { move: 1000, hold: 500, pose: squatPose(false) },
  ]),
};

// Backward lunge: the back foot steps back through the air, the front foot stays put.
const reverseLungeKeys = (back: 'near' | 'far'): Key[] => {
  const front = back === 'near' ? 'far' : 'near';
  const stay: Pt = back === 'near' ? [99, ANKLE_Y] : [101, ANKLE_Y];
  const toe: Pt = [64 + 11 * Math.sin((52 * Math.PI) / 180) - 11, ANKLE_Y - 11 * Math.cos((52 * Math.PI) / 180) + 1];
  const pose = (hip: Pt, backFoot: Pt, backAngle: number): Partial<Pose> => ({
    anchor: ['hip', hip], ik: { [front]: stay, [back]: backFoot }, angles: { [`${front}Foot`]: 90, [`${back}Foot`]: backAngle },
  } as Partial<Pose>);
  return [
    { move: 450, hold: 0, pose: pose([94, 92], [80, 136], 70) },
    { move: 400, hold: 100, pose: pose([90, 98], [66, 141], 52) },
    { move: 900, hold: 300, pose: pose([86, 114], toe, 52) },
    { move: 800, hold: 0, pose: pose([90, 98], [66, 141], 52) },
    { move: 450, hold: 300, pose: pose([100, STAND_HIP], [back === 'near' ? 101 : 99, ANKLE_Y], 90) },
  ];
};
const reverseLunges: Scene = {
  thumb: 1750,
  motion: keyframes({
    anchor: ['hip', [100, STAND_HIP]], ik: { near: [101, ANKLE_Y], far: [99, ANKLE_Y] }, bend: { near: 1, far: 1 },
    angles: { torso: 180, head: 180, ...armsDown, ...flatFeet },
  }, [...reverseLungeKeys('near'), ...reverseLungeKeys('far')]),
};

// Feet together, small hops from one side of a line to the other (front view).
const lateralHops: Scene = {
  motion: {
    duration: 1400,
    still: 350,
    at(ms) {
      const t = (ms % 700) / 700, side = Math.floor(ms / 700) % 2 ? -1 : 1;
      const x = 100 + side * 12 * Math.cos(Math.PI * t);
      const lift = 7 * Math.sin(Math.PI * t);
      return frontBase({
        anchor: ['hip', [x, STAND_HIP - 1 - lift]], ik: { near: [x + 4, ANKLE_Y - lift], far: [x - 4, ANKLE_Y - lift] },
        angles: { torso: 180 - side * 4 * Math.sin(Math.PI * t), head: 180, nearUpperArm: 20, nearForearm: 60, farUpperArm: -20, farForearm: -60, nearFoot: 90, farFoot: -90 },
        lift,
      } as Partial<Pose>);
    },
  },
  dynamic: (p, j) => ({ back: `<rect x="99" y="146" width="2" height="5" fill="#C9A88D"/>` + shadow((j['near.ankle'][0] + j['far.ankle'][0]) / 2, 16 - (p as Pose & { lift: number }).lift, 1) }),
};

// Squat, jump with the arms swinging up, land back into the squat.
const squatJumps: Scene = {
  thumb: 1300,
  motion: keyframes({
    anchor: ['hip', [100, STAND_HIP]], ik: { near: [101, ANKLE_Y], far: [99, ANKLE_Y] }, bend: { near: 1, far: 1 },
    angles: { torso: 180, head: 182, ...armsDown, ...flatFeet },
  }, [
    { move: 700, hold: 100, pose: { ...squatPose(true, 0.8), angles: { torso: 150, head: 168, nearUpperArm: -30, nearForearm: -20, farUpperArm: -34, farForearm: -24 } } },
    { move: 350, hold: 0, pose: { anchor: ['hip', [100, STAND_HIP - 14]], ik: { near: [101, ANKLE_Y - 13], far: [99, ANKLE_Y - 13] }, angles: { torso: 182, head: 182, nearUpperArm: 140, nearForearm: 150, farUpperArm: 136, farForearm: 146, nearFoot: 60, farFoot: 60 } } },
    { move: 350, hold: 0, pose: { ...squatPose(true, 0.6), angles: { torso: 158, head: 170, nearUpperArm: 60, nearForearm: 80, farUpperArm: 56, farForearm: 76, ...flatFeet } } },
    { move: 600, hold: 400, pose: { anchor: ['hip', [100, STAND_HIP]], angles: { torso: 180, head: 182, ...armsDown } } },
  ]),
};

// --- Warm-up and cool-down ---

// Hip circles, hands on the hips, front view.
const hipCircles: Scene = {
  motion: {
    duration: 2400,
    still: 0,
    at(ms) {
      const a = (2 * Math.PI * ms) / 2400;
      const hip: Pt = [100 + 6 * Math.cos(a), STAND_HIP + 2 + 1.5 * Math.sin(a)];
      return frontBase({
        anchor: ['hip', hip], ik: { near: [109, ANKLE_Y], far: [91, ANKLE_Y], nearHand: [hip[0] + 10, hip[1] - 3], farHand: [hip[0] - 10, hip[1] - 3] },
        bend: { near: 1, far: -1, nearHand: 1, farHand: -1 },
        angles: { torso: 180 - 5 * Math.cos(a), head: 180 },
      });
    },
  },
};

// One hand on the wall, the near leg swings forward and back.
const legSwings: Scene = {
  motion: keyframes({
    anchor: ['hip', [100, STAND_HIP]], ik: { far: [100, ANKLE_Y], farHand: [128, 66] }, bend: { far: 1, farHand: -1 },
    angles: { torso: 180, head: 180, nearThigh: -30, nearShin: -36, nearFoot: 70, farFoot: 90, nearUpperArm: -20, nearForearm: 10 },
  }, [
    { move: 650, hold: 0, pose: { angles: { nearThigh: 62, nearShin: 52, nearFoot: 130, nearUpperArm: -30 } } },
    { move: 650, hold: 0, pose: { angles: { nearThigh: -30, nearShin: -36, nearFoot: 70, nearUpperArm: 10 } } },
  ]),
  props: () => ({ back: wall(134, 'right') }),
};

// Calf raises on the spot, then small bounces.
const calvesWarmup: Scene = {
  motion: {
    duration: 3600,
    still: 500,
    at(ms) {
      let foot = 90, lift = 0;
      if (ms < 2000) foot = 90 - 35 * Math.sin((Math.PI * (ms % 1000)) / 1000);
      else { const t = (ms - 2000) % 400 / 400; lift = 4 * Math.sin(Math.PI * t); foot = 62 - lift; }
      return {
        anchor: ['near.toe', [111, ANKLE_Y - lift]],
        angles: { torso: 180, head: 180, nearThigh: 0, nearShin: 0, farThigh: 0, farShin: 0, nearFoot: foot, farFoot: foot, ...armsDown, nearForearm: 30, farForearm: 26 },
      } as Pose;
    },
  },
};

// Calf stretch against the wall: back leg straight, heel down.
const calfStretch: Scene = {
  motion: hold({
    anchor: ['hip', [108, 96]], ik: { near: [124, ANKLE_Y], far: [78, ANKLE_Y], nearHand: [143, 66], farHand: [141, 68] },
    bend: { near: 1, far: 1, nearHand: -1, farHand: -1 },
    angles: { torso: 158, head: 160, ...flatFeet },
  }, { anchor: ['hip', [110, 96]] }, 4000),
  props: () => ({ back: wall(148, 'right') }),
};

// Half kneeling: back knee on the floor, hips pushed forward.
const hipFlexorStretch: Scene = {
  motion: hold({
    anchor: ['hip', [102, 118]], ik: { near: [128, ANKLE_Y], nearHand: [110, 111], farHand: [108, 111] },
    bend: { near: 1, nearHand: -1, farHand: -1 },
    angles: { torso: 180, head: 180, nearFoot: 90, farThigh: -12, farShin: -88, farFoot: -96 },
  }, { anchor: ['hip', [105, 118.5]], angles: { farThigh: -18 } }, 4000),
};

const adductorStretch: Scene = {
  motion: hold(frontBase({ ...lateral('near'), anchor: ['hip', [130, 104]] }), { anchor: ['hip', [131, 106]] }, 4000),
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
  step_down: stepDown,
  tempo_squat: tempoSquat,
  reverse_lunges: reverseLunges,
  lateral_hops: lateralHops,
  squat_jumps: squatJumps,
  // Warm-up and cool-down.
  warmup_mobility: hipCircles,
  warmup_leg_swings: legSwings,
  warmup_squat: { motion: squatMotion(0.55) },
  warmup_lateral: lateralLunges,
  warmup_lunge: lunges,
  warmup_calves: calvesWarmup,
  warmup_knees: highKnees,
  cooldown_calves: calfStretch,
  cooldown_hip_flexors: hipFlexorStretch,
  cooldown_adductors: adductorStretch,
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

// Still frame for a thumbnail, framed tightly around the body, 5:4, resting on the floor.
export function sceneThumb(scene: Scene): { viewBox: string; svg: string } {
  const ms = scene.thumb ?? scene.motion.still ?? 0;
  const j = skeleton(scene.motion.at(ms));
  const xs = Object.values(j).map(p => p[0]), ys = Object.values(j).map(p => p[1]);
  const bottom = FLOOR + 4;
  let x0 = Math.min(...xs) - 12, x1 = Math.max(...xs) + 12, y0 = Math.min(...ys) - 12;
  let w = x1 - x0, h = bottom - y0;
  if (w / h < 1.25) { const extra = h * 1.25 - w; x0 -= extra / 2; w = h * 1.25; }
  else { h = w / 1.25; y0 = bottom - h; }
  return { viewBox: `${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`, svg: sceneFrame(scene, ms, {}) };
}

// Inner SVG of one frame, in a 200 x 160 box (see sceneTop for the visible part).
export function sceneFrame(scene: Scene, ms: number, cache: { props?: Props }): string {
  const pose = scene.motion.at(ms);
  const joints = skeleton(pose);
  if (!cache.props) cache.props = scene.props?.(skeleton(scene.motion.at(0))) ?? {};
  const dyn = scene.dynamic?.(pose, joints, ms) ?? {};
  return (cache.props.back ?? '') + floor() + (dyn.back ?? '') + figure(pose, joints) + (dyn.front ?? '') + (cache.props.front ?? '');
}
