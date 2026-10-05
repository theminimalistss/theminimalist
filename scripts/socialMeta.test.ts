import { describe, expect, it } from 'vitest';
import { NOT_FOUND_META, PAGE_META } from '../src/router/pageMeta.ts';
import { normalizeSiteUrl, socialTags } from './socialMeta.ts';

const about = PAGE_META['/about'];

describe('social meta tags', () => {
  it('normalizes the configured origin', () => {
    expect(normalizeSiteUrl('https://example.com/')).toBe('https://example.com');
    expect(normalizeSiteUrl(undefined)).toBe('');
  });

  it('writes absolute Open Graph and X card tags for a page', () => {
    if (!about) throw new Error('About metadata is missing.');
    const tags = socialTags('https://example.com', '/about', about);
    expect(tags).toContain('<title>About — The Minimalist</title>');
    expect(tags).toContain('<link rel="canonical" href="https://example.com/about" />');
    expect(tags).toContain('<meta property="og:url" content="https://example.com/about" />');
    expect(tags).toMatch(/og:image" content="https:\/\/example\.com\/social\/about\.png\?v=/);
    expect(tags).toContain('<meta property="og:image:width" content="1200" />');
    expect(tags).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(tags).not.toContain('application/ld+json');
  });

  it('adds structured data on home and noindex on the 404 page', () => {
    const home = PAGE_META['/'];
    if (!home) throw new Error('Home metadata is missing.');
    expect(socialTags('https://example.com', '/', home)).toContain('application/ld+json');
    expect(socialTags('https://example.com', null, NOT_FOUND_META)).toContain(
      '<meta name="robots" content="noindex" />',
    );
  });

  it('escapes text safely', () => {
    const tags = socialTags('', '/works', { ...NOT_FOUND_META, description: 'A "quoted" <b>' });
    expect(tags).toContain('A &quot;quoted&quot; &lt;b&gt;');
  });
});
