import { worksRepository } from '@/repositories/works.repository';
import type { ImageSources, Work, WorkBase, WorksRepository } from '@/types/work';

export class WorkValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WorkValidationError';
  }
}

function record(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new WorkValidationError('A work entry must be an object.');
  }
  return value as Record<string, unknown>;
}

function textField(value: unknown, name: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new WorkValidationError(`A work entry requires ${name}.`);
  }
  return value.trim();
}

function localSource(value: unknown): string {
  const source = textField(value, 'a local media source');
  if (!source.startsWith('/') || source.startsWith('//') || /[\\\s]/u.test(source)) {
    throw new WorkValidationError('Work media must use a local asset URL.');
  }
  return source;
}

function positiveNumber(value: unknown, name: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new WorkValidationError(`Invalid ${name}.`);
  }
  return value;
}

function imageSources(value: unknown): ImageSources {
  const image = record(value);
  return {
    src: localSource(image.src),
    srcSmall: localSource(image.srcSmall),
    webp: localSource(image.webp),
    webpSmall: localSource(image.webpSmall),
  };
}

export function normalizeWork(value: unknown): Work {
  const raw = record(value);
  const artDirection = raw.artDirection;
  if (
    artDirection !== 'forma' &&
    artDirection !== 'still' &&
    artDirection !== 'solenne' &&
    artDirection !== 'earth' &&
    artDirection !== 'arc' &&
    artDirection !== 'wild'
  ) {
    throw new WorkValidationError('Unknown work art direction.');
  }
  const slug = textField(raw.slug, 'slug');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug))
    throw new WorkValidationError('Invalid work slug.');
  if (typeof raw.featured !== 'boolean' || typeof raw.isConcept !== 'boolean') {
    throw new WorkValidationError('Work visibility and concept status must be explicit.');
  }
  if (typeof raw.order !== 'number' || !Number.isInteger(raw.order) || raw.order < 0) {
    throw new WorkValidationError('Work order must be a non-negative integer.');
  }
  const year = positiveNumber(raw.year, 'year');
  if (!Number.isInteger(year) || year < 1900 || year > 2100)
    throw new WorkValidationError('Invalid year.');
  const base: WorkBase = {
    id: textField(raw.id, 'id'),
    slug,
    title: textField(raw.title, 'title'),
    category: textField(raw.category, 'category'),
    alt: textField(raw.alt, 'alt text'),
    description: textField(raw.description, 'description'),
    tagline: textField(raw.tagline, 'tagline'),
    year,
    width: positiveNumber(raw.width, 'width'),
    height: positiveNumber(raw.height, 'height'),
    featured: raw.featured,
    isConcept: raw.isConcept,
    order: raw.order,
    artDirection,
  };
  if (raw.mediaType === 'image')
    return { ...base, mediaType: 'image', image: imageSources(raw.image) };
  if (raw.mediaType === 'video') {
    return {
      ...base,
      mediaType: 'video',
      src: localSource(raw.src),
      mp4: localSource(raw.mp4),
      poster: imageSources(raw.poster),
    };
  }
  throw new WorkValidationError('Unsupported work media type.');
}

export async function getHeroWorks(
  repository: WorksRepository = worksRepository,
  signal?: AbortSignal,
): Promise<Work[]> {
  const data = await repository.getFeaturedWorks(signal);
  if (!Array.isArray(data)) throw new WorkValidationError('The work collection must be an array.');
  const works = data.map((value: unknown) => normalizeWork(value));
  if (
    new Set(works.map((work) => work.id)).size !== works.length ||
    new Set(works.map((work) => work.slug)).size !== works.length
  ) {
    throw new WorkValidationError('Work IDs and slugs must be unique.');
  }
  return works
    .filter((work) => work.featured)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}
