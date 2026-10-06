export const TESSERACT = {
  yaw: -0.62,
  pitch: 0.42,
  rotationSpeed: 0.000065,
  dragSpeed: 0.006,
  maxPitch: 1.1,
  maxPixelRatio: 1.5,
  maxBufferSize: 1800,
  cameraDistance: 5,
  scale: 0.18,
  idleFrame: 1000 / 30,
  /** Pause and resume ease over this many milliseconds. */
  holdDuration: 900,
  /** A released drag keeps its momentum, decaying with this time constant (ms). */
  flingDecay: 520,
  maxFling: 0.0035,
  /** Bringing a study to the front, or resetting, glides over this many milliseconds. */
  steerDuration: 1300,
  nudgeDuration: 320,
  nudge: 0.18,
  /** Offsets keep a front-facing study in a three-quarter view instead of flat. */
  frontYaw: 0.34,
  frontPitch: 0.3,
  /** Another point must be this much nearer before it takes the focus. */
  focusMargin: 0.12,
  /** On arrival the edges are traced in over this many milliseconds… */
  traceDuration: 2600,
  untraceDuration: 1500,
  wander: {
    every: [9_000, 16_000],
    blend: 2_500,
    flipChance: 0.35,
    speed: [0.6, 1.3],
    pitch: [-0.45, 0.85],
  },
  /** …and the points appear once this much of the trace is drawn. */
  pointsAt: 0.8,
} as const;
