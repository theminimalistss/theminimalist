import type { ProductKey } from './content';

export const SOFTWARE_VIEWS = ['organise', 'connect', 'understand'] as const;
export const PRODUCT_LAYOUTS = ['portfolio', 'journal', 'shop'] as const;
export const HARDWARE_PARTS = ['shell', 'core', 'base'] as const;
export type SoftwareView = (typeof SOFTWARE_VIEWS)[number];
export type ProductLayout = (typeof PRODUCT_LAYOUTS)[number];
export type HardwarePart = (typeof HARDWARE_PARTS)[number];
export type ProductNote = { title: string; text: string };
type Choice<Id extends string> = ProductNote & { id: Id; label: string };
type ProductBase = {
  title: string;
  accent: string;
  lead: string;
  notice: string;
  section: ProductNote;
  steps: ProductNote[];
  closing: ProductNote;
};
export type SoftwareProduct = ProductBase & {
  key: 'software';
  views: (Choice<SoftwareView> & { items: string[] })[];
};
export type TemplateProduct = ProductBase & {
  key: 'templates';
  views: Choice<ProductLayout>[];
  collection: ProductNote;
};
export type HardwareProduct = ProductBase & {
  key: 'hardware';
  parts: (Choice<HardwarePart> & { material: string })[];
};
export type ProductDetail = SoftwareProduct | TemplateProduct | HardwareProduct;
export interface ProductDetailsRepository {
  getProduct(key: ProductKey, signal?: AbortSignal): Promise<unknown>;
}
