import clickMp3 from '@/assets/audio/click.mp3';
import clickWebm from '@/assets/audio/click.webm';
import detentMp3 from '@/assets/audio/detent.mp3';
import detentWebm from '@/assets/audio/detent.webm';
import hoverMp3 from '@/assets/audio/hover.mp3';
import hoverWebm from '@/assets/audio/hover.webm';
import menuCloseMp3 from '@/assets/audio/menu-close.mp3';
import menuCloseWebm from '@/assets/audio/menu-close.webm';
import menuOpenMp3 from '@/assets/audio/menu-open.mp3';
import menuOpenWebm from '@/assets/audio/menu-open.webm';
import navigateMp3 from '@/assets/audio/navigate.mp3';
import navigateWebm from '@/assets/audio/navigate.webm';
import soundOnMp3 from '@/assets/audio/sound-on.mp3';
import soundOnWebm from '@/assets/audio/sound-on.webm';
import switchMp3 from '@/assets/audio/switch.mp3';
import switchWebm from '@/assets/audio/switch.webm';

export type SoundSpec = {
  webm: string;
  mp3: string;
  volume: number;
  throttle?: number;
  group?: 'transition';
};

export const SOUNDS = {
  hover: { webm: hoverWebm, mp3: hoverMp3, volume: 0.18, throttle: 70 },
  click: { webm: clickWebm, mp3: clickMp3, volume: 0.45 },
  navigate: { webm: navigateWebm, mp3: navigateMp3, volume: 0.4, group: 'transition' },
  'menu-open': { webm: menuOpenWebm, mp3: menuOpenMp3, volume: 0.45, group: 'transition' },
  'menu-close': { webm: menuCloseWebm, mp3: menuCloseMp3, volume: 0.4, group: 'transition' },
  switch: { webm: switchWebm, mp3: switchMp3, volume: 0.4, group: 'transition' },
  detent: { webm: detentWebm, mp3: detentMp3, volume: 0.3, throttle: 45 },
  'sound-on': { webm: soundOnWebm, mp3: soundOnMp3, volume: 0.35 },
} satisfies Record<string, SoundSpec>;

export type SoundName = keyof typeof SOUNDS;

export const SOUND_MIX = {
  master: 0.7,
  pitchVariation: 0.06,
  groupGap: 150,
  whooshGap: 140,
} as const;

export const SWELL = {
  air: 0.045,
  tone: 0.05,
  open: [587.33, 880],
  close: [440, 659.25],
} as const;

export const HEARTBEAT = {
  period: 1000,
  dub: 0.24,
} as const;

export type PulseSpec = {
  heart: number;
  pluck: number;
  pluckDecay: number;
  noteChance: number;
  ghostChance: number;
  echo: number;
  feedback: number;
  scale: readonly number[];
};

export type AmbientPreset = {
  level: number;
  fadeIn: number;
  glide: number;
  reverbSeconds: number;
  chordSeconds: number;
  filter: number;
  filterSweep: number;
  chimeLevel: number;
  chimeEvery: readonly [number, number];
  /** Bell overtone (ratio, relative level) layered on each chime; 0 keeps a pure tone. */
  chimeBell: readonly [number, number];
  /** The noise layer: a low surf at home, high air in the Works sculpture. */
  air: { type: BiquadFilterType; frequency: number };
  waveLevel: readonly [number, number];
  waveSeconds: number;
  chords: readonly (readonly number[])[];
  chimes: readonly number[];
  pulse?: PulseSpec;
};

export const AMBIENT = {
  level: 0.06,
  fadeIn: 8,
  glide: 8,
  reverbSeconds: 6,
  chordSeconds: 36,
  filter: 720,
  filterSweep: 200,
  chimeLevel: 0.028,
  chimeEvery: [14, 26],
  chimeBell: [1, 0],
  air: { type: 'lowpass', frequency: 650 },
  waveLevel: [0.002, 0.011],
  waveSeconds: 14,
  chords: [
    [146.83, 220, 277.18, 329.63, 369.99],
    [123.47, 185, 220, 293.66, 329.63],
    [130.81, 196, 246.94, 293.66, 329.63],
    [110, 164.81, 220, 277.18, 329.63],
  ],
  chimes: [587.33, 659.25, 739.99, 880],
} as const satisfies AmbientPreset;

export const AMBIENT_WORKS = {
  level: 0.05,
  fadeIn: 5,
  glide: 4,
  reverbSeconds: 5.5,
  chordSeconds: 16,
  filter: 950,
  filterSweep: 260,
  chimeLevel: 0.012,
  chimeEvery: [20, 34],
  chimeBell: [1, 0],
  air: { type: 'lowpass', frequency: 520 },
  waveLevel: [0.001, 0.004],
  waveSeconds: 16,
  chords: [
    [174.61, 261.63, 329.63, 392, 440],
    [146.83, 220, 261.63, 329.63, 349.23],
    [116.54, 174.61, 220, 293.66, 329.63],
    [130.81, 196, 293.66, 329.63, 440],
  ],
  chimes: [1046.5, 1174.66, 1318.51],
  pulse: {
    heart: 0.018,
    pluck: 0.026,
    pluckDecay: 1.8,
    noteChance: 0.45,
    ghostChance: 0.12,
    echo: 0.5,
    feedback: 0.32,
    scale: [523.25, 587.33, 659.25, 783.99, 880, 1046.5],
  },
} as const satisfies AmbientPreset;

export const AMBIENTS = { home: AMBIENT, works: AMBIENT_WORKS } as const;

export type SoundScene = keyof typeof AMBIENTS;

/** Synthesized glass feedback for the Works sculpture; each point has its own note. */
export const GLASS = {
  scale: [880, 987.77, 1108.73, 1318.51, 1479.98, 1760, 1975.53, 2217.46],
  room: 1.8,
  wet: 0.35,
  partials: [
    [1, 1],
    [2.76, 0.35],
    [5.4, 0.12],
  ],
  hover: { frequency: 2349.32, level: 0.022, decay: 0.28 },
  click: { frequency: 880, level: 0.055, decay: 0.7 },
  note: { level: 0.045, decay: 1.1 },
  focus: { level: 0.016, decay: 1.6 },
  shimmer: { level: 0.011, steps: 6, spread: 0.52 },
  grab: { level: 0.05 },
  fling: { level: 0.05, threshold: 0.08 },
} as const;
