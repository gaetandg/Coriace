// 2D mannequin: a skeleton posed with absolute angles, drawn as tapered capsules.
// Angle convention, in degrees: 0 points down, 90 right, 180 up, -90 left.

export type Pt = [number, number];
export type Side = 'near' | 'far';

export interface Pose {
  view?: 'side' | 'front';
  // Front view: which side of the screen the near limbs are on. Side view: ignored.
  nearSide?: 'left' | 'right';
  // Both sides drawn in the same tone (front view, nothing hidden).
  sameTone?: boolean;
  angles: Record<string, number>;
  // Shortens a bone, e.g. a foot seen from the front.
  scale?: Record<string, number>;
  // Moves the figure so this joint lands on this point.
  anchor: [string, Pt];
  // Planted hands and feet: the knee or elbow is placed to reach them.
  // `bend` picks the side the joint folds to (1 or -1).
  ik?: Partial<Record<'near' | 'far' | 'nearHand' | 'farHand', Pt>>;
  bend?: Partial<Record<'near' | 'far' | 'nearHand' | 'farHand', number>>;
  // The far leg stays in line with the near thigh (single-leg bridges).
  farLegFollowsNearThigh?: boolean;
  // Both hands together, at this offset from the middle of the shoulders (holding a weight, clasped).
  hands?: Pt;
}

export const BODY = { torso: 33, neck: 5.5, headR: 7.8, upperArm: 19, forearm: 17, thigh: 28, shin: 27, foot: 11 };
// Shoulders and hips spread apart in front view, almost overlap from the side.
const SPREAD = { front: { shoulder: 10, hip: 6.5 }, side: { shoulder: 1.5, hip: 1 } };

const rad = (a: number) => (a * Math.PI) / 180;
export const dir = (a: number): Pt => [Math.sin(rad(a)), Math.cos(rad(a))];
const add = (p: Pt, a: number, l: number): Pt => [p[0] + dir(a)[0] * l, p[1] + dir(a)[1] * l];
export const angleTo = (from: Pt, to: Pt) => (Math.atan2(to[0] - from[0], to[1] - from[1]) * 180) / Math.PI;
export const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// Two-bone reach: angles of the upper and lower bone so the chain ends on `target`.
function reach(root: Pt, target: Pt, l1: number, l2: number, bend: number): [number, number] {
  const d = Math.min(Math.max(Math.hypot(target[0] - root[0], target[1] - root[1]), Math.abs(l1 - l2) + 0.01), l1 + l2 - 0.01);
  const base = angleTo(root, target);
  const phi = (Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)) * 180) / Math.PI;
  const upper = base + bend * phi;
  return [upper, angleTo(add(root, upper, l1), target)];
}

export type Joints = Record<string, Pt>;

export function skeleton(pose: Pose): Joints {
  const L = BODY, A = { ...pose.angles }, s = pose.scale || {};
  const len = (bone: string, l: number) => l * (s[bone] ?? 1);
  // Joints are first computed around a hip at the origin, then the anchor moves them all.
  const anchorName = pose.anchor[0];
  const offset: Pt = anchorName === 'hip' ? pose.anchor[1] : [0, 0];
  const hip: Pt = offset;
  const spread = SPREAD[pose.view || 'side'];
  const acrossAngle = A.torso + (pose.nearSide === 'left' ? 90 : -90);
  const j: Joints = { hip };
  j.chest = add(hip, A.torso, L.torso * 0.86);
  j.neck = add(hip, A.torso, L.torso);
  j.head = add(j.neck, A.head ?? A.torso, L.neck + L.headR);
  const shoulderMid = add(hip, A.torso, L.torso * 0.84);
  for (const side of ['near', 'far'] as Side[]) {
    const sign = side === 'near' ? 1 : -1;
    const shoulder = add(shoulderMid, acrossAngle, spread.shoulder * sign);
    const hipJoint = add(hip, acrossAngle, spread.hip * sign);
    const hand = pose.hands
      ? [shoulderMid[0] + pose.hands[0] + 1.5 * sign, shoulderMid[1] + pose.hands[1]] as Pt
      : pose.ik?.[`${side}Hand`];
    if (hand) [A[`${side}UpperArm`], A[`${side}Forearm`]] = reach(shoulder, hand, L.upperArm, L.forearm, pose.bend?.[`${side}Hand`] ?? 1);
    const foot = pose.ik?.[side];
    if (foot) [A[`${side}Thigh`], A[`${side}Shin`]] = reach(hipJoint, foot, L.thigh, L.shin, pose.bend?.[side] ?? 1);
    // Lying on the back: the raised foot points its toes to the ceiling, square to the leg.
    if (side === 'far' && pose.farLegFollowsNearThigh) { A.farThigh = A.farShin = A.nearThigh; A.farFoot = A.nearThigh + 90; }
    const elbow = add(shoulder, A[`${side}UpperArm`], len(`${side}UpperArm`, L.upperArm));
    const knee = add(hipJoint, A[`${side}Thigh`], len(`${side}Thigh`, L.thigh));
    const ankle = add(knee, A[`${side}Shin`], len(`${side}Shin`, L.shin));
    Object.assign(j, {
      [`${side}.shoulder`]: shoulder,
      [`${side}.hip`]: hipJoint,
      [`${side}.elbow`]: elbow,
      [`${side}.hand`]: add(elbow, A[`${side}Forearm`], len(`${side}Forearm`, L.forearm)),
      [`${side}.knee`]: knee,
      [`${side}.ankle`]: ankle,
      [`${side}.toe`]: add(ankle, A[`${side}Foot`], len(`${side}Foot`, L.foot)),
      [`${side}.heel`]: add(ankle, A[`${side}Foot`] + 180, 3),
    });
  }
  if (anchorName !== 'hip') {
    const target = pose.anchor[1], from = j[anchorName];
    const dx = target[0] - from[0], dy = target[1] - from[1];
    for (const k in j) j[k] = [j[k][0] + dx, j[k][1] + dy];
  }
  return j;
}

