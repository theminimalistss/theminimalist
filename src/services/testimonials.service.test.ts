import { describe, expect, it } from 'vitest';
import {
  getTestimonials,
  normalizeTestimonial,
  summarizeTestimonials,
  TestimonialValidationError,
  toExcerpt,
} from '@/services/testimonials.service';

const valid = {
  id: 'studio',
  client: 'A Client',
  business: 'A Business',
  rating: 5,
  paragraphs: ['Short and kind.'],
  media: {
    type: 'image',
    image: { src: '/a.avif', srcSmall: '/a-s.avif', webp: '/a.webp', webpSmall: '/a-s.webp' },
  },
};

describe('testimonials', () => {
  it('keeps all fourteen client testimonials, word for word, with unique ids', async () => {
    const testimonials = await getTestimonials();
    expect(testimonials).toHaveLength(14);
    expect(testimonials[0]?.paragraphs.at(-1)).toBe(
      'Overall, it was a smooth and pleasant experience working with you guys',
    );
    expect(testimonials[0]?.rating).toBeUndefined();
    expect(testimonials.map((item) => item.media.type)).toEqual(
      testimonials.map((_, index) => (index % 3 === 1 ? 'video' : 'image')),
    );
    expect(testimonials.find((item) => item.id === 'shotto-corner')?.excerpt).toBe(
      '100/10 satisfied customer po!',
    );
  });

  it('shortens long first paragraphs at a sentence or word boundary', () => {
    const long = 'One sentence that is fairly long and kind. '.repeat(6).trim();
    const excerpt = toExcerpt(long);
    expect(excerpt.length).toBeLessThanOrEqual(150);
    expect(excerpt.endsWith('.') || excerpt.endsWith('…')).toBe(true);
    expect(toExcerpt('Short.')).toBe('Short.');
  });

  it.each([
    { ...valid, id: 'Not Valid' },
    { ...valid, paragraphs: [] },
    { ...valid, rating: 6 },
    { ...valid, client: '  ' },
    { ...valid, media: undefined },
    {
      ...valid,
      media: { ...valid.media, image: { ...valid.media.image, src: 'https://x.y/a.avif' } },
    },
  ])('rejects malformed testimonials', (value) => {
    expect(() => normalizeTestimonial(value)).toThrow(TestimonialValidationError);
  });

  it('rejects duplicates and non-list data', async () => {
    await expect(getTestimonials({ getTestimonials: async () => [valid, valid] })).rejects.toThrow(
      'unique',
    );
    await expect(getTestimonials({ getTestimonials: async () => ({}) })).rejects.toThrow(
      TestimonialValidationError,
    );
  });

  it('counts every client and averages only the ratings that were given', async () => {
    const summary = summarizeTestimonials(await getTestimonials());
    expect(summary.count).toBe(14);
    expect(summary.average).toBe(5);
    expect(summarizeTestimonials([])).toEqual({ count: 0, average: 0 });
    expect(
      summarizeTestimonials([
        { ...normalizeTestimonial(valid), rating: 4 },
        { ...normalizeTestimonial({ ...valid, id: 'b', rating: undefined }) },
      ]),
    ).toEqual({ count: 2, average: 4 });
  });
});
