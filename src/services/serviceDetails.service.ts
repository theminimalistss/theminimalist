import { serviceDetailsRepository } from '@/repositories/serviceDetails.repository';
import type {
  ServiceDetail,
  ServiceDetailsRepository,
  ServiceKey,
  ServiceCapability,
  ServiceStep,
} from '@/types/service';
import type { ImageSources } from '@/types/work';
import { SOFTWARE_PLATFORMS } from '@/types/service';

export class ServiceContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServiceContentError';
  }
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new ServiceContentError('Service content must be an object.');
  return value as Record<string, unknown>;
}
function text(value: unknown): string {
  if (typeof value !== 'string' || !value.trim())
    throw new ServiceContentError('Service text is required.');
  return value.trim();
}
function list<T>(value: unknown, normalize: (item: unknown) => T): T[] {
  if (!Array.isArray(value) || !value.length)
    throw new ServiceContentError('Service lists cannot be empty.');
  return value.map(normalize);
}
function step(value: unknown): ServiceStep {
  const item = record(value);
  return { title: text(item.title), text: text(item.text) };
}
function capability(value: unknown): ServiceCapability {
  const item = record(value);
  return { ...step(item), items: list(item.items, text) };
}
function localImage(value: unknown): ImageSources {
  const image = record(value);
  const source = (value: unknown) => {
    const url = text(value);
    if (
      !url.startsWith('/') ||
      url.startsWith('//') ||
      !/\.(avif|webp)$/u.test(url) ||
      url.includes('..') ||
      /[\\\s]/u.test(url)
    )
      throw new ServiceContentError('Service illustrations require local optimised images.');
    return url;
  };
  return {
    src: source(image.src),
    srcSmall: source(image.srcSmall),
    webp: source(image.webp),
    webpSmall: source(image.webpSmall),
  };
}

export async function getServiceDetail(
  key: ServiceKey,
  repository: ServiceDetailsRepository = serviceDetailsRepository,
  signal?: AbortSignal,
): Promise<ServiceDetail> {
  const raw = record(await repository.getService(key, signal));
  const capabilities = record(raw.capabilities);
  const process = record(raw.process);
  const handover = record(raw.handover);
  const closing = record(raw.closing);
  const preview = record(raw.preview);
  const base = {
    title: text(raw.title),
    accent: text(raw.accent),
    lead: text(raw.lead),
    discipline: text(raw.discipline),
    fit: text(raw.fit),
    capabilities: {
      title: text(capabilities.title),
      accent: text(capabilities.accent),
      text: text(capabilities.text),
      items: list(capabilities.items, capability),
    },
    process: {
      title: text(process.title),
      accent: text(process.accent),
      steps: list(process.steps, step),
    },
    handover: {
      title: text(handover.title),
      text: text(handover.text),
      items: list(handover.items, text),
    },
    closing: { title: text(closing.title), accent: text(closing.accent), text: text(closing.text) },
  };
  const sample = { name: text(preview.name), caption: text(preview.caption) };
  switch (key) {
    case 'software': {
      const platforms = list(preview.platforms, (value) => {
        const item = record(value);
        const id = SOFTWARE_PLATFORMS.find((platform) => platform === item.id);
        if (!id) throw new ServiceContentError('Unknown software platform.');
        return { ...step(item), id, items: list(item.items, text) };
      });
      if (new Set(platforms.map((item) => item.id)).size !== platforms.length)
        throw new ServiceContentError('Software platform ids must be unique.');
      if (platforms.length !== SOFTWARE_PLATFORMS.length)
        throw new ServiceContentError('All five software platforms are required.');
      return { ...base, key, preview: { ...sample, platforms } };
    }
    case 'websites':
      return {
        ...base,
        key,
        preview: {
          ...sample,
          headline: text(preview.headline),
          text: text(preview.text),
          image: localImage(preview.image),
        },
      };
    case 'branding':
      return {
        ...base,
        key,
        preview: {
          ...sample,
          monogram: text(preview.monogram),
          tagline: text(preview.tagline),
          note: text(preview.note),
        },
      };
  }
}
