import { describe, expect, it } from 'vitest';
import { getSpiralPosition, wrapProgress } from '@/utils/spiral';

describe('spatial loop', () => {
  const desktop = { width: 900, height: 800, cardWidth: 400, compact: false };

  it('wraps in either direction over any number of cycles', () => {
    expect(wrapProgress(-0.25)).toBe(0.75);
    expect(wrapProgress(51.25)).toBe(0.25);
    expect(getSpiralPosition(0.5, desktop)).toEqual(getSpiralPosition(40.5, desktop));
  });

  it('gives foreground work physically coherent scale and depth', () => {
    const center = getSpiralPosition(0.5, desktop);
    expect(center.scale).toBe(1);
    expect(center.x).toBe(0);
    expect(center.y).toBe(0);
    expect(getSpiralPosition(0.1, desktop).scale).toBeLessThan(center.scale);
  });

  it.each([desktop, { width: 390, height: 440, cardWidth: 230, compact: true }])(
    'recycles only after the work fully exits the clip',
    (geometry) => {
      for (const progress of [0, 0.99999]) {
        const position = getSpiralPosition(progress, geometry);
        const projectedHalfHeight = (geometry.cardWidth * 1.25 * position.scale) / 2;
        expect(Math.abs(position.y) - projectedHalfHeight).toBeGreaterThan(geometry.height / 2);
      }
    },
  );

  it('uses gentler mobile rotation and keeps all transforms finite', () => {
    const compact = { ...desktop, compact: true };
    expect(Math.abs(getSpiralPosition(0.25, compact).rotateY)).toBeLessThan(
      Math.abs(getSpiralPosition(0.25, desktop).rotateY),
    );
    for (let progress = 0; progress < 1; progress += 0.01) {
      const position = getSpiralPosition(progress, desktop);
      expect(position.scale).toBeGreaterThan(0);
      expect(position.transform).not.toMatch(/NaN|Infinity/);
    }
  });
});
