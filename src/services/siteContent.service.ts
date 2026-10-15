import { siteContentRepository } from '@/repositories/siteContent.repository';
import { INQUIRY_KINDS, type InquiryKind } from '@/types/inquiry';
import type { ProductCopy, SiteContent, SiteContentRepository } from '@/types/content';

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContentValidationError';
  }
}

function product(copy: Omit<ProductCopy, 'status'> & { status: string }): ProductCopy {
  if (copy.status !== 'available' && copy.status !== 'soon') {
    throw new ContentValidationError('Product availability must be available or soon.');
  }
  return { ...copy, status: copy.status };
}

// Editable process text is paired with four fixed drawing stages.
const readers: {
  [Key in keyof SiteContent]: (repository: SiteContentRepository) => SiteContent[Key];
} = {
  pages: (repository) => repository.read('pages'),
  studio: (repository) => repository.read('studio'),
  contact: (repository) => repository.read('contact'),
  products: (repository) => {
    const source = repository.read('products');
    return {
      software: product(source.software),
      templates: product(source.templates),
      hardware: product(source.hardware),
    };
  },
  process: (repository) => {
    const stages = repository.read('process');
    if (stages.length !== 4) {
      throw new ContentValidationError('The service process requires four drawing stages.');
    }
    return stages;
  },
  inquiry: (repository) => {
    const source = repository.read('inquiry');
    const intents = source.intents.map((intent) => {
      const kind = INQUIRY_KINDS.find((kind) => kind === intent.kind);
      if (!kind) throw new ContentValidationError('Unknown inquiry intent.');
      return { ...intent, kind };
    });
    if (
      intents.length !== INQUIRY_KINDS.length ||
      new Set<InquiryKind>(intents.map((intent) => intent.kind)).size !== INQUIRY_KINDS.length
    ) {
      throw new ContentValidationError('Each inquiry intent must appear exactly once.');
    }
    return { ...source, intents };
  },
};

function requireText(value: unknown): void {
  if (typeof value === 'string' && !value.trim()) {
    throw new ContentValidationError('Content text must not be empty.');
  }
  if (Array.isArray(value) && !value.length) {
    throw new ContentValidationError('Content lists must not be empty.');
  }
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(requireText);
  }
}

export function getSiteContent<Key extends keyof SiteContent>(
  key: Key,
  repository: SiteContentRepository = siteContentRepository,
): SiteContent[Key] {
  const content = readers[key](repository);
  requireText(content);
  return content;
}
