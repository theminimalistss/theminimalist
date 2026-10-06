import { describe, expect, it } from 'vitest';
import { getFocusPlacement, getPreviewPlacement } from '@/utils/particlePreview';

describe('particle preview placement', () => {
  it('keeps portrait previews inside narrow and wide viewports near any edge', () => {
    for (const [width, height] of [
      [320, 720],
      [390, 844],
      [1440, 960],
      [1024, 640],
    ] as const) {
      for (const x of [0, width / 2, width])
        for (const y of [0, height / 2, height]) {
          const rect = getPreviewPlacement({ x, y, width, height });
          expect(rect.left).toBeGreaterThanOrEqual(24);
          expect(rect.left + rect.width).toBeLessThanOrEqual(width - 24);
          expect(rect.top).toBeGreaterThanOrEqual(0);
          expect(rect.top + rect.height + 90).toBeLessThanOrEqual(height);
          expect(rect.height / rect.width).toBe(1.25);
        }
    }
  });

  it('docks the focused study beside the sculpture only when there is room', () => {
    for (const [width, height] of [
      [1440, 900],
      [1280, 720],
      [1920, 1080],
    ] as const) {
      const slot = getFocusPlacement({ width, height });
      expect(slot).not.toBeNull();
      if (!slot) continue;
      const sculptureEdge = width / 2 + Math.min(width, height) * 0.18 * 1.8;
      expect(slot.left).toBeGreaterThan(sculptureEdge);
      expect(slot.left + slot.width).toBeLessThanOrEqual(width - 48);
      expect(slot.top + slot.height + 104).toBeLessThanOrEqual(height - 176);
      expect(slot.height / slot.width).toBe(1.25);
    }
    expect(getFocusPlacement({ width: 390, height: 844 })).toBeNull();
    expect(getFocusPlacement({ width: 820, height: 1180 })).toBeNull();
  });
});
