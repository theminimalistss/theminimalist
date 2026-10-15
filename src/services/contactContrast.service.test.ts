import { describe, expect, it } from 'vitest';
import { contactSurface } from './contactContrast.service';

const palette = { light: '#f4eee5', dark: '#1a3122' };

describe('floating contact contrast', () => {
  it('uses a forest button on ivory and beige surfaces', () => {
    for (const background of ['rgb(244, 238, 229)', 'rgb(232, 221, 208)']) {
      expect(contactSurface([background], palette)).toBe('light');
    }
  });

  it('uses an ivory button over forest and other dark colours', () => {
    for (const background of ['rgb(26, 49, 34)', '#121212', 'rgb(15 20 45)']) {
      expect(contactSurface([background], palette)).toBe('dark');
    }
  });

  it('composites translucent surfaces in paint order', () => {
    expect(contactSurface(['rgba(0, 0, 0, .75)', palette.light], palette)).toBe('dark');
    expect(contactSurface(['rgb(255 255 255 / 90%)', palette.dark], palette)).toBe('light');
  });

  it('supports percentage RGB channels and short palette hex values', () => {
    expect(contactSurface(['rgb(10% 15% 10%)'], { light: '#fff', dark: '#123' })).toBe('dark');
  });

  it('ignores transparent or unrecognised layers and falls back to the canvas', () => {
    expect(contactSurface(['transparent', 'rgba(0, 0, 0, 0)', 'invalid'], palette)).toBe('light');
    expect(contactSurface(['rgba(NaN, 0, 0, .5)'], palette)).toBe('light');
    expect(contactSurface(['#000'], { light: 'invalid', dark: '#123' })).toBe('light');
  });
});
