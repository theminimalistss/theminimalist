import { describe, expect, it } from 'vitest';
import { MOTION } from '@/constants/motion';
import {
  applyWheelImpulse,
  getCruiseVelocity,
  getSpiralBlend,
  getSpiralPosition,
  normalizeWheelDelta,
  settleVelocity,
  wrapProgress,
} from '@/utils/spiral';

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

describe('layout reshape', () => {
  const from = {
    width: 900,
    height: 800,
    cardWidth: 400,
    compact: false,
    centerX: 700,
    centerY: 400,
  };
  const to = { width: 390, height: 700, cardWidth: 290, compact: true, centerX: 195, centerY: 350 };

  it('starts on the old stage and card size and ends on the new spiral', () => {
    const old = getSpiralPosition(0.4, from);
    const start = getSpiralBlend(0.4, from, to, 0);
    expect(start.x).toBeCloseTo(old.x + 505);
    expect(start.y).toBeCloseTo(old.y + 50);
    expect(start.scale).toBeCloseTo((old.scale * 400) / 290);
    expect(start.zIndex).toBe(old.zIndex);
    const end = getSpiralBlend(0.4, from, to, 1);
    const target = getSpiralPosition(0.4, to);
    for (const key of ['x', 'y', 'scale', 'rotateY', 'rotateZ'] as const) {
      expect(end[key]).toBeCloseTo(target[key]);
    }
  });

  it('carries the perspective in each card transform', () => {
    expect(getSpiralPosition(0.4, from).transform).toMatch(/^perspective\(\d+px\) translate3d/);
  });
});

describe('wheel steering', () => {
  const rising = getCruiseVelocity(1);

  it('keeps the default direction for scrolling down and reverses for scrolling up', () => {
    expect(rising).toBeCloseTo(-1 / MOTION.loopDuration);
    expect(getCruiseVelocity(-1)).toBeCloseTo(1 / MOTION.loopDuration);
    expect(applyWheelImpulse(rising, 100)).toBeLessThan(rising);
    expect(applyWheelImpulse(rising, -400)).toBeGreaterThan(0);
  });

  it('caps the boost in both directions', () => {
    expect(applyWheelImpulse(0, 1e6)).toBe(-MOTION.maxVelocity);
    expect(applyWheelImpulse(0, -1e6)).toBe(MOTION.maxVelocity);
  });

  it('eases a boosted spin back to cruising speed', () => {
    const boosted = applyWheelImpulse(rising, 300);
    const shortly = settleVelocity(boosted, rising, 100);
    expect(Math.abs(shortly)).toBeLessThan(Math.abs(boosted));
    expect(Math.abs(shortly)).toBeGreaterThan(Math.abs(rising));
    expect(settleVelocity(boosted, rising, 10_000)).toBeCloseTo(rising, 8);
  });

  it('converts line and page wheel deltas to pixels', () => {
    expect(normalizeWheelDelta(3, 0, 800)).toBe(3);
    expect(normalizeWheelDelta(3, 1, 800)).toBe(48);
    expect(normalizeWheelDelta(-1, 2, 800)).toBe(-800);
  });
});
