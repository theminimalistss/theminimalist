import { describe, expect, it } from 'vitest';
import {
  getChromeKeyframes,
  getClipInset,
  getGalleryKeyframes,
  getSpiralKeyframes,
} from '@/utils/collectionMorph';
import { getSpiralPosition, readSpiralPose } from '@/utils/spiral';

const pose = { x: 300, y: 200, width: 200, rotateY: -12, rotateZ: 4 };

describe('collection morph', () => {
  it('reads the pose back from a spiral transform', () => {
    const position = getSpiralPosition(0.3, {
      width: 900,
      height: 800,
      cardWidth: 400,
      compact: false,
    });
    const read = readSpiralPose(position.transform);
    expect(read?.scale).toBeCloseTo(position.scale, 4);
    expect(read?.rotateY).toBeCloseTo(position.rotateY, 2);
    expect(read?.rotateZ).toBeCloseTo(position.rotateZ, 2);
    expect(readSpiralPose('none')).toBeNull();
  });

  it('starts gallery cards on their spiral pose and settles them flat', () => {
    const [from, to] = getGalleryKeyframes(pose, { x: 100, y: 500, width: 400 });
    expect(from?.transform).toContain('translate3d(200.00px, -300.00px, 0) scale(0.5000)');
    expect(from?.transform).toContain('rotateY(-12.00deg) rotateZ(4.00deg)');
    expect(to?.transform).toContain('translate3d(0.00px, 0.00px, 0) scale(1.0000)');
  });

  it('starts spiral cards on their gallery box and ends on the live spiral pose', () => {
    const flat = { ...pose, rotateY: 0, rotateZ: 0 };
    const spiral = 'translate3d(10px, 20px, 0) scale(0.9) rotateY(5deg) rotateZ(1deg)';
    const [from, to] = getSpiralKeyframes(flat, { x: 250, y: 250, width: 400 }, spiral);
    expect(from?.transform).toContain('translate3d(50.00px, -50.00px, 0) scale(0.5000)');
    expect(to?.transform).toBe(spiral);
  });

  it('expresses a clip region relative to the clipped element', () => {
    const box = { left: 100, top: 50, right: 900, bottom: 650 };
    expect(getClipInset(box, box)).toBe('inset(0.0px 0.0px 0.0px 0.0px)');
    expect(getClipInset(box, { left: 0, top: 0, right: 1000, bottom: 700 })).toBe(
      'inset(-50.0px -100.0px -50.0px -100.0px)',
    );
  });

  it('glides persistent chrome from its old corner with a soft dip', () => {
    const from = { left: 40, top: 300, right: 400, bottom: 500 };
    const to = { left: 40, top: 160, right: 900, bottom: 240 };
    const [start, middle, end] = getChromeKeyframes(from, to, 0.25);
    expect(start?.transform).toBe('translate(0.0px, 140.0px)');
    expect(middle).toEqual({ opacity: 0.25, offset: 0.4 });
    expect(end?.transform).toBe('translate(0px, 0px)');
  });
});
