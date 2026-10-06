import { describe, expect, it } from 'vitest';
import { TESSERACT } from '@/constants/tesseract';
import {
  createTesseractGeometry,
  getFrontAngles,
  getWorkAnchor,
  pickFront,
  projectPoint,
  TESSERACT_EDGES,
  shortestTurn,
  TESSERACT_VERTICES,
  toSolid,
} from '@/utils/tesseract';

describe('tesseract geometry', () => {
  it('connects each hypercube vertex to exactly four neighbours on one axis', () => {
    expect(TESSERACT_VERTICES).toHaveLength(16);
    expect(TESSERACT_EDGES).toHaveLength(32);
    for (let index = 0; index < 16; index++) {
      expect(TESSERACT_EDGES.filter(([a, b]) => a === index || b === index)).toHaveLength(4);
    }
    for (const [a, b] of TESSERACT_EDGES) {
      const axes = ['x', 'y', 'z', 'w'] as const;
      expect(
        axes.filter((axis) => TESSERACT_VERTICES[a]![axis] !== TESSERACT_VERTICES[b]![axis]),
      ).toHaveLength(1);
    }
  });

  it('keeps the complete sculpture inside the viewport throughout rotation', () => {
    const { vertices } = createTesseractGeometry();
    for (const pitch of [-1.1, 0, 0.42, 1.1]) {
      for (let yaw = 0; yaw < Math.PI * 2; yaw += 0.15) {
        for (const vertex of vertices) {
          const point = projectPoint(toSolid(vertex), yaw, pitch);
          expect(Math.max(Math.abs(point.x), Math.abs(point.y)) * TESSERACT.scale).toBeLessThan(
            0.49,
          );
        }
      }
    }
  });

  it('stays rigid: every edge keeps its 3D length at any rotation', () => {
    const { vertices, edges } = createTesseractGeometry();
    const solid = vertices.map(toSolid);
    const length = ([a, b]: readonly [number, number]) =>
      Math.hypot(solid[a]!.x - solid[b]!.x, solid[a]!.y - solid[b]!.y, solid[a]!.z - solid[b]!.z);
    const lengths = edges.map(length);
    for (let yaw = 0; yaw < Math.PI * 2; yaw += 0.7) {
      const turned = solid.map(({ x, y, z }) => ({
        x: x * Math.cos(yaw) + z * Math.sin(yaw),
        y,
        z: -x * Math.sin(yaw) + z * Math.cos(yaw),
      }));
      edges.forEach(([a, b], index) => {
        const d = Math.hypot(
          turned[a]!.x - turned[b]!.x,
          turned[a]!.y - turned[b]!.y,
          turned[a]!.z - turned[b]!.z,
        );
        expect(d).toBeCloseTo(lengths[index]!, 9);
      });
    }
  });

  it('has only the hypercube: no extra corner cells', () => {
    const { vertices, edges, faces } = createTesseractGeometry();
    expect(vertices).toHaveLength(16);
    expect(edges).toHaveLength(32);
    expect(faces).toHaveLength(12);
  });

  it('provides distinct finite anchors for collections of different sizes', () => {
    for (const count of [1, 4, 6, 10]) {
      const anchors = Array.from({ length: count }, (_, index) => getWorkAnchor(index, count));
      expect(new Set(anchors.map((point) => JSON.stringify(point))).size).toBe(count);
      for (const anchor of anchors)
        expect(Math.hypot(anchor.x, anchor.y, anchor.z)).toBeCloseTo(1.3);
    }
  });

  it('turns the short way round', () => {
    expect(shortestTurn(0, 0.5)).toBeCloseTo(0.5);
    expect(shortestTurn(0.1, Math.PI * 2 - 0.1)).toBeCloseTo(-0.2);
    expect(shortestTurn(Math.PI * 6 + 1, 0)).toBeCloseTo(-1);
  });

  it('brings any anchor nearest the viewer', () => {
    for (const count of [6, 10]) {
      const anchors = Array.from({ length: count }, (_, index) => getWorkAnchor(index, count));
      anchors.forEach((anchor, index) => {
        const { yaw, pitch } = getFrontAngles(anchor);
        const depths = anchors.map((point) => projectPoint(point, yaw, pitch).z);
        expect(pickFront(depths, -1, 0)).toBe(index);
      });
    }
  });

  it('keeps the current focus until another point is clearly nearer', () => {
    expect(pickFront([0.5, 0.55, -1], 0, 0.12)).toBe(0);
    expect(pickFront([0.5, 0.7, -1], 0, 0.12)).toBe(1);
    expect(pickFront([0.2, 0.1], -1, 0.12)).toBe(0);
  });
});
