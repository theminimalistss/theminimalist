import { describe, expect, it, vi } from 'vitest';
import { completeIntro, getIntroMode } from '@/services/visit.service';
import { sessionVisitRepository } from '@/repositories/visit.repository';

describe('visit service', () => {
  it('plays the full intro once per session, then a brief one', () => {
    window.sessionStorage.clear();
    expect(getIntroMode()).toBe('full');
    completeIntro();
    expect(getIntroMode()).toBe('brief');
  });

  it('falls back to the full intro when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => sessionVisitRepository.markIntroSeen()).not.toThrow();
    expect(getIntroMode()).toBe('full');
  });
});
