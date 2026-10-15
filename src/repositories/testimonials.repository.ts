import testimonials from '@/data/testimonials.json';
import { TESTIMONIAL_MEDIA } from '@/repositories/testimonials.media';
import type { TestimonialsRepository } from '@/types/testimonial';

export const testimonialsRepository: TestimonialsRepository = {
  async getTestimonials(signal) {
    if (signal?.aborted) throw new DOMException('The request was aborted.', 'AbortError');
    return JSON.parse(
      JSON.stringify(testimonials.map((item) => ({ ...item, media: TESTIMONIAL_MEDIA[item.id] }))),
    ) as unknown;
  },
};
