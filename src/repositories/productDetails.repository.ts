import content from '@/data/product-details.json';
import type { ProductDetailsRepository } from '@/types/product';

export const productDetailsRepository: ProductDetailsRepository = {
  async getProduct(key, signal) {
    if (signal?.aborted) throw new DOMException('The request was aborted.', 'AbortError');
    return JSON.parse(JSON.stringify(content[key])) as unknown;
  },
};
