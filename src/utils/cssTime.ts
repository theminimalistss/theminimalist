/** CSS optimisers can rewrite milliseconds as seconds. */
export function cssTimeMs(value: string, fallback: number): number {
  const match = value.trim().match(/^(\d*\.?\d+)(ms|s)$/u);
  if (!match) return fallback;
  const duration = Number(match[1]) * (match[2] === 's' ? 1000 : 1);
  return Number.isFinite(duration) ? duration : fallback;
}
