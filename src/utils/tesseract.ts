import { TESSERACT } from '@/constants/tesseract';

export type Point3 = { x: number; y: number; z: number };
export type Point4 = Point3 & { w: number };
export type Edge = readonly [number, number];
export type Face = readonly [number, number, number, number];

// The 16 vertices and 32 edges of a four-dimensional hypercube.
export const TESSERACT_VERTICES: readonly Point4[] = Array.from({ length: 16 }, (_, index) => ({
  x: index & 1 ? 1 : -1,
  y: index & 2 ? 1 : -1,
  z: index & 4 ? 1 : -1,
  w: index & 8 ? 1 : -1,
}));

export const TESSERACT_EDGES: readonly Edge[] = TESSERACT_VERTICES.flatMap((_, index) =>
  [1, 2, 4, 8].filter((bit) => !(index & bit)).map((bit): Edge => [index, index | bit]),
);

/** A fixed 4D → 3D perspective: the inner and outer cube keep their proportions. */
export function toSolid(point: Point4): Point3 {
  const scale = 1.65 / (2.5 - point.w);
  return { x: point.x * scale, y: point.y * scale, z: point.z * scale };
}

export function projectPoint(point: Point3, yaw: number, pitch: number): Point3 {
  const x = point.x * Math.cos(yaw) + point.z * Math.sin(yaw);
  const depth = -point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
  const y = point.y * Math.cos(pitch) - depth * Math.sin(pitch);
  const z = point.y * Math.sin(pitch) + depth * Math.cos(pitch);
  const perspective = TESSERACT.cameraDistance / (TESSERACT.cameraDistance - z);
  return { x: x * perspective, y: y * perspective, z };
}

const EDGE_MIDPOINTS: readonly Point3[] = (() => {
  const reach = TESSERACT.orbit / Math.SQRT2;
  const points: Point3[] = [];
  for (const a of [reach, -reach])
    for (const b of [reach, -reach])
      points.push({ x: a, y: b, z: 0 }, { x: a, y: 0, z: b }, { x: 0, y: a, z: b });
  const depth = (point: Point3) => projectPoint(point, TESSERACT.yaw, TESSERACT.pitch).z;
  return points.sort((p, q) => depth(q) - depth(p));
})();

/** Face centres for six studies; an even spherical arrangement for other collection sizes. */
export function getWorkAnchor(index: number, count: number): Point3 {
  if (count === 12) return EDGE_MIDPOINTS[index] ?? EDGE_MIDPOINTS[0]!;
  if (count === 6) {
    const faces = [
      { x: 0, y: 0, z: 1.3 },
      { x: 1.3, y: 0, z: 0 },
      { x: 0, y: 1.3, z: 0 },
      { x: -1.3, y: 0, z: 0 },
      { x: 0, y: -1.3, z: 0 },
      { x: 0, y: 0, z: -1.3 },
    ];
    return faces[index % faces.length] ?? faces[0]!;
  }
  const y = 1 - (2 * (index + 0.5)) / Math.max(1, count);
  const radius = Math.sqrt(1 - y * y);
  const angle = index * Math.PI * (3 - Math.sqrt(5));
  const orbit = TESSERACT.orbit;
  return { x: Math.cos(angle) * radius * orbit, y: y * orbit, z: Math.sin(angle) * radius * orbit };
}

export type Tether = { from: Point3; to: Point3 };

export function getTethers(count: number): Tether[] {
  const outer = toSolid({ x: 1, y: 1, z: 1, w: 1 }).x;
  return Array.from({ length: count }, (_, index) => {
    const to = getWorkAnchor(index, count);
    const length = Math.hypot(to.x, to.y, to.z);
    const surface = outer / Math.max(Math.abs(to.x), Math.abs(to.y), Math.abs(to.z));
    const from = { x: to.x * surface, y: to.y * surface, z: to.z * surface };
    return surface * length < length - 0.02 ? [{ from, to }] : [];
  }).flat();
}

export function getSculptureScale(width: number, height: number) {
  const compact = width < 1100 ? TESSERACT.compactScale : 1;
  return Math.min(width, height) * TESSERACT.scale * compact;
}

