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
    x: 0.1 + 0.8 * ((shift + index * GOLDEN) % 1),
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
