export type DrawingPoint = readonly [number, number];
export type DrawingLine = readonly DrawingPoint[];
export type DrawingFace = { points: DrawingLine; tone: 'light' | 'shade' | 'clay'; part?: number };
export type StrokeTone = 'edge' | 'detail' | 'trail';
export type DrawingStroke = {
  points: DrawingLine;
  tone: StrokeTone;
  part?: number;
  behind?: readonly number[];
};
export type PartPose = { x: number; y: number; angle: number; scale: number; pivot: DrawingPoint };
export type TraceStroke = DrawingStroke & { start: number; span: number; length: number };

const line = (...points: DrawingPoint[]): DrawingLine => points;
const edge = (points: DrawingLine): DrawingStroke => ({ points, tone: 'edge' });
const detail = (points: DrawingLine): DrawingStroke => ({ points, tone: 'detail' });
const trail = (points: DrawingLine): DrawingStroke => ({ points, tone: 'trail' });
const arc = (x: number, y: number, radius: number, start = 0, end = Math.PI * 2): DrawingLine =>
  Array.from({ length: 49 }, (_, index) => {
    const angle = start + ((end - start) * index) / 48;
    return [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius] as const;
  });

function cube(x: number, y: number, size: number): DrawingStroke[] {
  const top: DrawingPoint = [x, y - size];
  const left: DrawingPoint = [x - size, y - size / 2];
  const middle: DrawingPoint = [x, y];
  const right: DrawingPoint = [x + size, y - size / 2];
  return [
    line(top, left, middle, right, top),
    line(left, [x - size, y + size / 2], [x, y + size], [x + size, y + size / 2], right),
    line(middle, [x, y + size]),
  ].map(edge);
}

function cubeFaces(x: number, y: number, size: number): DrawingFace[] {
  return [
    {
      points: line([x, y - size], [x - size, y - size / 2], [x, y], [x + size, y - size / 2]),
      tone: 'light',
    },
    {
      points: line([x - size, y - size / 2], [x, y], [x, y + size], [x - size, y + size / 2]),
      tone: 'shade',
    },
    {
      points: line([x, y], [x + size, y - size / 2], [x + size, y + size / 2], [x, y + size]),
      tone: 'clay',
    },
  ];
}

const FACES: readonly (readonly DrawingFace[])[] = [
  [
    {
      points: line(
        [100, 105],
        [232, 78],
        [232, 166],
        [170, 178],
        [139, 205],
        [139, 184],
        [100, 192],
      ),
      tone: 'light',
    },
    { points: line([100, 105], [90, 95], [222, 68], [232, 78]), tone: 'shade' },
    { points: line([90, 95], [100, 105], [100, 192], [90, 182]), tone: 'clay' },
    {
      points: line(
        [252, 142],
        [369, 118],
        [369, 204],
        [333, 211],
        [333, 235],
        [301, 218],
        [252, 228],
      ),
      tone: 'light',
    },
    { points: line([252, 142], [242, 132], [359, 108], [369, 118]), tone: 'clay' },
    { points: line([242, 132], [252, 142], [252, 228], [242, 218]), tone: 'shade' },
  ],
  [
    { points: line([239, 61], [208, 134], [152, 151]), tone: 'light' },
    { points: line([239, 61], [327, 133], [239, 154], [208, 134]), tone: 'shade' },
    { points: line([152, 151], [208, 134], [239, 154], [240, 224]), tone: 'clay' },
    { points: line([239, 154], [327, 133], [240, 224]), tone: 'light' },
    { points: line([353, 99], [365, 107], [319, 222], [305, 214]), tone: 'light' },
    { points: line([305, 214], [319, 222], [302, 240]), tone: 'clay' },
  ],
  [
    { points: line([118, 243], [240, 200], [363, 243], [240, 286]), tone: 'light' },
    ...cubeFaces(192, 193, 48),
    ...cubeFaces(288, 193, 48),
    ...cubeFaces(240, 121, 48),
  ],
  [
    { points: line([163, 129], [335, 63], [217, 147]), tone: 'light' },
    { points: line([217, 147], [335, 63], [242, 165], [219, 198]), tone: 'clay' },
    { points: line([335, 63], [289, 216], [242, 165]), tone: 'shade' },
  ],
];

