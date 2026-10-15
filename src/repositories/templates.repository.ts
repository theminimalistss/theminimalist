import templates from '@/data/templates.json';
import type { TemplatesRepository } from '@/types/template';

export const templatesRepository: TemplatesRepository = {
  async getTemplates(signal) {
    if (signal?.aborted) throw new DOMException('The request was aborted.', 'AbortError');
    return JSON.parse(JSON.stringify(templates)) as unknown;
  },
};
