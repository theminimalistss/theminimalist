import { MOTION } from '@/constants/motion';

export type CardPose = { x: number; y: number; width: number; rotateY: number; rotateZ: number };

export type CardBox = { x: number; y: number; width: number };

export type Region = { left: number; top: number; right: number; bottom: number };

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

export function getGalleryKeyframes(from: CardPose, to: CardBox): Keyframe[] {
  const depth = `perspective(${MOTION.perspective}px) `;
  return [
    {
      transform:
        depth +
        flatTransform(
          from.x - to.x,
          from.y - to.y,
          from.width / to.width,
          from.rotateY,
          from.rotateZ,
        ),
    },
    { transform: depth + flatTransform(0, 0, 1, 0, 0) },
  ];
}

export function getSpiralKeyframes(
  from: CardPose,
  layout: CardBox,
  spiralTransform: string,
): Keyframe[] {
  return [
    {
      transform: flatTransform(
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

export function getChromeKeyframes(from: Region, to: Region, dip: number): Keyframe[] {
  const dx = from.left - to.left;
  const dy = from.top - to.top;
  return [
    { transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`, opacity: 1 },
    { opacity: dip, offset: 0.4 },
    { transform: 'translate(0px, 0px)', opacity: 1 },
  ];
}
