export type Point3 = readonly [number, number, number];
export type ArtFace = { d: string; tone: 'light' | 'shade' | 'clay' };
export type ArtLine = { d: string; tone: 'edge' | 'hidden' | 'detail' | 'cord' };
export type ArtFold = { x: number; y: number; rotate: number; scale: number };
export type ArtLayer = { faces: ArtFace[]; lines: ArtLine[]; fold?: ArtFold };
export type ProductArt = { layers: ArtLayer[] };

const COS = Math.cos(Math.PI / 6);
const CENTER = { x: 300, y: 330 };

export function iso([x, y, z]: Point3): [number, number] {
  return [CENTER.x + (x - y) * COS, CENTER.y + (x + y) * 0.5 - z];
}

export function pathOf(points: readonly Point3[], close = false) {
  const body = points
    .map((point) =>
      iso(point)
        .map((value) => value.toFixed(1))
        .join(' '),
    )
    .join(' L');
  return `M${body}${close ? ' Z' : ''}`;
}

function slab(
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
): { faces: ArtFace[]; lines: ArtLine[] } {
  const p = (px: number, py: number, pz: number): Point3 => [px, py, pz];
  const top = [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)];
  const left = [p(x, y + d, z + h), p(x + w, y + d, z + h), p(x + w, y + d, z), p(x, y + d, z)];
  const right = [p(x + w, y, z + h), p(x + w, y + d, z + h), p(x + w, y + d, z), p(x + w, y, z)];
  return {
    faces: [
      { d: pathOf(top, true), tone: 'light' },
      { d: pathOf(left, true), tone: 'shade' },
      { d: pathOf(right, true), tone: 'clay' },
    ],
    lines: [
      { d: pathOf(top, true), tone: 'edge' },
      {
        d: pathOf([p(x, y + d, z + h), p(x, y + d, z), p(x + w, y + d, z), p(x + w, y, z)]),
        tone: 'edge',
      },
      { d: pathOf([p(x + w, y + d, z + h), p(x + w, y + d, z)]), tone: 'edge' },
      { d: pathOf([p(x + w, y, z + h), p(x + w, y, z)]), tone: 'edge' },
      { d: pathOf([p(x, y + d, z), p(x, y, z), p(x + w, y, z)]), tone: 'hidden' },
      { d: pathOf([p(x, y, z + h), p(x, y, z)]), tone: 'hidden' },
    ],
  };
}

function ring(cx: number, cy: number, z: number, r: number, from = 0, to = Math.PI * 2) {
  return Array.from({ length: 49 }, (_, index): Point3 => {
    const angle = from + ((to - from) * index) / 48;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, z];
  });
}

function onTop(x: number, y: number, z: number, w: number, d: number): Point3[] {
  return [
    [x, y, z],
    [x + w, y, z],
    [x + w, y + d, z],
    [x, y + d, z],
  ];
}

const layer = (...parts: ArtLayer[]): ArtLayer => ({
  faces: parts.flatMap((part) => part.faces),
  lines: parts.flatMap((part) => part.lines),
});
const lines = (items: ArtLine[]): ArtLayer => ({ faces: [], lines: items });
const fold = (part: ArtLayer, x: number, y: number, rotate: number, scale: number): ArtLayer => ({
  ...part,
  fold: { x, y, rotate, scale },
});

function software(): ProductArt {
  const levels = [0, 95, 190];
  const panes = levels.map((z) => slab(-130, -95, z, 260, 190, 8));
  const corners = [
    [-130, -95],
    [130, -95],
    [130, 95],
    [-130, 95],
  ] as const;
  const tethers = (z: number) =>
    lines(
      corners.map(([x, y]) => ({
        d: pathOf([
          [x, y, z + 8],
          [x, y, z + 95],
        ]),
        tone: 'hidden',
      })),
    );
  const lift = 198;
  const grid = lines(
    [0, 1, 2].flatMap((column) =>
      [0, 1].map((row) => ({
        d: pathOf(onTop(-110 + column * 78, -75 + row * 80, 8, 62, 64), true),
        tone: 'detail' as const,
      })),
    ),
  );
  const chart = lines([
    { d: pathOf(onTop(-100, -70, 103, 90, 70), true), tone: 'detail' },
    ...[0, 30, 60].map((x, index) => ({
      d: pathOf(onTop(x, 20 - index * 18, 103, 18, 50 + index * 18), true),
      tone: 'detail' as const,
    })),
  ]);
  const window = lines([
    {
      d: pathOf([
        [-110, -80, lift],
        [110, -80, lift],
      ]),
      tone: 'detail',
    },
    ...[-100, -85, -70].map((x) => ({
      d: pathOf(ring(x, -88, lift, 3), true),
      tone: 'detail' as const,
    })),
    ...[-40, -10, 20, 50].map((y, row) => ({
      d: pathOf([
        [-100, y, lift],
        [row % 2 ? 40 : 90, y, lift],
      ]),
      tone: 'detail' as const,
    })),
    {
      d: pathOf([
        [60, 30, lift + 30],
        [60, 30, lift + 4],
        [66, 36, lift + 10],
        [76, 36, lift + 4],
        [60, 30, lift + 30],
      ]),
      tone: 'edge',
    },
  ]);
  return {
    layers: [
      fold(layer(panes[0]!, grid), 0, 80, -14, 0.82),
      tethers(levels[0]!),
      fold(layer(panes[1]!, chart), -110, 10, 12, 0.86),
      tethers(levels[1]!),
      fold(layer(panes[2]!, window), 30, -110, -10, 0.88),
    ],
  };
}