// A common drawing board ties four distinct symbols to the same editorial scene.
const DRAWINGS: readonly (readonly DrawingStroke[])[] = [
  [
    edge(
      line(
        [100, 105],
        [232, 78],
        [232, 166],
        [170, 178],
        [139, 205],
        [139, 184],
        [100, 192],
        [100, 105],
      ),
    ),
    edge(
      line(
        [252, 142],
        [369, 118],
        [369, 204],
        [333, 211],
        [333, 235],
        [301, 218],
        [252, 228],
        [252, 142],
      ),
    ),
    edge(line([100, 105], [90, 95], [222, 68], [232, 78])),
    edge(line([90, 95], [90, 182], [100, 192])),
    edge(line([252, 142], [242, 132], [359, 108], [369, 118])),
    edge(line([242, 132], [242, 218], [252, 228])),
    detail(line([122, 131], [208, 114])),
    detail(line([122, 151], [184, 139])),
    detail(line([276, 170], [346, 156])),
    detail(line([276, 190], [325, 180])),
    { ...trail(arc(243, 116, 24, -0.8, 0.8)), behind: [0, 1] },
    { ...trail(arc(243, 116, 40, -0.8, 0.8)), behind: [0, 1] },
  ],
  [
    edge(line([239, 61], [327, 133], [240, 224], [152, 151], [239, 61])),
    edge(line([239, 61], [239, 154], [327, 133])),
    edge(line([152, 151], [239, 154], [240, 224])),
    edge(line([239, 61], [208, 134], [152, 151])),
    edge(line([208, 134], [239, 154], [281, 185])),
    edge(line([305, 214], [353, 99], [365, 107], [319, 222], [305, 214], [302, 240], [319, 222])),
    detail(line([114, 209], [138, 217])),
    detail(line([126, 201], [126, 225])),
    detail(line([239, 38], [239, 50])),
    detail(line([343, 145], [355, 145])),
    trail(arc(239, 148, 103, 3.35, 4.7)),
  ],
  [
    ...cube(192, 193, 48),
    ...cube(288, 193, 48),
    ...cube(240, 121, 48),
    edge(line([118, 243], [118, 251], [240, 294], [363, 251], [363, 243])),
    edge(line([135, 245], [240, 283], [347, 245])),
    edge(line([240, 286], [240, 294])),
    detail(line([155, 82], [155, 63], [176, 69])),
    detail(line([321, 78], [343, 69], [343, 90])),
    trail(line([155, 63], [240, 32], [343, 69])),
  ],
  [
    edge(line([163, 129], [335, 63], [289, 216], [242, 165], [163, 129])),
    edge(line([242, 165], [335, 63], [217, 147])),
    edge(line([217, 147], [219, 198], [242, 165])),
    detail(line([355, 135], [375, 129])),
    detail(line([362, 125], [368, 141])),
    detail(line([169, 116], [162, 95], [168, 101])),
    detail(line([317, 231], [330, 235], [334, 222])),
    trail(arc(221, 196, 72, 0.7, 2.8)),
    trail(arc(167, 237, 24, 2.9, 6)),
    trail(line([116, 242], [81, 263])),
  ],
];

const PARTS = [
  {
    strokes: [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 2, 2],
    faces: [0, 0, 0, 1, 1, 1],
  },
  {
    strokes: [0, 0, 0, 0, 0, 1, -1, -1, -1, -1, 2],
    faces: [0, 0, 0, 0, 1, 1],
  },
  {
    strokes: [-1, -1, -1, -1, -1, -1, 0, 0, 0, -1, -1, -1, 1, 1, 1],
    faces: [-1, -1, -1, -1, -1, -1, -1, 0, 0, 0],
  },
  {
    strokes: [0, 0, 0, -1, -1, -1, -1, 1, 1, 1],
    faces: [0, 0, 0],
  },
] as const;

const assign = <T extends object>(items: readonly T[], parts: readonly number[]) =>
  items.map((item, index) => ({ ...item, part: parts[index] ?? -1 }));

export const SERVICE_DRAWINGS: readonly (readonly DrawingStroke[])[] = DRAWINGS.map(
  (strokes, stage) => assign(strokes, PARTS[stage]?.strokes ?? []),
);

export const SERVICE_FACES: readonly (readonly DrawingFace[])[] = FACES.map((faces, stage) =>
  assign(faces, PARTS[stage]?.faces ?? []),
);

const STILL: PartPose = { x: 0, y: 0, angle: 0, scale: 1, pivot: [240, 160] };

