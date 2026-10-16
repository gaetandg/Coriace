import { describe, expect, it } from 'vitest';
import { shareCardSvg, shareImage, titleLayout, wrap } from './ogImage';

describe('share images', () => {
  it('wraps words on lines', () => {
    expect(wrap('Renfo pour le trail et l\'ultra', 14)).toEqual(['Renfo pour le', 'trail et', 'l\'ultra']);
    expect(wrap('Copenhagen', 4)).toEqual(['Copenhagen']);
  });

  it('keeps titles to three even lines, smaller when needed', () => {
    expect(titleLayout('Renfo pour le marathon', 1056)).toEqual({ size: 88, lines: ['Renfo pour le marathon'] });
    const long = titleLayout('Soulevé de terre sur une jambe', 600);
    expect(long.lines.length).toBeLessThanOrEqual(3);
    const lengths = titleLayout('Renfo pour le trail et l\'ultra', 1056).lines.map(l => l.length);
    expect(Math.max(...lengths) - Math.min(...lengths)).toBeLessThan(10);
  });

  it('shows the exercise on its card', () => {
    expect(shareCardSvg({ title: 'Copenhagen plank', subtitle: 'Adducteurs', exerciseId: 'copenhagen_plank' })).toContain('<svg x="728"');
    expect(shareCardSvg({ title: 'Renfo & co <3', subtitle: 'x' })).toContain('Renfo &amp; co &lt;3');
  });

  it('draws a 1200 × 630 PNG', () => {
    const png = shareImage({ title: 'Renfo pour le marathon', subtitle: '18 séances guidées' });
    expect([...png.slice(1, 4)].map(c => String.fromCharCode(c)).join('')).toBe('PNG');
    const view = new DataView(png.buffer, png.byteOffset);
    expect([view.getUint32(16), view.getUint32(20)]).toEqual([1200, 630]);
  });
});
