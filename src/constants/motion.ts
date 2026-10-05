export const MOTION = {
  loopDuration: 90_000,
  maxFrameDelta: 64,
  perspective: 1100,
  depth: 430,
  turns: 1.25,
  wheelImpulse: 6e-7,
  maxVelocity: 1 / 3_000,
  velocitySettle: 650,
} as const;

export const LOADER = {
  minimumDuration: 1_800,
  reducedDuration: 400,
  maximumDuration: 8_000,
  fontTimeout: 500,
  bloomDuration: 1_500,
  exitDuration: 1_100,
  staticExitDuration: 700,
} as const;

export const MENU_MORPH = {
  openDuration: 950,
  closeDuration: 750,
  closeDelay: 160,
} as const;

export const COLLECTION_MORPH = {
  duration: 900,
  stagger: 45,
  easing: 'cubic-bezier(0.65, 0, 0.25, 1)',
} as const;

export const COMPACT_QUERY = '(max-width: 767px)';
