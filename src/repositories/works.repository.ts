import { featuredWorks } from '@/repositories/works.content';
import type { WorksRepository } from '@/types/work';

export const worksRepository: WorksRepository = {
  async getFeaturedWorks(signal) {
    signal?.throwIfAborted();
    return structuredClone(featuredWorks);
  },
};
