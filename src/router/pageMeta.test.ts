import { describe, expect, it } from 'vitest';
import { formatPageTitle, getPageMeta, NOT_FOUND_META, PAGE_META } from '@/router/pageMeta';
import { ROUTES } from '@/router/paths';

describe('page metadata', () => {
  it('describes every route', () => {
    expect(Object.keys(PAGE_META).sort()).toEqual(Object.values(ROUTES).sort());
  });

  it('keeps titles and descriptions within share-card limits', () => {
    for (const page of [...Object.values(PAGE_META), NOT_FOUND_META]) {
      expect(page.title.length).toBeLessThanOrEqual(60);
      expect(page.description.length).toBeGreaterThan(40);
      expect(page.description.length).toBeLessThanOrEqual(160);
      expect(page.image).toMatch(/^[a-z-]+$/);
    }
  });

  it('formats titles and falls back for unknown paths', () => {
    expect(formatPageTitle('/')).toBe('The Minimalist — Design Studio');
    expect(formatPageTitle('/about')).toBe('About — The Minimalist');
    expect(getPageMeta('/missing')).toBe(NOT_FOUND_META);
  });
});
