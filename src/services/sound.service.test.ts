import { describe, expect, it, vi } from 'vitest';
import { isSoundEnabled, saveSoundEnabled } from '@/services/sound.service';

describe('sound preference', () => {
  it('is on by default and remembers a choice', () => {
    window.localStorage.clear();
    expect(isSoundEnabled()).toBe(true);
    saveSoundEnabled(false);
    expect(isSoundEnabled()).toBe(false);
    saveSoundEnabled(true);
    expect(isSoundEnabled()).toBe(true);
  });

  it('defaults to on when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => saveSoundEnabled(false)).not.toThrow();
    expect(isSoundEnabled()).toBe(true);
  });
});
