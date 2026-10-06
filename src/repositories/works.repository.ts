import { works } from '@/repositories/works.content';
import type { WorksRepository } from '@/types/work';

export const worksRepository: WorksRepository = {
  async getWorks(signal) {
    if (signal?.aborted) throw new DOMException('The request was aborted.', 'AbortError');
    return JSON.parse(JSON.stringify(works)) as unknown;
  },
};
