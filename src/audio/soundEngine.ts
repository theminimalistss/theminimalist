import { createAmbient, createImpulse, type Ambient } from '@/audio/ambient';
import {
  AMBIENTS,
  GLASS,
  SOUND_MIX,
  SOUNDS,
  SWELL,
  type SoundName,
  type SoundScene,
} from '@/constants/sounds';

type Listener = () => void;
type PlayOptions = { volume?: number };

const AudioContextClass =
  typeof window === 'undefined'
    ? undefined
    : (window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);

function decode(context: AudioContext, data: ArrayBuffer) {
  return new Promise<AudioBuffer>((resolve, reject) =>
    context.decodeAudioData(data, resolve, reject),
  );
}

async function fetchBytes(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Sound unavailable: ${url}`);
  return response.arrayBuffer();
}

function createNoise(context: AudioContext) {
  const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let index = 0; index < channel.length; index++) channel[index] = Math.random() * 2 - 1;
  return buffer;
}

class SoundEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private ambient: Ambient | null = null;
  private room: GainNode | null = null;
  private scene: SoundScene = 'home';
  private visible = true;
  private suspendTimer = 0;
  private enabled = true;
  private listeners = new Set<Listener>();
  private bytes = new Map<SoundName, Promise<ArrayBuffer>>();
  private buffers = new Map<SoundName, AudioBuffer>();
  private lastPlayed = new Map<string, number>();

  readonly supported = AudioContextClass !== undefined;

  isEnabled = () => this.enabled;

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  setEnabled(enabled: boolean) {
    if (this.enabled === enabled) return;
    this.enabled = enabled;
    this.applyState();
    this.listeners.forEach((listener) => listener());
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    this.applyState();
  }

  /** Each scene has its own ambient bed; switching crossfades between them. */
  setScene(scene: SoundScene) {
    if (this.scene === scene) return;
    this.scene = scene;
    const context = this.context;
    if (!context || !this.master || !this.noise || !this.ambient) return;
    this.ambient.stop(2.5);
    this.ambient = createAmbient(context, this.master, this.noise, AMBIENTS[scene], 4);
  }

  private applyState() {
    const context = this.context;
    if (!context || !this.master) return;
    const audible = this.enabled && this.visible;
    window.clearTimeout(this.suspendTimer);
    this.master.gain.setTargetAtTime(audible ? SOUND_MIX.master : 0, context.currentTime, 0.08);
    if (audible) {
      void context.resume();
      if (!this.ambient && this.noise)
        this.ambient = createAmbient(context, this.master, this.noise, AMBIENTS[this.scene]);
      return;
    }
    this.suspendTimer = window.setTimeout(() => void context.suspend(), 400);
  }

  prefetch(): Promise<unknown>[] {
    if (!this.supported) return [];
    return (Object.keys(SOUNDS) as SoundName[]).map((name) => {
      let bytes = this.bytes.get(name);
      if (!bytes) {
        bytes = fetchBytes(SOUNDS[name].webm).catch(() => fetchBytes(SOUNDS[name].mp3));
        this.bytes.set(name, bytes);
      }
      return bytes.catch(() => undefined);
    });
  }

  unlock() {
    if (!AudioContextClass) return;
    if (this.context) {
      if (this.context.state === 'suspended' && this.enabled && this.visible) {
        void this.context.resume();
      }
      return;
    }
    this.context = new AudioContextClass();
    this.master = this.context.createGain();
    this.master.gain.value = this.enabled ? SOUND_MIX.master : 0;
    this.master.connect(this.context.destination);
    this.noise = createNoise(this.context);
    this.prefetch();
    for (const name of Object.keys(SOUNDS) as SoundName[]) void this.load(name);
    this.applyState();
  }

  private async load(name: SoundName) {
    const context = this.context;
    const bytes = this.bytes.get(name);
    if (!context || !bytes) return;
    try {
      this.buffers.set(name, await decode(context, (await bytes).slice(0)));
    } catch {
      try {
        this.buffers.set(name, await decode(context, await fetchBytes(SOUNDS[name].mp3)));
      } catch {
        this.buffers.delete(name);
      }
    }
  }

  private ready() {
    return this.enabled && this.context?.state === 'running' && this.master ? this.context : null;
  }

  private allowed(key: string, gap: number) {
    const now = performance.now();
    if (now - (this.lastPlayed.get(key) ?? -Infinity) < gap) return false;
    this.lastPlayed.set(key, now);
    return true;
  }

  play = (name: SoundName, { volume = 1 }: PlayOptions = {}) => {
    const context = this.ready();
    const buffer = this.buffers.get(name);
    const spec: { volume: number; throttle?: number; group?: string } = SOUNDS[name];
    if (!context || !this.master || (!buffer && this.scene !== 'works')) return;
    if (spec.throttle && !this.allowed(name, spec.throttle)) return;
    if (spec.group && !this.allowed(spec.group, SOUND_MIX.groupGap)) return;
    if (this.scene === 'works' && this.playGlass(name, volume)) return;
    if (!buffer) return;
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.playbackRate.value = 1 + (Math.random() - 0.5) * SOUND_MIX.pitchVariation;
    gain.gain.value = spec.volume * volume;
    source.connect(gain).connect(this.master);
    source.start();
  };

  whoosh = (intensity: number) => {
    const context = this.ready();
    if (!context || !this.noise || !this.master || !this.allowed('whoosh', SOUND_MIX.whooshGap))
      return;
    const amount = Math.min(1, Math.max(0.15, intensity));
    const start = context.currentTime;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = this.noise;
    filter.type = 'bandpass';
    filter.Q.value = 0.9;
    filter.frequency.setValueAtTime(320 + 900 * amount, start);
    filter.frequency.exponentialRampToValueAtTime(180 + 300 * amount, start + 0.45);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.04 + 0.1 * amount, start + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
    source.connect(filter).connect(gain).connect(this.master);
    source.start(start, Math.random() * 0.4);
    source.stop(start + 0.55);
  };

  /** A short reverb shared by the glass sounds so they ring in one space. */
  private glassRoom(context: AudioContext, master: GainNode) {
    if (this.room) return this.room;
    const input = context.createGain();
    const reverb = context.createConvolver();
    const wet = context.createGain();
    reverb.buffer = createImpulse(context, GLASS.room);
    wet.gain.value = GLASS.wet;
    input.connect(master);
    input.connect(reverb).connect(wet).connect(master);
    this.room = input;
    return input;
  }

  private glass(frequency: number, level: number, decay: number, delay = 0) {
    const context = this.ready();
    const master = this.master;
    if (!context || !master) return;
    const output = this.glassRoom(context, master);
    const start = context.currentTime + delay;
    GLASS.partials.forEach(([ratio, weight], index) => {
      const tone = context.createOscillator();
      const envelope = context.createGain();
      const length = decay / (1 + index);
      tone.type = 'sine';
      tone.frequency.value = frequency * ratio;
      envelope.gain.setValueAtTime(0.0001, start);
      envelope.gain.exponentialRampToValueAtTime(level * weight, start + 0.005);
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + length);
      tone.connect(envelope).connect(output);
      tone.start(start);
      tone.stop(start + length + 0.05);
    });
  }

  private playGlass(name: SoundName, volume: number) {
    const shift = 1 + (Math.random() - 0.5) * SOUND_MIX.pitchVariation * 0.5;
    if (name === 'hover') {
      const { frequency, level, decay } = GLASS.hover;
      this.glass(frequency * shift, level * volume, decay);
      return true;
    }
    if (name === 'click') {
      const { frequency, level, decay } = GLASS.click;
      this.glass(frequency * shift, level * volume, decay);
      this.glass(frequency * 1.5 * shift, level * 0.5 * volume, decay * 0.7, 0.012);
      return true;
    }
    if (name === 'switch') {
      this.glass(659.25, 0.04 * volume, 0.9);
      this.glass(987.77, 0.035 * volume, 0.9, 0.07);
      return true;
    }
    return false;
  }

  /** The note belonging to a point in the sculpture: its tactile identity. */
  note = (index: number, kind: 'hover' | 'focus') => {
    if (!this.allowed(`note-${kind}`, kind === 'hover' ? 60 : 400)) return;
    const pitch = GLASS.scale[index % GLASS.scale.length] ?? 880;
    const { level, decay } = kind === 'hover' ? GLASS.note : GLASS.focus;
    this.glass(kind === 'hover' ? pitch : pitch / 2, level, decay);
  };

  /** Particles gathering into an image: a brief rising sparkle. */
  shimmer = () => {
    if (!this.allowed('shimmer', 300)) return;
    const { level, steps, spread } = GLASS.shimmer;
    for (let step = 0; step < steps; step++) {
      const pitch = GLASS.scale[(step * 2 + 3) % GLASS.scale.length] ?? 1760;
      this.glass(pitch * 2, level * (1 - step / (steps + 2)), 0.35, (step / steps) * spread);
    }
  };

  /** Taking hold of the sculpture: a soft, low touch. */
  grab = () => {
    const context = this.ready();
    const master = this.master;
    if (!context || !master || !this.allowed('grab', 120)) return;
    const start = context.currentTime;
    const tone = context.createOscillator();
    const envelope = context.createGain();
    tone.type = 'sine';
    tone.frequency.setValueAtTime(150, start);
    tone.frequency.exponentialRampToValueAtTime(92, start + 0.14);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(GLASS.grab.level, start + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
    tone.connect(envelope).connect(master);
    tone.start(start);
    tone.stop(start + 0.22);
  };

  /** Letting go with momentum: air that trails off with the spin. */
  fling = (intensity: number) => {
    const context = this.ready();
    const master = this.master;
    if (!context || !master || !this.noise || intensity < GLASS.fling.threshold) return;
    if (!this.allowed('fling', 200)) return;
    const amount = Math.min(1, intensity);
    const start = context.currentTime;
    const length = 0.4 + amount * 0.5;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const envelope = context.createGain();
    source.buffer = this.noise;
    filter.type = 'bandpass';
    filter.Q.value = 1.4;
    filter.frequency.setValueAtTime(1_600 + 1_400 * amount, start);
    filter.frequency.exponentialRampToValueAtTime(520, start + length);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(GLASS.fling.level * amount, start + 0.05);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + length);
    source.connect(filter).connect(envelope).connect(this.glassRoom(context, master));
    source.start(start, Math.random() * 0.4);
    source.stop(start + length + 0.05);
  };

  swell = (direction: 'in' | 'out') => {
    const context = this.ready();
    const master = this.master;
    if (!context || !this.noise || !master) return;
    if (!this.allowed('transition', SOUND_MIX.groupGap)) return;
    const opening = direction === 'in';
    const start = context.currentTime;
    const air = context.createBufferSource();
    const band = context.createBiquadFilter();
    const airGain = context.createGain();
    air.buffer = this.noise;
    band.type = 'bandpass';
    band.Q.value = 1.1;
    band.frequency.setValueAtTime(opening ? 420 : 1_500, start);
    band.frequency.exponentialRampToValueAtTime(opening ? 1_500 : 420, start + 0.42);
    airGain.gain.setValueAtTime(0.0001, start);
    airGain.gain.exponentialRampToValueAtTime(SWELL.air, start + 0.14);
    airGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
    air.connect(band).connect(airGain).connect(master);
    air.start(start, Math.random() * 0.4);
    air.stop(start + 0.6);

    const [root, fifth] = opening ? SWELL.open : SWELL.close;
    [root, fifth].forEach((frequency, index) => {
      const tone = context.createOscillator();
      const toneGain = context.createGain();
      tone.type = 'sine';
      tone.frequency.setValueAtTime(frequency * (opening ? 0.985 : 1.015), start);
      tone.frequency.exponentialRampToValueAtTime(frequency, start + 0.25);
      toneGain.gain.setValueAtTime(0.0001, start);
      toneGain.gain.exponentialRampToValueAtTime(SWELL.tone / (index + 1), start + 0.08);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, start + 1.1);
      tone.connect(toneGain).connect(master);
      tone.start(start);
      tone.stop(start + 1.2);
    });
  };
}

export const soundEngine = new SoundEngine();
