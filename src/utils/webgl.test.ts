import { describe, expect, it } from 'vitest';
import { clamp01, easeInOutCubic } from '@/utils/easing';
import { createFullscreenScene, hexToRgb } from '@/utils/webgl';

describe('webgl helpers', () => {
  it('reads palette tokens as normalized colors', () => {
    expect(hexToRgb(' #1a3122')).toEqual([26 / 255, 49 / 255, 34 / 255]);
    expect(hexToRgb('not-a-color')).toEqual([0, 0, 0]);
  });

  it('reports no scene when WebGL is unavailable', () => {
    expect(createFullscreenScene(document.createElement('canvas'), '')).toBeNull();
  });

  it('eases within bounds', () => {
    expect(clamp01(-1)).toBe(0);
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(2)).toBe(1);
  });
});
