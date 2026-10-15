import works from '@/data/works.json';
import { resolveWorkMedia } from '@/repositories/works.media';
import type { WorksRepository } from '@/types/work';

export const worksRepository: WorksRepository = {
  async getWorks(signal) {
    if (signal?.aborted) throw new DOMException('The request was aborted.', 'AbortError');
    return works.map(({ asset, ...work }) => ({
      ...work,
      ...resolveWorkMedia(asset, work.mediaType),
    }));
  },
};
