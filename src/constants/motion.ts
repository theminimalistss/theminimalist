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
  minimumDuration: { full: 1_800, brief: 650 },
  bloomDuration: { full: 1_500, brief: 450 },
  reducedDuration: 400,
  maximumDuration: 8_000,
  fontTimeout: 500,
  exitDuration: 1_100,
  shineDuration: 900,
  shinePeriod: 2_600,
  shineLead: 0.6,
  staticExitDuration: 700,
} as const;

export const MENU_MORPH = {
  openDuration: 950,
  closeDuration: 750,
  closeDelay: 160,
} as const;

export const COLLECTION_MORPH = {
  duration: 1_050,
  stagger: 40,
  easing: 'cubic-bezier(0.45, 0, 0.15, 1)',
  chromeDip: 0.25,
} as const;

export const MEDIA_FLIGHT = {
  duration: 720,
  easing: 'cubic-bezier(0.45, 0, 0.15, 1)',
  panelIn: 520,
  panelOut: 260,
  panelDelay: 180,
  imageWait: 400,
} as const;

export const COMPACT_QUERY = '(max-width: 767px)';
