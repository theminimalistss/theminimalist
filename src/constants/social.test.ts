import { describe, expect, it } from 'vitest';
import { MORE_SOCIAL, PRIMARY_SOCIAL, SOCIAL_LINKS } from '@/constants/social';

describe('social channels', () => {
  it('leads with Facebook, Instagram, and LinkedIn and keeps the rest under More', () => {
    expect(PRIMARY_SOCIAL.map((link) => link.platform)).toEqual([
      'facebook',
      'instagram',
      'linkedin',
    ]);
    expect(MORE_SOCIAL.map((link) => link.platform)).toEqual(['tiktok', 'behance']);
  });

  it('links only to secure profile URLs on each platform', () => {
    for (const link of SOCIAL_LINKS) {
      const url = new URL(link.url);
      expect(url.protocol).toBe('https:');
      expect(url.hostname).toContain(link.platform === 'linkedin' ? 'linkedin.com' : link.platform);
    }
  });
});
