import { describe, expect, it } from 'vitest';
import { nextBeat } from '@/audio/pulse';
import { HEARTBEAT } from '@/constants/sounds';

describe('heartbeat clock', () => {
  it('lands every beat on the shared grid the visual heart follows', () => {
    expect(nextBeat(0)).toBe(0);
    expect(nextBeat(1)).toBe(HEARTBEAT.period);
    expect(nextBeat(2_999)).toBe(3_000);
    expect(nextBeat(3_000)).toBe(3_000);
    expect(nextBeat(3_001) % HEARTBEAT.period).toBe(0);
  });
});
