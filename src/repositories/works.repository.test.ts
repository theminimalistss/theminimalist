import { describe, expect, it } from 'vitest';
import { worksRepository } from '@/repositories/works.repository';
import { getHeroWorks } from '@/services/works.service';

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

  it('honors cancelled requests', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(worksRepository.getFeaturedWorks(controller.signal)).rejects.toThrow();
  });
});
