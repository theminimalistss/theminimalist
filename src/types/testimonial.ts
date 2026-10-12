import type { ImageSources } from '@/types/work';

export type TestimonialMedia =
  | { type: 'image'; image: ImageSources }
  | { type: 'video'; src: string; mp4: string; poster: ImageSources };

export type Testimonial = {
  id: string;
  client: string;
  role?: string;
  business: string;
  rating?: number;
  headline?: string;
  paragraphs: string[];
  excerpt: string;
  media: TestimonialMedia;
};

export interface TestimonialsRepository {
  getTestimonials(signal?: AbortSignal): Promise<unknown>;
}
