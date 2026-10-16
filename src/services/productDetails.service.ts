import { productDetailsRepository } from '@/repositories/productDetails.repository';
import type { ProductKey } from '@/types/content';
import {
  HARDWARE_PARTS,
  PRODUCT_LAYOUTS,
  SOFTWARE_VIEWS,
  type ProductDetail,
  type ProductDetailsRepository,
} from '@/types/product';

export class ProductContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductContentError';
  }
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new ProductContentError('Product content must be an object.');
  return value as Record<string, unknown>;
}
function text(value: unknown): string {
  if (typeof value !== 'string' || !value.trim())
    throw new ProductContentError('Product text is required.');
  return value.trim();
}
function list<T>(value: unknown, normalize: (item: unknown) => T): T[] {
  if (!Array.isArray(value) || !value.length)
    throw new ProductContentError('Product lists cannot be empty.');
  return value.map(normalize);
}
function note(value: unknown) {
  const item = record(value);
  return { title: text(item.title), text: text(item.text) };
}
function choices<Id extends string, Extra extends object>(
  value: unknown,
  ids: readonly Id[],
  extra: (item: Record<string, unknown>) => Extra,
) {
  const result = list(value, (value) => {
    const item = record(value);
    const id = ids.find((id) => id === item.id);
    if (!id) throw new ProductContentError('Unknown product illustration choice.');
    return { id, label: text(item.label), ...note(item), ...extra(item) };
  });
  if (result.length !== ids.length || new Set(result.map((item) => item.id)).size !== ids.length)
    throw new ProductContentError('Every product illustration choice must be unique and present.');
  return result;
}

export async function getProductDetail(
  key: ProductKey,
  repository: ProductDetailsRepository = productDetailsRepository,
  signal?: AbortSignal,
): Promise<ProductDetail> {
  const raw = record(await repository.getProduct(key, signal));
  if (signal?.aborted) throw new DOMException('The request was aborted.', 'AbortError');
  if (raw.key !== key) throw new ProductContentError('Product content must match its route.');
  const base = {
    title: text(raw.title),
    accent: text(raw.accent),
    lead: text(raw.lead),
    notice: text(raw.notice),
    section: note(raw.section),
    steps: list(raw.steps, note),
    closing: note(raw.closing),
  };
  if (base.steps.length !== 3)
    throw new ProductContentError('Product compositions require three supporting notes.');
  switch (key) {
    case 'software':
      return {
        ...base,
        key,
        views: choices(raw.views, SOFTWARE_VIEWS, (item) => {
          const items = list(item.items, text);
          if (items.length !== 3)
            throw new ProductContentError('Software illustrations require three example labels.');
          return { items };
        }),
      };
    case 'templates':
      return {
        ...base,
        key,
        views: choices(raw.views, PRODUCT_LAYOUTS, () => ({})),
        collection: note(raw.collection),
      };
    case 'hardware':
      return {
        ...base,
        key,
        parts: choices(raw.parts, HARDWARE_PARTS, (item) => ({ material: text(item.material) })),
      };
  }
}
