export type ContactSurface = 'light' | 'dark';
type Colour = { channels: readonly number[]; alpha: number };

function colour(value: string): Colour | null {
  const hex = value.trim().match(/^#([\da-f]{6}|[\da-f]{3})$/iu)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((part) => part + part).join('') : hex;
    return {
      channels: [0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16) / 255),
      alpha: 1,
    };
  }
  const match = value.match(/^rgba?\(([^)]+)\)$/iu);
  if (!match) return null;
  const parts = match[1]!.trim().split(/[\s,/]+/u);
  if (parts.length < 3 || parts.length > 4) return null;
  const channels = parts
    .slice(0, 3)
    .map((part) => parseFloat(part) / (part.endsWith('%') ? 100 : 255));
  const opacity = parts[3] ?? '1';
  const alpha = parseFloat(opacity) / (opacity.endsWith('%') ? 100 : 1);
  if (![...channels, alpha].every((part) => Number.isFinite(part) && part >= 0 && part <= 1))
    return null;
  return { channels, alpha };
}

function luminance(channels: readonly number[]) {
  const linear = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
}

function contrast(first: readonly number[], second: readonly number[]) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Backgrounds are ordered from the hit element outward to the page canvas. */
export function contactSurface(
  backgrounds: readonly string[],
  palette: { light: string; dark: string },
): ContactSurface {
  const light = colour(palette.light);
  const dark = colour(palette.dark);
  if (!light || !dark) return 'light';
  let background = light.channels;
  for (const value of [...backgrounds].reverse()) {
    const layer = colour(value);
    if (layer)
      background = layer.channels.map(
        (channel, index) => channel * layer.alpha + background[index]! * (1 - layer.alpha),
      );
  }
  return contrast(light.channels, background) > contrast(dark.channels, background)
    ? 'dark'
    : 'light';
}
