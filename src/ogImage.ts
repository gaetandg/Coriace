import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { SCENES, sceneThumb } from './illustrations/scenes';
import type { ShareCard } from './staticPages';

// Share images (1200 × 630, shown by WhatsApp, Strava, social networks and search results), drawn at
// build time in the app's look: brick background, running lanes, the brand fonts and, for an
// exercise, its still frame on a cream card. Fonts are in fonts/ (SIL Open Font License).

const FONT_FILES = ['BricolageGrotesque-ExtraBold.ttf', 'InstrumentSans-SemiBold.ttf']
  .map(file => fileURLToPath(new URL(`../fonts/${file}`, import.meta.url)));

const COLORS = { brick: '#A13D2B', cream: '#F6EBDD', sand: '#F6E0D6' };
const WIDTH = 1200, HEIGHT = 630, LEFT = 72;

const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Words on lines of at most `maxChars` characters (a long word keeps its own line).
export function wrap(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  for (const word of text.split(' ')) {
    const last = lines[lines.length - 1];
    if (last !== undefined && `${last} ${word}`.length <= maxChars) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines;
}

// The largest title size that fits in three lines. Bricolage Grotesque ExtraBold averages a little
// under half its size per character.
const CHAR_WIDTH = 0.5;
export function titleLayout(title: string, width: number): { size: number; lines: string[] } {
  for (const size of [88, 78, 68, 60, 52]) {
    let maxChars = Math.floor(width / (size * CHAR_WIDTH));
    const lines = wrap(title, maxChars);
    if (lines.length > 3 && size > 52) continue;
    // Lines of even length: as short as they can be without adding one.
    while (maxChars > 1 && wrap(title, maxChars - 1).length === lines.length) maxChars--;
    return { size, lines: wrap(title, maxChars) };
  }
  throw new Error('unreachable');
}

export function shareCardSvg(card: ShareCard): string {
  const scene = card.exerciseId ? SCENES[card.exerciseId] : undefined;
  const textWidth = scene ? 600 : WIDTH - 2 * LEFT;
  const { size, lines } = titleLayout(card.title, textWidth);
  const lineHeight = Math.round(size * 1.06);
  const block = lines.length * lineHeight + 64;
  const top = 168 + Math.max(0, (380 - block) / 2);
  const title = lines
    .map((line, i) => `<text x="${LEFT}" y="${Math.round(top + size * 0.8 + i * lineHeight)}" font-family="Bricolage Grotesque" font-weight="800" font-size="${size}" fill="#fff">${esc(line)}</text>`)
    .join('');
  const subtitleY = Math.round(top + lines.length * lineHeight + 46);

  let figure = '';
  if (scene) {
    const { viewBox, svg } = sceneThumb(scene);
    figure = `<rect x="708" y="140" width="420" height="356" rx="36" fill="${COLORS.cream}"/>`
      + `<svg x="728" y="160" width="380" height="304" viewBox="${viewBox}">${svg}</svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
<rect width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.brick}"/>
<g fill="none" stroke="#fff" stroke-width="3" opacity="0.16">${[170, 250, 330, 410].map(r => `<circle cx="1150" cy="0" r="${r}"/>`).join('')}</g>
<g transform="translate(${LEFT} 54) scale(2.1)" fill="none" stroke="#fff" stroke-width="2.4"><path d="M26.5 7.5A13 13 0 1 0 26.5 24.5"/><path d="M22.6 10.4A8.2 8.2 0 1 0 22.6 21.6"/><path d="M18.8 13.3A3.4 3.4 0 1 0 18.8 18.7"/></g>
<text x="${LEFT + 84}" y="98" font-family="Bricolage Grotesque" font-weight="800" font-size="46" fill="#fff">Coriace</text>
<text x="${LEFT + 84}" y="132" font-family="Instrument Sans" font-weight="600" font-size="24" fill="${COLORS.sand}">Le renfo pour les coureurs</text>
${title}
<text x="${LEFT}" y="${subtitleY}" font-family="Instrument Sans" font-weight="600" font-size="34" fill="${COLORS.sand}">${esc(card.subtitle)}</text>
<text x="${LEFT}" y="580" font-family="Instrument Sans" font-weight="600" font-size="28" fill="#fff">coriace.app</text>
${figure}
</svg>`;
}

export function shareImage(card: ShareCard): Uint8Array {
  const resvg = new Resvg(shareCardSvg(card), {
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Instrument Sans' },
  });
  return resvg.render().asPng();
}
