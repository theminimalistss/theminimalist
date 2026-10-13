import { describe, expect, it } from 'vitest';
import { TESTIMONIAL_RAIN } from '@/constants/motion';
import {
  flatFocusPose,
  focusPose,
  placeEchoes,
  placeFloats,
  spreadFrames,
  spreadScore,
  toWorld,
} from '@/utils/testimonialField';

describe('testimonial field', () => {
  it('spreads frames through three depth bands', () => {
    const floats = placeFloats(14);
    expect(floats).toHaveLength(14);
    for (const float of floats) {
      expect(float.x).toBeGreaterThanOrEqual(0.05);
      expect(float.x).toBeLessThanOrEqual(0.95);
    }
    for (const band of TESTIMONIAL_RAIN.bands) {
      const members = floats.filter((float) => float.fade === band.fade);
      const xs = members.map((float) => float.x).sort((a, b) => a - b);
      const gaps = xs.slice(1).map((x, index) => x - (xs[index] ?? 0));
      expect(Math.min(...gaps)).toBeGreaterThan(0.08);
      for (const member of members) {
        expect(member.z).toBeGreaterThanOrEqual(band.z[0]);
        expect(member.z).toBeLessThanOrEqual(band.z[1]);
      }
    }
  });

  it('makes nearer bands brighter, and keeps the slower echoes far and faint', () => {
    const [near, , far] = TESTIMONIAL_RAIN.bands;
    expect(near.fade).toBeGreaterThan(far.fade);
    expect(TESTIMONIAL_RAIN.echo.speed).toBeLessThan(TESTIMONIAL_RAIN.speed);
    for (const echo of placeEchoes(14)) {
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

  it('brings a focused frame forward, toward the centre, and fully on screen', () => {
    const stage = { left: 0, top: 0, width: 1440, height: 900 };
    const size = { width: 260, height: 350 };
    const { perspective, horizon } = TESTIMONIAL_RAIN;
    for (const [left, top, z] of [
      [1300, 40, 120],
      [-60, 700, -900],
      [600, 300, -2000],
    ] as const) {
      const scale = perspective / (perspective - z);
      const frame = { left, top, width: size.width * scale, height: size.height * scale };
      const pose = focusPose({ frame, stage, size, z, topSafe: 96 });
      const { screen } = pose;
      expect(screen.x - screen.width / 2).toBeGreaterThanOrEqual(24);
      expect(screen.x + screen.width / 2).toBeLessThanOrEqual(1440 - 24);
      expect(screen.y - screen.height / 2).toBeGreaterThanOrEqual(96 + 24);
      expect(screen.y + screen.height / 2).toBeLessThanOrEqual(900 - 24);
      expect(Math.abs(screen.x - 720)).toBeLessThan(Math.abs(left + frame.width / 2 - 720) + 1);
      const lifted = perspective / (perspective - (z + pose.z));
      const vanish = { x: 720, y: 900 * horizon };
      const worldX = vanish.x + (left + frame.width / 2 - vanish.x) / scale + pose.x;
      expect(vanish.x + (worldX - vanish.x) * lifted).toBeCloseTo(screen.x, 3);
      expect(size.width * pose.scale * lifted).toBeCloseTo(screen.width, 3);
    }
  });

  it('spaces every frame across the whole screen and loop without bunching, for any seed', () => {
    const { perspective } = TESTIMONIAL_RAIN;
    const layouts = new Set<string>();
    for (const [width, height] of [
      [1440, 900],
      [1024, 768],
      [390, 844],
    ] as const) {
      const frame = width < 768 ? 180 : 250;
      for (let seed = 1; seed <= 60; seed++) {
        const sizes = placeFloats(14, seed * 7919).map((float) => {
          const scale = perspective / (perspective - float.z);
          return { width: frame * scale, height: frame * 1.25 * scale };
        });
        const loop = height + 2 * Math.max(...sizes.map((size) => size.height));
        const spots = spreadFrames(sizes, width, loop, seed * 104729);
        expect(spreadScore(spots, sizes, loop)).toBeGreaterThan(width < 768 ? 0.6 : 0.9);
        const xs = spots.map((spot) => spot.x);
        if (width >= 768) {
          expect(Math.min(...xs)).toBeLessThan(width / 4);
          expect(Math.max(...xs)).toBeGreaterThan((width * 3) / 4);
        }
        layouts.add(spots.map((spot) => Math.round(spot.x)).join());
      }
    }
    expect(layouts.size).toBe(180);
  });

  it('places a new random field on each seed, keeping every depth band filled', () => {
    const first = placeFloats(14, 101);
    const second = placeFloats(14, 202);
    expect(first.map((float) => float.z)).not.toEqual(second.map((float) => float.z));
    for (const floats of [first, second]) {
      for (const band of TESTIMONIAL_RAIN.bands) {
        expect(floats.filter((float) => float.fade === band.fade).length).toBeGreaterThan(2);
      }
    }
  });

  it('expands a gallery frame toward the centre and keeps it on screen', () => {
    const view = { left: 0, top: 0, width: 1440, height: 900 };
    for (const [left, top] of [
      [52, 420],
      [1140, 760],
      [600, 120],
    ] as const) {
      const frame = { left, top, width: 248, height: 310 };
      const pose = flatFocusPose({ frame, view, topSafe: 96 });
      const { screen } = pose;
      expect(pose.scale).toBeGreaterThan(1);
      expect(frame.left + frame.width / 2 + pose.x).toBeCloseTo(screen.x);
      expect(screen.x - screen.width / 2).toBeGreaterThanOrEqual(24);
      expect(screen.x + screen.width / 2).toBeLessThanOrEqual(1440 - 24);
      expect(screen.y - screen.height / 2).toBeGreaterThanOrEqual(96 + 24);
      expect(screen.y + screen.height / 2).toBeLessThanOrEqual(900 - 24);
      expect(Math.abs(screen.x - 720)).toBeLessThan(Math.abs(left + frame.width / 2 - 720) + 1);
    }
  });
});
