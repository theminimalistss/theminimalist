import type { AmbientPreset } from '@/constants/sounds';

export type Ambient = { stop: (fade?: number) => void };

type Voice = { crossfade: (frequency: number) => void; stop: () => void };

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
  crossfade: number,
) {
  const gain = context.createGain();
  const swell = context.createOscillator();
  const depth = context.createGain();
  const pairs = new Set<{ nodes: OscillatorNode[]; mix: GainNode }>();
  const pair = (pitch: number, fade: number) => {
    const mix = context.createGain();
    mix.gain.value = fade ? 0 : 1;
    mix.connect(gain);
    if (fade) mix.gain.setTargetAtTime(1, context.currentTime, fade / 3);
    const nodes = [-1.5, 1.5].map((detune) => {
      const oscillator = context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = pitch;
      oscillator.detune.value = detune;
      oscillator.connect(mix);
      return oscillator;
    });
    const voice = { nodes, mix };
    pairs.add(voice);
    nodes[0]!.onended = () => {
      nodes.forEach((node) => node.disconnect());
      mix.disconnect();
      pairs.delete(voice);
    };
    nodes.forEach((node) => node.start());
    return voice;
  };
  let current = pair(frequency, 0);
  gain.gain.value = level;
  swell.frequency.value = 0.02 + Math.random() * 0.03;
  depth.gain.value = level * 0.12;
  swell.connect(depth).connect(gain.gain);
  gain.connect(output);
  swell.start();
  return {
    crossfade(next: number) {
      const previous = current;
      current = pair(next, crossfade);
      previous.mix.gain.setTargetAtTime(0, context.currentTime, crossfade / 3);
      previous.nodes.forEach((node) => node.stop(context.currentTime + crossfade + 0.1));
    },
    stop() {
      for (const voice of pairs) voice.nodes.forEach((node) => node.stop());
      swell.stop();
      swell.disconnect();
      depth.disconnect();
      gain.disconnect();
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
  wet.gain.value = 0.35;
  dry.gain.value = 0.6;
  filter.connect(dry).connect(output);
  filter.connect(reverb).connect(wet).connect(output);
  output.connect(destination);
  sweep.start();

  const [firstChord = []] = preset.chords;
  const voices = firstChord.map((frequency, index) =>
    createVoice(context, frequency, index === 0 ? 0.035 : 0.045, filter, preset.crossfade),
  );
  const stopWaves = createWaves(context, noise, reverb, preset);

  let chord = 0;
  const running = () => context.state === 'running';
  const progression = window.setInterval(() => {
    if (!running()) return;
    chord = (chord + 1) % preset.chords.length;
    preset.chords[chord]?.forEach((frequency, index) => voices[index]?.crossfade(frequency));
  }, preset.chordSeconds * 1_000);

  const [minGap, maxGap] = preset.keyEvery;
  let keyTimer = 0;
  const key = (start: number) => {
    const pitch = preset.keys[Math.floor(Math.random() * preset.keys.length)] ?? 587.33;
    const [bellRatio, bellLevel] = preset.keyPartial;
    const partials = bellLevel
      ? [[1, 1] as const, [bellRatio, bellLevel] as const]
      : [[1, 1] as const];
    partials.forEach(([ratio, level], index) => {
      const tone = context.createOscillator();
      const envelope = context.createGain();
      const length = 5 / (1 + index * 1.5);
      tone.type = 'sine';
      tone.frequency.value = pitch * ratio;
      envelope.gain.setValueAtTime(0.0001, start);
      envelope.gain.exponentialRampToValueAtTime(preset.keyLevel * level, start + 0.055);
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + length);
      tone.connect(envelope).connect(filter);
      tone.start(start);
      tone.stop(start + length + 0.1);
      tone.onended = () => {
        tone.disconnect();
        envelope.disconnect();
      };
    });
  };
  const nextKey = () => {
    keyTimer = window.setTimeout(nextKey, (minGap + Math.random() * (maxGap - minGap)) * 1_000);
    if (running()) key(context.currentTime);
  };
  key(context.currentTime + 3);
  keyTimer = window.setTimeout(nextKey, (3 + minGap) * 1_000);

  return {
    stop(fade = 1) {
      window.clearInterval(progression);
      window.clearTimeout(keyTimer);
      const end = context.currentTime;
      output.gain.cancelScheduledValues(end);
      output.gain.setValueAtTime(output.gain.value, end);
      output.gain.linearRampToValueAtTime(0, end + fade);
      window.setTimeout(
        () => {
          voices.forEach((voice) => voice.stop());
          stopWaves();
          sweep.stop();
          sweep.disconnect();
          sweepDepth.disconnect();
          filter.disconnect();
          reverb.disconnect();
          wet.disconnect();
          dry.disconnect();
          output.disconnect();
        },
        fade * 1_000 + 100,
      );
    },
  };
}
