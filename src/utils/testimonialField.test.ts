import { describe, expect, it } from 'vitest';
import { TESTIMONIAL_RAIN } from '@/constants/motion';
import { initials, placeEchoes, placeFloats, toWorld } from '@/utils/testimonialField';

describe('testimonial field', () => {
  it('spreads frames evenly through three depth bands, each falling at its own speed', () => {
    const floats = placeFloats(13);
    expect(floats).toHaveLength(13);
    expect(new Set(floats.map((float) => float.speed)).size).toBe(3);
    for (const float of floats) {
      expect(float.x).toBeGreaterThanOrEqual(0.1);
      expect(float.x).toBeLessThanOrEqual(0.9);
    }
    for (const band of TESTIMONIAL_RAIN.bands) {
      const members = floats.filter((float) => float.speed === band.speed);
      const xs = members.map((float) => float.x).sort((a, b) => a - b);
      const gaps = xs.slice(1).map((x, index) => x - (xs[index] ?? 0));
      expect(Math.min(...gaps)).toBeGreaterThan(0.08);
      for (const member of members) {
        expect(member.z).toBeGreaterThanOrEqual(band.z[0]);
        expect(member.z).toBeLessThanOrEqual(band.z[1]);
      }
    }
  });

  it('makes nearer bands faster and brighter, and keeps echoes far and faint', () => {
    const [near, mid, far] = TESTIMONIAL_RAIN.bands;
    expect(near.speed).toBeGreaterThan(mid.speed);
    expect(mid.speed).toBeGreaterThan(far.speed);
    expect(near.fade).toBeGreaterThan(far.fade);
    for (const echo of placeEchoes(13)) {
      expect(echo.z).toBeLessThan(far.z[0]);
      expect(echo.fade).toBeLessThan(0.4);
    }
  });

  it('projects back to the requested screen position', () => {
    const z = -500;
    const world = toWorld(900, 600, z);
    const scale = TESTIMONIAL_RAIN.perspective / (TESTIMONIAL_RAIN.perspective - z);
    expect(600 + (world - 600) * scale).toBeCloseTo(900);
  });

  it('builds a monogram from the business name', () => {
    expect(initials('Good Creamery')).toBe('GC');
    expect(initials('Hey, Lulu! Pastries')).toBe('HL');
    expect(initials('The Compound Court')).toBe('CC');
    expect(initials('Arkcladd')).toBe('A');
  });
});