function templates(): ProductArt {
  const page = slab(-160, -120, 0, 320, 240, 8);
  const slots = [
    { x: -140, y: -100, w: 280, d: 30 },
    { x: -140, y: -55, w: 280, d: 90 },
    ...[0, 1, 2].map((index) => ({ x: -140 + index * 96, y: 50, w: 88, d: 50 })),
  ];
  const outlines = lines(
    slots.map((slot) => ({
      d: pathOf(onTop(slot.x, slot.y, 8, slot.w, slot.d), true),
      tone: 'detail',
    })),
  );
  const tether = (x: number, y: number, from: number, to: number): ArtLine => ({
    d: pathOf([
      [x, y, from],
      [x, y, to],
    ]),
    tone: 'hidden',
  });
  const heroText = lines([
    {
      d: pathOf([
        [-120, -40, 126],
        [20, -40, 126],
      ]),
      tone: 'detail',
    },
    {
      d: pathOf([
        [-120, -20, 126],
        [-20, -20, 126],
      ]),
      tone: 'detail',
    },
    { d: pathOf(onTop(60, -45, 126, 70, 70), true), tone: 'detail' },
  ]);
  const headerText = lines(
    [-120, -95, -70].map((x) => ({
      d: pathOf([
        [x, -88, 184],
        [x + 16, -88, 184],
      ]),
      tone: 'detail' as const,
    })),
  );
  return {
    layers: [
      fold(layer(page, outlines), 0, 50, 6, 0.7),
      lines([
        tether(-140, 35, 8, 120),
        tether(140, 35, 8, 120),
        tether(140, -55, 8, 120),
        tether(52, 100, 8, 70),
        tether(140, 100, 8, 70),
        tether(140, -70, 8, 180),
        tether(-140, -70, 8, 180),
      ]),
      fold(slab(52, 50, 70, 88, 50, 6), 150, -10, 24, 0.5),
      fold(layer(slab(-140, -55, 120, 280, 90, 6), heroText), -160, -30, -14, 0.78),
      fold(layer(slab(-140, -100, 180, 280, 30, 4), headerText), 70, -130, 10, 0.8),
    ],
  };
}

function hardware(): ProductArt {
  const radius = 92;
  const height = 250;
  const front = (z: number) => ring(0, 0, z, radius, -Math.PI / 4, (Math.PI * 3) / 4);
  const back = (z: number) => ring(0, 0, z, radius, (Math.PI * 3) / 4, (Math.PI * 7) / 4);
  const edgeAt = (angle: number, from: number, to: number): Point3[] => [
    [Math.cos(angle) * radius, Math.sin(angle) * radius, from],
    [Math.cos(angle) * radius, Math.sin(angle) * radius, to],
  ];
  const section = (from: number, to: number, tone: ArtFace['tone']): ArtLayer => ({
    faces: [{ d: pathOf([...front(to), ...front(from).reverse()], true), tone }],
    lines: [
      { d: pathOf(front(from)), tone: from ? 'detail' : 'edge' },
      { d: pathOf(front(to)), tone: 'detail' },
      { d: pathOf(edgeAt(-Math.PI / 4, from, to)), tone: 'edge' },
      { d: pathOf(edgeAt((Math.PI * 3) / 4, from, to)), tone: 'edge' },
    ],
  });
  const cap: ArtLayer = {
    faces: [{ d: pathOf(ring(0, 0, height, radius), true), tone: 'light' }],
    lines: [
      { d: pathOf(ring(0, 0, height, radius), true), tone: 'edge' },
      { d: pathOf(ring(0, 0, height, radius * 0.72), true), tone: 'detail' },
      ...[0, 1, 2, 3, 4, 5].map((index) => {
        const angle = (index / 6) * Math.PI * 2;
        return {
          d: pathOf(ring(Math.cos(angle) * 48, Math.sin(angle) * 48, height, 4), true),
          tone: 'detail' as const,
        };
      }),
    ],
  };
  const cord = lines([
    {
      d: pathOf([
        [radius * 0.5, radius * 0.85, 6],
        [radius * 1.3, radius * 1.5, 0],
        [radius * 2.1, radius * 1.4, 0],
        [radius * 2.6, radius * 2.1, 0],
      ]),
      tone: 'cord',
    },
  ]);
  const board = slab(-40, -30, 125, 80, 60, 6);
  const internals = lines([
    { d: pathOf(back(0)), tone: 'hidden' },
    ...[70, 50, 28].map((r, index) => ({
      d: pathOf(ring(0, 0, 70 + index * 14, r), true),
      tone: 'hidden' as const,
    })),
    ...[44, 24].map((r, index) => ({
      d: pathOf(ring(0, 0, 175 + index * 10, r), true),
      tone: 'hidden' as const,
    })),
    ...board.lines.map((line) => ({ ...line, tone: 'hidden' as const })),
  ]);
  return {
    layers: [
      internals,
      fold(cord, -60, -20, -20, 0.3),
      fold(section(0, 80, 'shade'), 0, 40, 0, 0.9),
      fold(section(80, 170, 'clay'), 0, 110, 0, 0.94),
      fold(section(170, height, 'shade'), 0, 190, 0, 0.96),
      fold(cap, 0, -120, 40, 0.55),
    ],
  };
}

export const PRODUCT_ART: readonly ProductArt[] = [software(), templates(), hardware()];
