import { testimonialsRepository } from '@/repositories/testimonials.repository';
import type { Testimonial, TestimonialMedia, TestimonialsRepository } from '@/types/testimonial';
import type { ImageSources } from '@/types/work';

export class TestimonialValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TestimonialValidationError';
  }
}

const EXCERPT_LENGTH = 150;

function text(value: unknown, name: string) {
  if (typeof value !== 'string' || !value.trim())
    throw new TestimonialValidationError(`A testimonial requires ${name}.`);
  return value.trim();
}

function optionalText(value: unknown, name: string) {
  return value === undefined ? undefined : text(value, name);
}

export function toExcerpt(paragraph: string, limit = EXCERPT_LENGTH) {
  if (paragraph.length <= limit) return paragraph;
  const cut = paragraph.slice(0, limit);
  const sentence = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '));
  if (sentence > limit * 0.55) return cut.slice(0, sentence + 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—-]$/u, '')}…`;
}

function local(value: unknown) {
  const source = text(value, 'a local media source');
  if (!source.startsWith('/') || source.startsWith('//') || /[\\\s]/u.test(source))
    throw new TestimonialValidationError('Testimonial media must use a local asset URL.');
  return source;
}

function sources(value: unknown): ImageSources {
  if (typeof value !== 'object' || value === null)
    throw new TestimonialValidationError('Testimonial images need sources.');
  const raw = value as Record<string, unknown>;
  return {
    src: local(raw.src),
    srcSmall: local(raw.srcSmall),
    webp: local(raw.webp),
    webpSmall: local(raw.webpSmall),
  };
}

function media(value: unknown): TestimonialMedia {
  if (typeof value !== 'object' || value === null)
    throw new TestimonialValidationError('A testimonial requires media.');
  const raw = value as Record<string, unknown>;
  if (raw.type === 'image') return { type: 'image', image: sources(raw.image) };
  if (raw.type === 'video')
    return { type: 'video', src: local(raw.src), mp4: local(raw.mp4), poster: sources(raw.poster) };
  throw new TestimonialValidationError('Unsupported testimonial media.');
}

export function normalizeTestimonial(value: unknown): Testimonial {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw new TestimonialValidationError('A testimonial must be an object.');
  const raw = value as Record<string, unknown>;
  const id = text(raw.id, 'an id');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id))
    throw new TestimonialValidationError('Invalid testimonial id.');
  if (!Array.isArray(raw.paragraphs) || !raw.paragraphs.length)
    throw new TestimonialValidationError('A testimonial requires its words.');
  const paragraphs = raw.paragraphs.map((paragraph) => text(paragraph, 'paragraph text'));
  let rating: number | undefined;
  if (raw.rating !== undefined) {
    if (typeof raw.rating !== 'number' || raw.rating < 1 || raw.rating > 5)
      throw new TestimonialValidationError('A rating must be between 1 and 5.');
    rating = raw.rating;
  }
  const role = optionalText(raw.role, 'a role');
  const headline = optionalText(raw.headline, 'a headline');
  return {
    id,
    client: text(raw.client, 'a client name'),
    business: text(raw.business, 'a business'),
    paragraphs,
    excerpt: headline ?? toExcerpt(paragraphs[0] ?? ''),
    media: media(raw.media),
    ...(role ? { role } : {}),
    ...(headline ? { headline } : {}),
    ...(rating ? { rating } : {}),
  };
}

export async function getTestimonials(
  repository: TestimonialsRepository = testimonialsRepository,
  signal?: AbortSignal,
): Promise<Testimonial[]> {
  const data = await repository.getTestimonials(signal);
  if (!Array.isArray(data)) throw new TestimonialValidationError('Testimonials must be a list.');
  const testimonials = data.map((value: unknown) => normalizeTestimonial(value));
  if (new Set(testimonials.map((item) => item.id)).size !== testimonials.length)
    throw new TestimonialValidationError('Testimonial ids must be unique.');
  return testimonials;
}
