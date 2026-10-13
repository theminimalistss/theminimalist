import { describe, expect, it } from 'vitest';
import {
  SERVICE_DRAWINGS,
  SERVICE_FACES,
  insidePolygon,
  movePoint,
  partPose,
  scheduleStrokes,
  traceLine,
  triangulate,
} from '@/utils/serviceDrawing';

describe('service drawings', () => {
  it('traces a stroke by distance along its corners', () => {
    const corner = [
      [0, 0],
      [30, 0],
      [30, 10],
    ] as const;
    expect(traceLine(corner, 0.5)).toEqual([
      [0, 0],
      [20, 0],
    ]);
    expect(traceLine(corner, 0.875)).toEqual([
      [0, 0],
      [30, 0],
      [30, 5],
    ]);
    expect(traceLine(corner, 1)).toBe(corner);
    expect(traceLine(corner, 0)).toEqual([[0, 0]]);
  });

  it('draws edges first, then details, then trails, finishing on time', () => {
    for (const strokes of SERVICE_DRAWINGS) {
      const schedule = scheduleStrokes(strokes);
      expect(schedule).toHaveLength(strokes.length);
      const tones = schedule.map((stroke) => stroke.tone);
      expect(tones).toEqual([...tones].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)));
      for (const stroke of schedule) {
        expect(stroke.start).toBeGreaterThanOrEqual(0);
        expect(stroke.start + stroke.span).toBeLessThanOrEqual(1 + 1e-9);
        expect(stroke.length).toBeGreaterThan(0);
      }
      expect(Math.max(...schedule.map((stroke) => stroke.start + stroke.span))).toBeCloseTo(1);
    }
  });

  it('keeps every stage inside the drawing board with a clear outline', () => {
    for (const strokes of SERVICE_DRAWINGS) {
      expect(strokes.some((stroke) => stroke.tone === 'edge')).toBe(true);
      for (const { points } of strokes)
        for (const [x, y] of points) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(480);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThanOrEqual(320);
        }
    }
  });

  it('splits every face into triangles that cover its whole area', () => {
    const area = (points: readonly (readonly [number, number])[]) =>
      Math.abs(
        points.reduce((sum, [x, y], index) => {
          const [nx, ny] = points[(index + 1) % points.length]!;
          return sum + x * ny - nx * y;
        }, 0) / 2,
      );
    for (const faces of SERVICE_FACES)
      for (const face of faces) {
        const indices = triangulate(face.points);
        expect(indices).toHaveLength((face.points.length - 2) * 3);
        let covered = 0;
        for (let index = 0; index < indices.length; index += 3)
          covered += area([0, 1, 2].map((corner) => face.points[indices[index + corner]!]!));
        expect(covered).toBeCloseTo(area(face.points), 3);
      }
  });

  it('gives every drawing its own gentle motion that starts and rests still', () => {
    const signatures = new Set<string>();
    SERVICE_DRAWINGS.forEach((strokes, stage) => {
      const parts = new Set(strokes.map((stroke) => stroke.part ?? -1).filter((part) => part >= 0));
      expect(parts.size).toBeGreaterThan(0);
      for (const face of SERVICE_FACES[stage]!) expect(face.part).toBeDefined();
      const moved = [...parts].map((part) => {
        expect(movePoint([200, 150], partPose(stage, part, 2, 0))).toEqual([200, 150]);
        const [x, y] = movePoint([200, 150], partPose(stage, part, 1.3, 1));
        expect(Math.hypot(x - 200, y - 150)).toBeLessThan(40);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      });
      signatures.add(moved.join('|'));
    });
    expect(signatures.size).toBe(4);
  });

  it('tucks the Listen sound waves behind the speech bubbles', () => {
    const square = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
    ] as const;
    expect(insidePolygon([5, 5], square)).toBe(true);
    expect(insidePolygon([15, 5], square)).toBe(false);
    const waves = SERVICE_DRAWINGS[0]!.filter((stroke) => stroke.tone === 'trail');
    expect(waves.length).toBeGreaterThan(0);
    const bubbles = SERVICE_FACES[0]!.filter((face) => waves[0]!.behind?.includes(face.part ?? -1));
    const tucked = waves.some((wave) =>
      wave.points.some((point) => bubbles.some((face) => insidePolygon(point, face.points))),
    );
    expect(tucked).toBe(true);
  });

  it('tolerates empty and zero-length strokes', () => {
    expect(scheduleStrokes([])).toEqual([]);
    expect(
      traceLine(
        [
          [4, 4],
          [4, 4],
        ],
        0.5,
      ),
    ).toEqual([[4, 4]]);
  });
});

const ORDER = ['edge', 'detail', 'trail'];
