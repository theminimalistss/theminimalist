import { describe, expect, it } from 'vitest';
import { clamp01, easeInOutCubic } from '@/utils/easing';
import { createFullscreenScene, hexToRgb, fitCanvas } from '@/utils/webgl';

describe('webgl helpers', () => {
  it('caps a 4K canvas buffer without changing its aspect ratio', () => {
    const canvas = document.createElement('canvas');
    expect(fitCanvas(canvas, 3840, 2160)).toBe(true);
    expect(canvas.width).toBe(2048);
    expect(canvas.height).toBe(1152);
    expect(fitCanvas(canvas, 3840, 2160)).toBe(false);
  });
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
