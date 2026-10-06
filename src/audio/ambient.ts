import { schedulePulse } from '@/audio/pulse';
import type { AmbientPreset } from '@/constants/sounds';

export type Ambient = { stop: (fade?: number) => void };

type Voice = { glide: (frequency: number) => void; stop: () => void };

export function createImpulse(context: AudioContext, seconds: number) {
  const length = Math.round(context.sampleRate * seconds);
  const impulse = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let index = 0; index < length; index++) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / length) ** 4;
    }
  }
  return impulse;
}

function createVoice(
  context: AudioContext,
  frequency: number,
  level: number,
  output: AudioNode,
  glide: number,
) {
  const gain = context.createGain();
  const swell = context.createOscillator();
  const depth = context.createGain();
  const oscillators = [-3, 4].map((detune) => {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;
    oscillator.connect(gain);
    return oscillator;
  });
  gain.gain.value = level;
  swell.frequency.value = 0.02 + Math.random() * 0.03;
  depth.gain.value = level * 0.3;
  swell.connect(depth).connect(gain.gain);
  gain.connect(output);
  [...oscillators, swell].forEach((node) => node.start());
  return {
    glide(next: number) {
      oscillators.forEach((oscillator) =>
        oscillator.frequency.setTargetAtTime(next, context.currentTime, glide),
      );
    },
    stop() {
      [...oscillators, swell].forEach((node) => node.stop());
    },
  } satisfies Voice;
}

function createWaves(
  context: AudioContext,
  noise: AudioBuffer,
  output: AudioNode,
  preset: AmbientPreset,
) {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const tide = context.createOscillator();
  const tideDepth = context.createGain();
  const [low, high] = preset.waveLevel;
  source.buffer = noise;
  source.loop = true;
  filter.type = preset.air.type;
  filter.frequency.value = preset.air.frequency;
  filter.Q.value = 0.2;
  gain.gain.value = (low + high) / 2;
  tide.frequency.value = 1 / preset.waveSeconds;
  tideDepth.gain.value = (high - low) / 2;
  tide.connect(tideDepth).connect(gain.gain);
  source.connect(filter).connect(gain).connect(output);
  source.start();
  tide.start();
  return () => {
    source.stop();
    tide.stop();
  };
}

export function createAmbient(
  context: AudioContext,
  destination: AudioNode,
  noise: AudioBuffer,
  preset: AmbientPreset,
  fadeIn: number = preset.fadeIn,
): Ambient {
  const output = context.createGain();
  const filter = context.createBiquadFilter();
  const sweep = context.createOscillator();
  const sweepDepth = context.createGain();
  const reverb = context.createConvolver();
  const wet = context.createGain();
  const dry = context.createGain();
  const now = context.currentTime;

  output.gain.setValueAtTime(0, now);
  output.gain.linearRampToValueAtTime(preset.level, now + fadeIn);
  filter.type = 'lowpass';
  filter.frequency.value = preset.filter;
  filter.Q.value = 0.1;
  sweep.frequency.value = 0.012;
  sweepDepth.gain.value = preset.filterSweep;
  sweep.connect(sweepDepth).connect(filter.frequency);
  reverb.buffer = createImpulse(context, preset.reverbSeconds);
  wet.gain.value = 1;
  dry.gain.value = 0.45;
  filter.connect(dry).connect(output);
  filter.connect(reverb).connect(wet).connect(output);
  output.connect(destination);
  sweep.start();

  const [firstChord = []] = preset.chords;
  const voices = firstChord.map((frequency, index) =>
    createVoice(context, frequency, index === 0 ? 0.08 : 0.1, filter, preset.glide),
  );
  const stopWaves = createWaves(context, noise, reverb, preset);
  const stopPulse = preset.pulse
    ? schedulePulse(context, output, reverb, preset.pulse)
    : () => undefined;

  let chord = 0;
  const running = () => context.state === 'running';
  const progression = window.setInterval(() => {
    if (!running()) return;
    chord = (chord + 1) % preset.chords.length;
    preset.chords[chord]?.forEach((frequency, index) => voices[index]?.glide(frequency));
  }, preset.chordSeconds * 1_000);

  const [minGap, maxGap] = preset.chimeEvery;
  let chimeTimer = 0;
  const chime = () => {
    chimeTimer = window.setTimeout(chime, (minGap + Math.random() * (maxGap - minGap)) * 1_000);
    if (!running()) return;
    const start = context.currentTime;
    const pitch = preset.chimes[Math.floor(Math.random() * preset.chimes.length)] ?? 587.33;
    const [bellRatio, bellLevel] = preset.chimeBell;
    const partials = bellLevel
      ? [[1, 1] as const, [bellRatio, bellLevel] as const]
      : [[1, 1] as const];
    partials.forEach(([ratio, level], index) => {
      const tone = context.createOscillator();
      const envelope = context.createGain();
      const length = 4 / (1 + index * 1.5);
      tone.type = 'sine';
      tone.frequency.value = pitch * ratio;
      envelope.gain.setValueAtTime(0.0001, start);
      envelope.gain.exponentialRampToValueAtTime(preset.chimeLevel * level, start + 0.09);
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + length);
      tone.connect(envelope).connect(reverb);
      tone.start(start);
      tone.stop(start + length + 0.1);
    });
  };
  chimeTimer = window.setTimeout(chime, minGap * 1_000);

  return {
    stop(fade = 1) {
      window.clearInterval(progression);
      window.clearTimeout(chimeTimer);
      stopPulse();
      const end = context.currentTime;
      output.gain.cancelScheduledValues(end);
      output.gain.setValueAtTime(output.gain.value, end);
      output.gain.linearRampToValueAtTime(0, end + fade);
      window.setTimeout(
        () => {
          voices.forEach((voice) => voice.stop());
          stopWaves();
          sweep.stop();
          output.disconnect();
        },
        fade * 1_000 + 100,
      );
    },
  };
}
