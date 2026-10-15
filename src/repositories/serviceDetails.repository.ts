import content from '@/data/service-details.json';
import type { ServiceDetailsRepository } from '@/types/service';
import formaAvif from '@/assets/images/hero/forma-960.avif';
import formaSmall from '@/assets/images/hero/forma-480.avif';
import formaWebp from '@/assets/images/hero/forma-960.webp';
import formaWebpSmall from '@/assets/images/hero/forma-480.webp';

export const serviceDetailsRepository: ServiceDetailsRepository = {
  async getService(key, signal) {
    if (signal?.aborted) throw new DOMException('The request was aborted.', 'AbortError');
    const service = content[key];
    return JSON.parse(
      JSON.stringify(
        key === 'websites'
          ? {
              ...service,
              preview: {
                ...service.preview,
                image: {
                  src: formaAvif,
                  srcSmall: formaSmall,
                  webp: formaWebp,
                  webpSmall: formaWebpSmall,
                },
              },
            }
          : service,
      ),
    ) as unknown;
  },
};
