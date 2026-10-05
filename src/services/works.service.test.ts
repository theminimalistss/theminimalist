import { describe, expect, it } from 'vitest';
import { getHeroWorks, normalizeWork, WorkValidationError } from '@/services/works.service';
import { imageWork, videoWork } from '@/tests/fixtures';

describe('work validation and selection', () => {
  it('normalizes text and preserves image/video variants', () => {
    expect(normalizeWork({ ...imageWork, title: '  Forma  ' }).title).toBe('Forma');
    expect(normalizeWork(videoWork)).toMatchObject({
      mediaType: 'video',
      src: videoWork.src,
      poster: videoWork.poster,
    });
  });

  it.each([
    null,
    [],
    { ...imageWork, title: '' },
    { ...imageWork, slug: '../wrong' },
    { ...imageWork, width: 0 },
    { ...imageWork, height: Infinity },
    { ...imageWork, year: 1900.5 },
    { ...imageWork, year: 2101 },
    { ...imageWork, year: 1800 },
    { ...imageWork, year: -1 },
    { ...imageWork, order: -1 },
    { ...imageWork, order: 0.5 },
    { ...imageWork, featured: 'yes' },
    { ...imageWork, isConcept: undefined },
    { ...imageWork, artDirection: 'unknown' },
    { ...imageWork, mediaType: 'gif' },
    { ...videoWork, poster: undefined },
    { ...videoWork, poster: { src: '/media/poster.avif' } },
    { ...videoWork, src: 'https://example.com/video.webm' },
    { ...videoWork, src: '//example.com/video.webm' },
    { ...videoWork, src: '/bad\\path.webm' },
    { ...videoWork, src: '/bad path.webm' },
    { ...videoWork, mp4: '' },
  ])('rejects malformed work %#', (data) => {
    expect(() => normalizeWork(data)).toThrow(WorkValidationError);
  });

  it('filters and orders featured work without mutating the repository result', async () => {
    const raw = [
      { ...videoWork, order: 3 },
      { ...imageWork, order: 1 },
      { ...imageWork, id: 'hidden', slug: 'hidden', featured: false },
    ];
    const works = await getHeroWorks({ getFeaturedWorks: async () => raw });
    expect(works.map((work) => work.id)).toEqual(['test', 'video']);
    expect(raw[0]?.id).toBe('video');
  });

  it('uses stable ID ordering for equal explicit order values', async () => {
    const works = await getHeroWorks({ getFeaturedWorks: async () => [videoWork, imageWork] });
    expect(works.map((work) => work.id)).toEqual(['test', 'video']);
  });

  it('supports an empty collection', async () => {
    await expect(getHeroWorks({ getFeaturedWorks: async () => [] })).resolves.toEqual([]);
  });

  it.each([null, {}, 'invalid'])('rejects malformed collections', async (value) => {
    await expect(getHeroWorks({ getFeaturedWorks: async () => value })).rejects.toThrow(
      WorkValidationError,
    );
  });

  it('rejects duplicate IDs and duplicate slugs', async () => {
    await expect(
      getHeroWorks({ getFeaturedWorks: async () => [imageWork, imageWork] }),
    ).rejects.toThrow('unique');
    await expect(
      getHeroWorks({
        getFeaturedWorks: async () => [imageWork, { ...imageWork, id: 'different' }],
      }),
    ).rejects.toThrow('unique');
  });

  it('propagates repository failures', async () => {
    await expect(
      getHeroWorks({
        getFeaturedWorks: async () => {
          throw new Error('Offline');
        },
      }),
    ).rejects.toThrow('Offline');
  });
});
