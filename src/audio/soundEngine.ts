import { createAmbient, type Ambient } from '@/audio/ambient';
import { SOUND_MIX, SOUNDS, SWELL, type SoundName } from '@/constants/sounds';

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

  private applyState() {
    const context = this.context;
    if (!context || !this.master) return;
    const audible = this.enabled && this.visible;
    window.clearTimeout(this.suspendTimer);
    this.master.gain.setTargetAtTime(audible ? SOUND_MIX.master : 0, context.currentTime, 0.08);
    if (audible) {
      void context.resume();
      if (!this.ambient && this.noise)
        this.ambient = createAmbient(context, this.master, this.noise);
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
    if (!context || !buffer || !this.master) return;
    if (spec.throttle && !this.allowed(name, spec.throttle)) return;
    if (spec.group && !this.allowed(spec.group, SOUND_MIX.groupGap)) return;
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
