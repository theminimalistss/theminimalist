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
  waveLevel: [0.002, 0.011],
  waveSeconds: 14,
  chords: [
    [146.83, 220, 277.18, 329.63, 369.99],
    [123.47, 185, 220, 293.66, 329.63],
    [130.81, 196, 246.94, 293.66, 329.63],
    [110, 164.81, 220, 277.18, 329.63],
  ],
  chimes: [587.33, 659.25, 739.99, 880],
} as const;