export function partPose(stage: number, part: number, seconds: number, amount: number): PartPose {
  if (part < 0 || amount <= 0) return STILL;
  const t = seconds;
  const wave = (speed: number, phase = 0) => Math.sin(t * speed + phase);
  const pose = (x: number, y: number, angle: number, pivot: DrawingPoint, scale = 1): PartPose => ({
    x: x * amount,
    y: y * amount,
    angle: angle * amount,
    scale: 1 + (scale - 1) * amount,
    pivot,
  });
  switch (`${stage}:${part}`) {
    case '0:0':
      return pose(0, wave(1.3) * 6, wave(1.3) * 0.018, [165, 140]);
    case '0:1':
      return pose(0, wave(1.3, Math.PI) * 6, wave(1.3, Math.PI) * 0.018, [305, 175]);
    case '0:2':
      return pose(0, 0, 0, [243, 116], 1 + 0.14 * (0.5 + 0.5 * wave(2.6)));
    case '1:0':
      return pose(0, wave(1.4) * 4, wave(0.7) * 0.09, [240, 142]);
    case '1:1':
      return pose(-0.34 * wave(2.2) * 8, 0.94 * wave(2.2) * 8, wave(2.2) * 0.04, [302, 240]);
    case '1:2':
      return { ...pose(0, 0, 0, [239, 148]), angle: t * 0.35 };
    case '2:0':
      return pose(0, -10 * (0.5 + 0.5 * wave(1.5, -Math.PI / 2)), 0, [240, 121]);
    case '2:1':
      return pose(0, -5 * (0.5 + 0.5 * wave(1.5, -Math.PI / 2 - 0.6)), 0, [249, 60]);
    case '3:0':
      return pose(wave(0.9) * 9, wave(1.8) * 5, wave(0.9) * 0.06, [300, 120]);
    case '3:1':
      return pose(wave(0.9, -0.8) * 3, wave(1.8, -0.8) * 2, 0, [221, 230]);
    default:
      return STILL;
  }
}

export function movePoint([x, y]: DrawingPoint, pose: PartPose): DrawingPoint {
  if (pose === STILL) return [x, y];
  const cos = Math.cos(pose.angle) * pose.scale;
  const sin = Math.sin(pose.angle) * pose.scale;
  const dx = x - pose.pivot[0];
  const dy = y - pose.pivot[1];
  return [
    pose.pivot[0] + dx * cos - dy * sin + pose.x,
    pose.pivot[1] + dx * sin + dy * cos + pose.y,
  ];
}

export function insidePolygon([x, y]: DrawingPoint, polygon: DrawingLine) {
  let inside = false;
  for (let index = 0, last = polygon.length - 1; index < polygon.length; last = index++) {
    const [ax, ay] = polygon[index]!;
    const [bx, by] = polygon[last]!;
    if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) inside = !inside;
  }
  return inside;
}

export function triangulate(points: DrawingLine): number[] {
  const area = points.reduce((sum, [x, y], index) => {
    const [nx, ny] = points[(index + 1) % points.length]!;
    return sum + x * ny - nx * y;
  }, 0);
  const order = points.map((_, index) => index);
  if (area < 0) order.reverse();
  const cross = (a: DrawingPoint, b: DrawingPoint, c: DrawingPoint) =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const inside = (p: DrawingPoint, a: DrawingPoint, b: DrawingPoint, c: DrawingPoint) =>
    cross(a, b, p) > 0 && cross(b, c, p) > 0 && cross(c, a, p) > 0;
  const result: number[] = [];
  let guard = order.length * order.length;
  while (order.length > 3 && guard-- > 0) {
    for (let index = 0; index < order.length; index++) {
      const [ia, ib, ic] = [
        order[(index + order.length - 1) % order.length]!,
        order[index]!,
        order[(index + 1) % order.length]!,
      ];
      const [a, b, c] = [points[ia]!, points[ib]!, points[ic]!];
      if (cross(a, b, c) <= 0) continue;
      if (order.some((other) => ![ia, ib, ic].includes(other) && inside(points[other]!, a, b, c)))
        continue;
      result.push(ia, ib, ic);
      order.splice(index, 1);
      break;
    }
  }
  if (order.length === 3) result.push(order[0]!, order[1]!, order[2]!);
  return result;
}

const strokeLength = (points: DrawingLine) =>
  points
    .slice(1)
    .reduce(
      (sum, point, index) =>
        sum + Math.hypot(point[0] - points[index]![0], point[1] - points[index]![1]),
      0,
    );

export function scheduleStrokes(strokes: readonly DrawingStroke[], overlap = 0.45): TraceStroke[] {
  const order: StrokeTone[] = ['edge', 'detail', 'trail'];
  const sorted = order.flatMap((tone) => strokes.filter((stroke) => stroke.tone === tone));
  const span = sorted.length ? Math.min(1, overlap + (1 - overlap) / sorted.length) : 1;
  return sorted.map((stroke, index) => ({
    ...stroke,
    length: strokeLength(stroke.points),
    span,
    start: sorted.length > 1 ? ((1 - span) * index) / (sorted.length - 1) : 0,
  }));
}

export function traceLine(points: DrawingLine, amount: number): DrawingLine {
  if (amount >= 1) return points;
  const target = strokeLength(points) * Math.max(0, amount);
  const result: DrawingPoint[] = points.length ? [points[0]!] : [];
  let travelled = 0;
  for (let index = 1; index < points.length && travelled < target; index++) {
    const from = points[index - 1]!;
    const to = points[index]!;
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
    if (!length) continue;
    const step = Math.min(1, (target - travelled) / length);
    result.push([from[0] + (to[0] - from[0]) * step, from[1] + (to[1] - from[1]) * step]);
    travelled += length * step;
  }
  return result;
}
