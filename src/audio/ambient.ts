import { AMBIENT } from '@/constants/sounds';

export type Ambient = { stop: () => void };

type Voice = { glide: (frequency: number) => void; stop: () => void };

function createImpulse(context: AudioContext, seconds: number) {
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

function createVoice(context: AudioContext, frequency: number, level: number, output: AudioNode) {
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
        oscillator.frequency.setTargetAtTime(next, context.currentTime, AMBIENT.glide),
      );
    },
    stop() {
      [...oscillators, swell].forEach((node) => node.stop());
    },
  } satisfies Voice;
}

function createWaves(context: AudioContext, noise: AudioBuffer, output: AudioNode) {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const tide = context.createOscillator();
  const tideDepth = context.createGain();
  const [low, high] = AMBIENT.waveLevel;
  source.buffer = noise;
  source.loop = true;
  filter.type = 'lowpass';
  filter.frequency.value = 650;
  filter.Q.value = 0.2;
  gain.gain.value = (low + high) / 2;
  tide.frequency.value = 1 / AMBIENT.waveSeconds;
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
  output.gain.linearRampToValueAtTime(AMBIENT.level, now + AMBIENT.fadeIn);
  filter.type = 'lowpass';
  filter.frequency.value = AMBIENT.filter;
  filter.Q.value = 0.1;
  sweep.frequency.value = 0.012;
  sweepDepth.gain.value = AMBIENT.filterSweep;
  sweep.connect(sweepDepth).connect(filter.frequency);
  reverb.buffer = createImpulse(context, AMBIENT.reverbSeconds);
  wet.gain.value = 1;
  dry.gain.value = 0.45;
  filter.connect(dry).connect(output);
  filter.connect(reverb).connect(wet).connect(output);
  output.connect(destination);
  sweep.start();

  const [firstChord = []] = AMBIENT.chords;
  const voices = firstChord.map((frequency, index) =>
    createVoice(context, frequency, index === 0 ? 0.08 : 0.1, filter),
  );
  const stopWaves = createWaves(context, noise, reverb);

  let chord = 0;
  const running = () => context.state === 'running';
  const progression = window.setInterval(() => {
    if (!running()) return;
    chord = (chord + 1) % AMBIENT.chords.length;
    AMBIENT.chords[chord]?.forEach((frequency, index) => voices[index]?.glide(frequency));
  }, AMBIENT.chordSeconds * 1_000);

  const [minGap, maxGap] = AMBIENT.chimeEvery;
  let chimeTimer = 0;
  const chime = () => {
    chimeTimer = window.setTimeout(chime, (minGap + Math.random() * (maxGap - minGap)) * 1_000);
    if (!running()) return;
    const tone = context.createOscillator();
    const envelope = context.createGain();
    const start = context.currentTime;
    tone.type = 'sine';
    tone.frequency.value =
      AMBIENT.chimes[Math.floor(Math.random() * AMBIENT.chimes.length)] ?? 587.33;
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(AMBIENT.chimeLevel, start + 0.09);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + 4);
    tone.connect(envelope).connect(reverb);
    tone.start(start);
    tone.stop(start + 4.1);
  };
  chimeTimer = window.setTimeout(chime, minGap * 1_000);

  return {
    stop() {
      window.clearInterval(progression);
      window.clearTimeout(chimeTimer);
      const end = context.currentTime;
      output.gain.cancelScheduledValues(end);
      output.gain.setValueAtTime(output.gain.value, end);
      output.gain.linearRampToValueAtTime(0, end + 1);
      window.setTimeout(() => {
        voices.forEach((voice) => voice.stop());
        stopWaves();
        sweep.stop();
        output.disconnect();
      }, 1_100);
    },
  };
}
