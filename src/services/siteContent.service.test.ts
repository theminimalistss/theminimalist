import { describe, expect, it } from 'vitest';
import { siteContentRepository } from '@/repositories/siteContent.repository';
import { ContentValidationError, getSiteContent } from '@/services/siteContent.service';
import type { SiteContentRepository, SiteContentSource } from '@/types/content';

function repository(overrides: Partial<SiteContentSource>): SiteContentRepository {
  return {
    read<Key extends keyof SiteContentSource>(key: Key): SiteContentSource[Key] {
      return overrides[key] ?? siteContentRepository.read(key);
    },
  };
}

describe('editable site content', () => {
  it('loads every bundled section through the service', () => {
    for (const key of ['pages', 'studio', 'products', 'process', 'inquiry', 'contact'] as const) {
      expect(() => getSiteContent(key)).not.toThrow();
    }
  });

  it('rejects unavailable product status values before they reach the UI', () => {
    const products = siteContentRepository.read('products');
    const source = repository({
      products: { ...products, software: { ...products.software, status: 'published' } },
    });
    expect(() => getSiteContent('products', source)).toThrow(/availability/);
  });

  it('keeps captions aligned with all four process drawings', () => {
    const process = siteContentRepository.read('process');
    expect(() => getSiteContent('process', repository({ process: process.slice(1) }))).toThrow(
      /four drawing stages/,
    );
  });

  it('requires one of every supported inquiry kind without silently coercing edits', () => {
    const inquiry = siteContentRepository.read('inquiry');
    const first = inquiry.intents[0]!;
    for (const intents of [
      [...inquiry.intents.slice(1), { ...first, kind: 'unknown' }],
      [...inquiry.intents.slice(1), inquiry.intents[1]!],
      inquiry.intents.slice(1),
    ]) {
      expect(() =>
        getSiteContent('inquiry', repository({ inquiry: { ...inquiry, intents } })),
      ).toThrow(ContentValidationError);
    }
  });

  it('rejects blank copy and empty choice lists', () => {
    const contact = siteContentRepository.read('contact');
    expect(() =>
      getSiteContent('contact', repository({ contact: { ...contact, email: ' ' } })),
    ).toThrow(/must not be empty/);
    const inquiry = siteContentRepository.read('inquiry');
    expect(() =>
      getSiteContent(
        'inquiry',
        repository({
          inquiry: { ...inquiry, options: { ...inquiry.options, services: [] } },
        }),
      ),
    ).toThrow(/must not be empty/);
  });

  it('does not leak nested snapshot edits into later reads', () => {
    const first = siteContentRepository.read('pages');
    Object.assign(first.about, { title: 'Changed in a consumer' });
    expect(getSiteContent('pages').about.title).toBe('The Minimalist');
  });
});
