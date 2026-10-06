import { HEARTBEAT, type PulseSpec } from '@/constants/sounds';

const LOOKAHEAD = 450;

export function nextBeat(time: number, period: number = HEARTBEAT.period) {
  return Math.ceil(time / period) * period;
}

export function schedulePulse(
  context: AudioContext,
  output: AudioNode,
  room: AudioNode,
  spec: PulseSpec,
) {
  const body = context.createBiquadFilter();
  const echo = context.createDelay(2);
  const feedback = context.createGain();
  const echoLevel = context.createGain();
  body.type = 'lowpass';
  body.frequency.value = 170;
  body.connect(output);
  echo.delayTime.value = spec.echo;
  feedback.gain.value = spec.feedback;
  echoLevel.gain.value = 0.5;
  echo.connect(feedback).connect(echo);
  echo.connect(echoLevel).connect(room);

  const thump = (at: number, frequency: number, level: number, length: number) => {
    const tone = context.createOscillator();
    const envelope = context.createGain();
    tone.type = 'sine';
    tone.frequency.setValueAtTime(frequency, at);
    tone.frequency.exponentialRampToValueAtTime(frequency * 0.68, at + length);
    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.exponentialRampToValueAtTime(level, at + 0.03);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + length);
    tone.connect(envelope).connect(body);
    tone.start(at);
    tone.stop(at + length + 0.05);
  };
  const pluck = (at: number, frequency: number, level: number) => {
    [
      ['triangle', 1, 1],
      ['sine', 2, 0.25],
    ].forEach(([type, ratio, weight], index) => {
      const tone = context.createOscillator();
      const envelope = context.createGain();
      const length = spec.pluckDecay / (1 + index * 2);
      tone.type = type as OscillatorType;
      tone.frequency.value = frequency * Number(ratio);
      envelope.gain.setValueAtTime(0.0001, at);
      envelope.gain.exponentialRampToValueAtTime(level * Number(weight), at + 0.005);
      envelope.gain.exponentialRampToValueAtTime(0.0001, at + length);
      tone.connect(envelope);
      envelope.connect(output);
      envelope.connect(echo);
      envelope.connect(room);
      tone.start(at);
      tone.stop(at + length + 0.05);
    });
  };

  let step = Math.floor(spec.scale.length / 2);
  const wander = (reach: number) => {
    const move = Math.round((Math.random() * 2 - 1) * reach);
    step = Math.max(0, Math.min(spec.scale.length - 1, step + move));
    return spec.scale[step] ?? 659.25;
  };
  let scheduled = 0;
  const schedule = () => {
    if (context.state !== 'running') return;
    const now = performance.now();
    const latency = context.outputLatency || 0;
    for (
      let beat = nextBeat(Math.max(now, scheduled));
      beat < now + LOOKAHEAD;
      beat += HEARTBEAT.period
    ) {
      scheduled = beat + 1;
      const at = context.currentTime + (beat - now) / 1_000 - latency;
      if (at <= context.currentTime) continue;
      const seconds = HEARTBEAT.period / 1_000;
      thump(at, 82, spec.heart, 0.16);
      thump(at + seconds * HEARTBEAT.dub, 70, spec.heart * 0.5, 0.13);
      if (Math.random() < spec.noteChance) pluck(at, wander(2), spec.pluck);
      if (Math.random() < spec.ghostChance) pluck(at + seconds / 2, wander(1), spec.pluck * 0.55);
    }
  };
  const timer = window.setInterval(schedule, 200);
  schedule();
  return () => {
    window.clearInterval(timer);
    window.setTimeout(() => {
      body.disconnect();
      echo.disconnect();
      feedback.disconnect();
    }, 4_000);
  };
}
