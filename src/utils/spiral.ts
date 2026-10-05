import { MOTION } from '@/constants/motion';

export type SpiralGeometry = {
  width: number;
  height: number;
  cardWidth: number;
  compact: boolean;
};

const WHEEL_LINE_HEIGHT = 16;
const POSE_PATTERN = /scale\(([-\d.]+)\) rotateY\(([-\d.]+)deg\) rotateZ\(([-\d.]+)deg\)/;

export function wrapProgress(progress: number): number {
  return ((progress % 1) + 1) % 1;
}

export function normalizeWheelDelta(deltaY: number, deltaMode: number, pageHeight: number) {
  if (deltaMode === 1) return deltaY * WHEEL_LINE_HEIGHT;
  if (deltaMode === 2) return deltaY * pageHeight;
  return deltaY;
}

/** Scrolling down (positive direction) keeps works rising, which lowers progress. */
export function getCruiseVelocity(direction: 1 | -1) {
  return -direction / MOTION.loopDuration;
}

export function applyWheelImpulse(velocity: number, deltaY: number) {
  const next = velocity - deltaY * MOTION.wheelImpulse;
  return Math.max(-MOTION.maxVelocity, Math.min(MOTION.maxVelocity, next));
}

export function settleVelocity(velocity: number, cruise: number, elapsed: number) {
  return cruise + (velocity - cruise) * Math.exp(-elapsed / MOTION.velocitySettle);
}

export function getSpiralPosition(progress: number, geometry: SpiralGeometry) {
  const position = wrapProgress(progress) - 0.5;
  const angle = position * Math.PI * 2 * MOTION.turns;
  const depth = (Math.cos(angle) - 1) * (geometry.compact ? 230 : MOTION.depth);
  const scale = MOTION.perspective / (MOTION.perspective - depth);
  const radius = geometry.width * (geometry.compact ? 0.25 : 0.32);
  const cardHeight = geometry.cardWidth * 1.25;
  // The wrap occurs beyond the clipping region, including the card's projected height.
  const travel = geometry.height + cardHeight * 0.9;
  const x = Math.sin(angle) * radius;
  const y = position * travel;
  const rotateY = Math.sin(angle) * (geometry.compact ? -8 : -18);
  const rotateZ = Math.sin(angle) * (geometry.compact ? 3 : 5);
  return {
    x,
    y,
    scale,
    rotateY,
    rotateZ,
    zIndex: Math.round(scale * 100),
    transform: `translate3d(${x.toFixed(3)}px, ${y.toFixed(3)}px, 0) scale(${scale.toFixed(5)}) rotateY(${rotateY.toFixed(3)}deg) rotateZ(${rotateZ.toFixed(3)}deg)`,
  };
}

export function readSpiralPose(transform: string) {
  const match = POSE_PATTERN.exec(transform);
  if (!match) return null;
  const [, scale = '1', rotateY = '0', rotateZ = '0'] = match;
  return { scale: Number(scale), rotateY: Number(rotateY), rotateZ: Number(rotateZ) };
}
