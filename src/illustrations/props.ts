import { Pt } from './mannequin';

// Scenery in flat colours: floor, wall, step, chair, weight, jump rope.
export const COLORS = { floor: '#EBDCCB', shadow: '#DEC6B0', wall: '#EADACA', step: '#D5B79E', stepTop: '#C9A88D', wood: '#BE9373', woodDark: '#A57A5C', iron: '#5A3A30', rope: '#3B140C', handle: '#A13D2B' };
export const FLOOR = 150;
// Height of the ankle when the foot is flat on the floor.
export const ANKLE_Y = 145.5;

const f = (n: number) => n.toFixed(1);

export const floor = () => `<rect x="0" y="${FLOOR}" width="200" height="10" fill="${COLORS.floor}"/>`;
export const shadow = (cx: number, rx: number, opacity = 1) =>
  `<ellipse cx="${f(cx)}" cy="${FLOOR + 0.5}" rx="${f(rx)}" ry="2.6" fill="${COLORS.shadow}" opacity="${opacity.toFixed(2)}"/>`;
// A wall whose surface is at x.
export const wall = (x: number, side: 'left' | 'right' = 'left') =>
  `<rect x="${side === 'left' ? x - 12 : x}" y="0" width="12" height="${FLOOR}" fill="${COLORS.wall}"/>`;
export const step = (x1: number, x2: number, top: number) =>
  `<rect x="${x1}" y="${top}" width="${x2 - x1}" height="${FLOOR - top}" rx="3" fill="${COLORS.step}"/><rect x="${x1}" y="${top}" width="${x2 - x1}" height="4" rx="2" fill="${COLORS.stepTop}"/>`;
// Chair seen from the side: seat from `left` to `left + 36`, backrest on one side.
export const chair = (left: number, top: number, back: 'left' | 'right') => {
  const bx = back === 'left' ? left : left + 31.5;
  return `<rect x="${left + 2}" y="${top + 6}" width="4.5" height="${FLOOR - top - 6}" fill="${COLORS.woodDark}"/>`
    + `<rect x="${left + 29.5}" y="${top + 6}" width="4.5" height="${FLOOR - top - 6}" fill="${COLORS.woodDark}"/>`
    + `<rect x="${bx}" y="${top - 40}" width="4.5" height="42" rx="2" fill="${COLORS.wood}"/>`
    + `<rect x="${left}" y="${top}" width="36" height="6" rx="2" fill="${COLORS.wood}"/>`;
};
export const kettlebell = (c: Pt) =>
  `<path d="M${f(c[0] - 4.5)},${f(c[1] - 4)} Q${f(c[0])},${f(c[1] - 13)} ${f(c[0] + 4.5)},${f(c[1] - 4)}" fill="none" stroke="${COLORS.iron}" stroke-width="2.6"/>`
  + `<circle cx="${f(c[0])}" cy="${f(c[1] + 1)}" r="6.5" fill="${COLORS.iron}"/>`;

// Jump rope seen from the front: `turn` is the rope angle, 0 when it passes under the feet.
export function rope(left: Pt, right: Pt, turn: number, radius = 64) {
  const k = (radius * Math.cos(turn)) / 0.75;
  const curve = `<path d="M${f(left[0] - 3)},${f(left[1] + 4)} C${f(left[0] - 24)},${f(left[1] + 4 + k)} ${f(right[0] + 24)},${f(right[1] + 4 + k)} ${f(right[0] + 3)},${f(right[1] + 4)}" fill="none" stroke="${COLORS.rope}" stroke-width="2"/>`;
  const handles = `<path d="M${f(left[0] - 1)},${f(left[1] - 3)} L${f(left[0] - 4)},${f(left[1] + 7)}" stroke="${COLORS.handle}" stroke-width="4.5" stroke-linecap="round"/>`
    + `<path d="M${f(right[0] + 1)},${f(right[1] - 3)} L${f(right[0] + 4)},${f(right[1] + 7)}" stroke="${COLORS.handle}" stroke-width="4.5" stroke-linecap="round"/>`;
  // The rope passes behind the body on the way up, in front on the way down.
  const behind = Math.sin(turn) > 0;
  return { back: behind ? curve : '', front: (behind ? '' : curve) + handles };
}
