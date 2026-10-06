import { describe, expect, it } from 'vitest';
import { worksRepository } from '@/repositories/works.repository';
import { getCollectionWorks, getHeroWorks } from '@/services/works.service';

describe('local work repository', () => {
  it('provides a valid alternating collection with isolated snapshots', async () => {
    const works = await getHeroWorks();
    expect(works).toHaveLength(6);
    expect(works.map((work) => work.mediaType)).toEqual([
      'image',
      'video',
      'image',
      'video',
      'image',
      'video',
    ]);
    works.pop();
    expect(await getHeroWorks()).toHaveLength(6);
  });

  it('keeps Home to six featured studies and gives Works all twelve', async () => {
    const collection = await getCollectionWorks();
    expect(collection).toHaveLength(12);
    expect(collection.slice(0, 6).every((work) => work.featured)).toBe(true);
    expect(collection.slice(6).some((work) => work.featured)).toBe(false);
    expect(collection.every((work) => work.isConcept)).toBe(true);
    expect(collection.map((work) => work.mediaType)).toEqual(
      Array.from({ length: 12 }, (_, index) => (index % 2 ? 'video' : 'image')),
    );
    expect((await getHeroWorks()).map((work) => work.id)).toEqual(
      collection.slice(0, 6).map((work) => work.id),
    );
  });

  it('honors cancelled requests', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(worksRepository.getWorks(controller.signal)).rejects.toThrow();
  });
});
