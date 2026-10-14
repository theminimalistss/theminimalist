export const TEMPLATE_LAYOUTS = [
  'editorial',
  'shop',
  'menu',
  'portfolio',
  'journal',
  'services',
] as const;

export type TemplateLayout = (typeof TEMPLATE_LAYOUTS)[number];

export type WebsiteTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  pages: number;
  layout: TemplateLayout;
  features: readonly string[];
};

export interface TemplatesRepository {
  getTemplates(signal?: AbortSignal): Promise<unknown>;
}
