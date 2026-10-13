export const MOTION = {
  loopDuration: 90_000,
  maxFrameDelta: 64,
  perspective: 1100,
  depth: 430,
  turns: 1.25,
  wheelImpulse: 6e-7,
  maxVelocity: 1 / 3_000,
  velocitySettle: 650,
  wheelSoundRange: 360,
  detentSpeed: 3,
  hoverCruise: 0.2,
  motionDuration: 900,
} as const;

export const LOADER = {
  minimumDuration: { full: 1_800, brief: 650 },
  bloomDuration: { full: 1_500, brief: 450 },
  reducedDuration: 400,
  maximumDuration: 12_000,
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
  chromeDipDistance: 120,
} as const;

export const COMPACT_QUERY = '(max-width: 767px)';

export const LOGO_DOODLE = {
  boil: { scale: 2.6, frames: 3, interval: 110, decay: 0.35, push: 0.012 },
  sway: { stiffness: 90, damping: 7, push: 0.35, limit: 60 },
} as const;

export const FOUNDER_SHOWCASE = {
  interval: 7_000,
  marqueeDuration: 65_000,
  tilt: 5,
  travel: 7,
  slideDuration: 1_300,
  slideEasing: 'cubic-bezier(0.83, 0, 0.17, 1)',
  swipe: 48,
} as const;

export const TESTIMONIAL_RAIN = {
  perspective: 680,
  horizon: 0.38,
  bands: [
    { share: 0.3, z: [60, 160], speed: 22, fade: 1 },
    { share: 0.38, z: [-420, -300], speed: 22, fade: 0.82 },
    { share: 0.32, z: [-1050, -880], speed: 22, fade: 0.6 },
  ],
  candidates: 80,
  videoCheck: 500,
  echo: { z: [-2300, -1800], speed: 8, fade: 0.26 },
  ease: 260,
  release: 180,
  edge: 16,
  focus: { z: 220, pull: 0.45, width: [340, 420], margin: 24 },
} as const;