export function getNodePositions(
  count: number,
  width: number,
  height: number,
  yaw: number = TESSERACT.yaw,
  pitch: number = TESSERACT.pitch,
) {
  const scale = getSculptureScale(width, height);
  return Array.from({ length: count }, (_, index) => {
    const point = projectPoint(getWorkAnchor(index, count), yaw, pitch);
    return { x: width / 2 + point.x * scale, y: height / 2 - point.y * scale, depth: point.z };
  });
}

/** The hypercube alone: its outer and inner cube carry translucent faces. */
export function createTesseractGeometry() {
  const cubeFaces: Face[] = [
    [0, 1, 3, 2],
    [4, 6, 7, 5],
    [0, 4, 5, 1],
    [2, 3, 7, 6],
    [0, 2, 6, 4],
    [1, 5, 7, 3],
  ];
  const faces = [0, 8].flatMap((offset) =>
    cubeFaces.map(([a, b, c, d]): Face => [a + offset, b + offset, c + offset, d + offset]),
  );
  return { vertices: TESSERACT_VERTICES, edges: TESSERACT_EDGES, faces };
}

/** The shortest signed turn from one angle to another. */
export function shortestTurn(from: number, to: number) {
  const turn = (to - from) % (Math.PI * 2);
  if (turn > Math.PI) return turn - Math.PI * 2;
  if (turn < -Math.PI) return turn + Math.PI * 2;
  return turn;
}

/** Yaw and pitch that bring a point nearest the viewer, in a three-quarter view. */
export function getFrontAngles(point: Point3) {
  const yaw = Math.atan2(-point.x, point.z) + TESSERACT.frontYaw;
  const depth = Math.hypot(point.x, point.z);
  const pitch = Math.atan2(point.y, depth) + TESSERACT.frontPitch;
  return { yaw, pitch: Math.max(-TESSERACT.maxPitch, Math.min(TESSERACT.maxPitch, pitch)) };
}

/** The nearest point, keeping the current one until another is clearly nearer. */
export function pickFront(depths: readonly number[], current: number, margin: number) {
  let best = 0;
  depths.forEach((depth, index) => {
    if (depth > (depths[best] ?? -Infinity)) best = index;
  });
  const held = depths[current];
  if (held === undefined || best === current) return best;
  return (depths[best] ?? -Infinity) - held > margin ? best : current;
}

export type TraceStroke = { from: number; to: number; start: number; length: number };

const OUTER = 8;

/**
 * When each edge is drawn during the entrance, as fractions of the trace: the outer cube
 * first, then the edges reaching inward from it, then the inner cube. Matches edge order.
 */
export function getTraceSchedule(edges: readonly Edge[] = TESSERACT_EDGES): TraceStroke[] {
  const outer = edges.filter(([a, b]) => a & OUTER && b & OUTER);
  const inner = edges.filter(([a, b]) => !(a & OUTER) && !(b & OUTER));
  const across = edges.filter(([a, b]) => (a & OUTER) !== (b & OUTER));
  const timing = new Map<Edge, { start: number; length: number }>();
  const stage = (group: readonly Edge[], begin: number, span: number, length: number) =>
    group.forEach((edge, index) =>
      timing.set(edge, {
        start: begin + (span * index) / Math.max(1, group.length - 1),
        length,
      }),
    );
  stage(outer, 0, 0.3, 0.22);
  stage(across, 0.42, 0.12, 0.2);
  stage(inner, 0.6, 0.18, 0.2);
  return edges.map((edge) => {
    const [a, b] = edge;
    const reach = b & OUTER && !(a & OUTER);
    return {
      from: reach ? b : a,
      to: reach ? a : b,
      ...(timing.get(edge) ?? { start: 0, length: 1 }),
    };
  });
}

export type Heading = { yaw: number; pitch: number; duration: number };

export function chooseHeading(previousYaw: number, pitch: number, random = Math.random): Heading {
  const { every, flipChance, speed, pitch: tilt } = TESSERACT.wander;
  const duration = every[0] + random() * (every[1] - every[0]);
  const direction = (Math.sign(previousYaw) || 1) * (random() < flipChance ? -1 : 1);
  const yaw = TESSERACT.rotationSpeed * (speed[0] + random() * (speed[1] - speed[0])) * direction;
  const target = tilt[0] + random() * (tilt[1] - tilt[0]);
  return { yaw, pitch: (target - pitch) / duration, duration };
}
