export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function easeInOutCubic(value: number) {
  const t = clamp01(value);
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
