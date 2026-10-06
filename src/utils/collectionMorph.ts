import { COLLECTION_MORPH, MOTION } from '@/constants/motion';

export type CardPose = {
  x: number;
  y: number;
  width: number;
  rotateY: number;
  rotateZ: number;
  depth: number;
};

export type Point = { x: number; y: number };

export type CardBox = { x: number; y: number; width: number };

export type Region = { left: number; top: number; right: number; bottom: number };

const DEPTH = `perspective(${MOTION.perspective}px) `;

function flatTransform(dx: number, dy: number, scale: number, rotateY: number, rotateZ: number) {
  return `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg)`;
}

export function getClipInset(box: Region, region: Region) {
  const top = region.top - box.top;
  const right = box.right - region.right;
  const bottom = box.bottom - region.bottom;
  const left = region.left - box.left;
  return `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px)`;
}

/**
 * Keeps the spiral's vanishing point and stacking order at the start of the flight, so a
 * card leaves exactly as it was drawn and settles flat on its gallery box.
 */
export function getGalleryKeyframes(from: CardPose, to: CardBox, vanish: Point = to): Keyframe[] {
  const ox = vanish.x - to.x;
  const oy = vanish.y - to.y;
  return [
    {
      transform:
        `translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px) ${DEPTH}` +
        flatTransform(
          from.x - to.x - ox,
          from.y - to.y - oy,
          from.width / to.width,
          from.rotateY,
          from.rotateZ,
        ),
      zIndex: from.depth,
    },
    {
      transform: `translate(0px, 0px) ${DEPTH}` + flatTransform(0, 0, 1, 0, 0),
      zIndex: from.depth,
    },
  ];
}

export function getSpiralKeyframes(
  from: CardPose,
  layout: CardBox,
  spiralTransform: string,
): Keyframe[] {
  return [
    {
      transform:
        DEPTH +
        flatTransform(
          from.x - layout.x,
          from.y - layout.y,
          from.width / layout.width,
          from.rotateY,
          from.rotateZ,
        ),
    },
    { transform: spiralTransform },
  ];
}

function uniformScale(from: Region, to: Region) {
  const width = (from.right - from.left) / (to.right - to.left);
  const height = (from.bottom - from.top) / (to.bottom - to.top);
  return Number.isFinite(height) && Math.abs(width - height) < 0.1 ? height : 1;
}

/** Glides text from its old box, scaling between font sizes; only long moves dip. */
export function getChromeKeyframes(from: Region, to: Region, dip: number): Keyframe[] {
  const dx = from.left - to.left;
  const dy = from.top - to.top;
  const scale = uniformScale(from, to);
  const fade =
    Math.hypot(dx, dy) > COLLECTION_MORPH.chromeDipDistance ? [{ opacity: dip, offset: 0.4 }] : [];
  return [
    {
      transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${scale.toFixed(4)})`,
      transformOrigin: '0 0',
      opacity: 1,
    },
    ...fade,
    { transform: 'translate(0px, 0px) scale(1)', transformOrigin: '0 0', opacity: 1 },
  ];
}

export function getChromeEntrance(): Keyframe[] {
  return [{ opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1 }];
}

export function needsChromeMove(from: Region, to: Region) {
  const moved = Math.hypot(from.left - to.left, from.top - to.top) > 1;
  return moved || Math.abs(uniformScale(from, to) - 1) > 0.01;
}