const f = (n: number) => n.toFixed(1);

// Union of two circles and their outer tangents: a bone thicker at one end.
export function capsule(p1: Pt, r1: number, p2: Pt, r2: number, fill: string): string {
  const dx = p2[0] - p1[0], dy = p2[1] - p1[1], d = Math.hypot(dx, dy) || 0.01;
  const t = Math.atan2(dy, dx), a = Math.acos(Math.max(-1, Math.min(1, (r1 - r2) / d)));
  const P = (c: Pt, r: number, ang: number) => `${f(c[0] + r * Math.cos(ang))},${f(c[1] + r * Math.sin(ang))}`;
  return `<path d="M${P(p1, r1, t + a)} L${P(p2, r2, t + a)} L${P(p2, r2, t - a)} L${P(p1, r1, t - a)} Z" fill="${fill}"/>`
    + `<circle cx="${f(p1[0])}" cy="${f(p1[1])}" r="${r1}" fill="${fill}"/><circle cx="${f(p2[0])}" cy="${f(p2[1])}" r="${r2}" fill="${fill}"/>`;
}

export const PALETTE = { near: '#3B140C', far: '#93685B', shoe: '#A13D2B', shoeFar: '#C98A77', halo: '#F6EBDD' };

// Front torso as a rounded outline: broad shoulders, narrower waist, hips.
function frontTorso(pose: Pose, j: Joints, c: string): string {
  const L = BODY.torso, up = dir(pose.angles.torso), across = dir(pose.angles.torso + 90);
  const at = (h: number, w: number): Pt => [j.hip[0] + up[0] * L * h + across[0] * w, j.hip[1] + up[1] * L * h + across[1] * w];
  const pts = [at(-0.08, 7.5), at(0.3, 6), at(0.62, 8.5), at(0.86, 10.5), at(0.95, 8), at(0.95, -8), at(0.86, -10.5), at(0.62, -8.5), at(0.3, -6), at(-0.08, -7.5)];
  return `<path d="M${pts.map(p => `${f(p[0])},${f(p[1])}`).join(' L')} Z" fill="${c}" stroke="${c}" stroke-width="5" stroke-linejoin="round"/>`;
}

export function figure(pose: Pose, joints = skeleton(pose), pal = PALETTE): string {
  const j = joints;
  const front = pose.view === 'front';
  const limb = (side: Side) => {
    const n = side === 'near' || !!pose.sameTone;
    const J = (k: string) => j[`${side}.${k}`];
    const draw = (e: number, col: string, shoeCol: string) => ({
      leg: capsule(J('hip'), (front ? 5.6 : 7.6) + e, J('knee'), (front ? 4.6 : 5.2) + e, col)
        + capsule(J('knee'), (front ? 4.6 : 5.2) + e, J('ankle'), 3.4 + e, col)
        + capsule(J('heel'), 3.6 + e, J('toe'), 2.7 + e, shoeCol),
      arm: capsule(J('shoulder'), 4.6 + e, J('elbow'), 3.7 + e, col) + capsule(J('elbow'), 3.7 + e, J('hand'), 2.9 + e, col)
        + `<circle cx="${f(J('hand')[0])}" cy="${f(J('hand')[1])}" r="${3.5 + e}" fill="${col}"/>`,
    });
    const body = draw(0, n ? pal.near : pal.far, n ? pal.shoe : pal.shoeFar);
    // A thin halo keeps limbs readable where they cross shapes of the same colour.
    const halo = draw(1.6, pal.halo, pal.halo);
    return { leg: (n ? halo.leg : '') + body.leg, arm: (n ? halo.arm : '') + body.arm };
  };
  const far = limb('far'), near = limb('near');
  const c = pal.near;
  const torso = front ? frontTorso(pose, j, c) : capsule(j.hip, 9, j.chest, 9.6, c);
  const head = capsule(j.neck, 3.6, lerp(j.neck, j.head, 0.6), 3.6, c) + `<circle cx="${f(j.head[0])}" cy="${f(j.head[1])}" r="${BODY.headR}" fill="${c}"/>`;
  // Seen from the front, both sides are visible: the arms go over the torso.
  return far.leg + (front ? '' : far.arm) + torso + head + near.leg + (front ? far.arm : '') + near.arm;
}
