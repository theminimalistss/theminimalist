import { describe, expect, it } from 'vitest';
import { TESTIMONIAL_RAIN } from '@/constants/motion';
import {
  focusPose,
  placeEchoes,
  placeFloats,
  spreadFrames,
  toWorld,
} from '@/utils/testimonialField';

function minimumSeparation(
  spots: readonly { x: number; y: number }[],
  sizes: readonly { width: number; height: number }[],
  loop: number,
) {
  let least = Infinity;
  spots.forEach((a, i) =>
    spots.slice(i + 1).forEach((b, offset) => {
      const j = i + 1 + offset;
      const dx = Math.abs(a.x - b.x);
      const raw = Math.abs(a.y - b.y) % loop;
      const dy = Math.min(raw, loop - raw);
      const sa = sizes[i]!;
      const sb = sizes[j]!;
      least = Math.min(
        least,
        Math.max(dx / ((sa.width + sb.width) / 2), dy / ((sa.height + sb.height) / 2)),
      );
    }),
  );
  return least;
}

describe('testimonial field', () => {
  it('spreads frames through three depth bands', () => {
    const floats = placeFloats(13);
    expect(floats).toHaveLength(13);
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

  it('spaces every frame across the whole screen and loop without bunching', () => {
    const { perspective } = TESTIMONIAL_RAIN;
    const sizes = placeFloats(13).map((float) => {
      const scale = perspective / (perspective - float.z);
      return { width: 250 * scale, height: 312 * scale };
    });
    const loop = 900 + 2 * Math.max(...sizes.map((size) => size.height));
    const spots = spreadFrames(sizes, 1440, loop);
    expect(minimumSeparation(spots, sizes, loop)).toBeGreaterThan(0.9);
    const xs = spots.map((spot) => spot.x);
    expect(Math.min(...xs)).toBeLessThan(360);
    expect(Math.max(...xs)).toBeGreaterThan(1080);
  });
});
