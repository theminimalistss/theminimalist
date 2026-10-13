import { TESTIMONIAL_RAIN } from '@/constants/motion';

export type FloatPlacement = {
  x: number;
  z: number;
  fade: number;
  speed: number;
  offset: number;
  tone: number;
};

const GOLDEN = 0.6180339887;

function seeded(seed: number) {
  let state = seed % 2147483647 || 1;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

type Band = { z: readonly [number, number]; speed: number; fade: number };

function placeBand(count: number, band: Band, random: () => number, start: number, shift: number) {
  return Array.from({ length: count }, (_, index) => ({
    x: 0.05 + 0.9 * ((shift + index * GOLDEN) % 1),
    z: band.z[0] + random() * (band.z[1] - band.z[0]),
    fade: band.fade,
    speed: band.speed,
    offset: (index + 0.15 * random()) / count,
    tone: (start + index) % 5,
  }));
}

export function placeFloats(count: number, seed = 7): FloatPlacement[] {
  const random = seeded(seed);
  const { bands } = TESTIMONIAL_RAIN;
  const sizes = bands.map((band) => Math.round(band.share * count));
  sizes[sizes.length - 1] = count - sizes.slice(0, -1).reduce((sum, size) => sum + size, 0);
  const placed = bands.flatMap((band, index) => {
    const before = sizes.slice(0, index).reduce((sum, size) => sum + size, 0);
    return placeBand(sizes[index] ?? 0, band, random, before, index * 0.31);
  });
  return Array.from({ length: count }, (_, index) => placed[(index * 5) % count] ?? placed[0]!);
}

export function placeEchoes(count: number, seed = 19): FloatPlacement[] {
  const { echo } = TESTIMONIAL_RAIN;
  return placeBand(count, echo, seeded(seed), 2, 0.17);
}

export function toWorld(screen: number, vanishing: number, z: number) {
  return (
    vanishing +
    (screen - vanishing) * ((TESTIMONIAL_RAIN.perspective - z) / TESTIMONIAL_RAIN.perspective)
  );
}

export type Box = { left: number; top: number; width: number; height: number };

export type FocusInput = {
  frame: Box;
  stage: Box;
  size: { width: number; height: number };
  z: number;
  topSafe: number;
};

const clampTo = (value: number, low: number, high: number) =>
  low > high ? (low + high) / 2 : Math.min(high, Math.max(low, value));

export function focusPose({ frame, stage, size, z, topSafe }: FocusInput) {
  const { perspective, horizon, focus } = TESTIMONIAL_RAIN;
  const vanish = { x: stage.left + stage.width / 2, y: stage.top + stage.height * horizon };
  const current = perspective / (perspective - z);
  const lifted = perspective / (perspective - focus.z);
  const ratio = size.height / size.width;
  const room = Math.min(
    stage.width - focus.margin * 2,
    (stage.height - topSafe - focus.margin * 2) / ratio,
  );
  const width = Math.min(room, clampTo(frame.width * 1.25, focus.width[0], focus.width[1]));
  const height = width * ratio;
  const start = { x: frame.left + frame.width / 2, y: frame.top + frame.height / 2 };
  const middle = { x: stage.left + stage.width / 2, y: stage.top + (stage.height + topSafe) / 2 };
  const goal = {
    x: clampTo(
      start.x + (middle.x - start.x) * focus.pull,
      stage.left + focus.margin + width / 2,
      stage.left + stage.width - focus.margin - width / 2,
    ),
    y: clampTo(
      start.y + (middle.y - start.y) * focus.pull,
      stage.top + topSafe + focus.margin + height / 2,
      stage.top + stage.height - focus.margin - height / 2,
    ),
  };
  return {
    x: (goal.x - vanish.x) / lifted - (start.x - vanish.x) / current,
    y: (goal.y - vanish.y) / lifted - (start.y - vanish.y) / current,
    z: focus.z - z,
    scale: width / (size.width * lifted),
    screen: { ...goal, width, height },
  };
}

export type Size = { width: number; height: number };
export type Spot = { x: number; y: number };

function separation(a: Spot & Size, b: Spot & Size, loop: number) {
  const dx = Math.abs(a.x - b.x);
  const raw = Math.abs(a.y - b.y) % loop;
  const dy = Math.min(raw, loop - raw);
  return Math.max(dx / ((a.width + b.width) / 2), dy / ((a.height + b.height) / 2));
}

export function spreadFrames(sizes: readonly Size[], width: number, loop: number, seed = 11) {
  const random = seeded(seed);
  const order = sizes
    .map((size, index) => ({ ...size, index }))
    .sort((a, b) => b.width * b.height - a.width * a.height);
  const placed: (Spot & Size)[] = [];
  const spots: Spot[] = Array.from({ length: sizes.length }, () => ({ x: 0, y: 0 }));
  for (const frame of order) {
    const half = frame.width / 2 + TESTIMONIAL_RAIN.edge;
    let best = { x: width / 2, y: 0 };
    let bestScore = -1;
    for (let attempt = 0; attempt < TESTIMONIAL_RAIN.candidates; attempt++) {
      const candidate = {
        x: half >= width - half ? width / 2 : half + random() * (width - half * 2),
        y: random() * loop,
      };
      const score = placed.length
        ? Math.min(...placed.map((other) => separation({ ...candidate, ...frame }, other, loop)))
        : 1;
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    }
    placed.push({ ...best, width: frame.width, height: frame.height });
    spots[frame.index] = best;
  }
  return spots;
}

export function minimumSeparation(spots: readonly Spot[], sizes: readonly Size[], loop: number) {
  let least = Infinity;
  spots.forEach((a, i) =>
    spots.slice(i + 1).forEach((b, offset) => {
      const j = i + 1 + offset;
      least = Math.min(least, separation({ ...a, ...sizes[i]! }, { ...b, ...sizes[j]! }, loop));
    }),
  );
  return least;
}

export function initials(name: string) {
  const words = name
    .replace(/[^\p{L}\p{N}\s&]/gu, ' ')
    .split(/\s+/u)
    .filter(Boolean);
  const meaningful = words.filter((word) => !/^(the|and|&)$/iu.test(word));
  const source = meaningful.length ? meaningful : words;
  return source
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}
