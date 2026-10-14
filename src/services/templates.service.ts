import { templatesRepository } from '@/repositories/templates.repository';
import {
  TEMPLATE_LAYOUTS,
  type TemplateLayout,
  type TemplatesRepository,
  type WebsiteTemplate,
} from '@/types/template';

export class TemplateValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TemplateValidationError';
  }
}

function text(value: unknown, name: string) {
  if (typeof value !== 'string' || !value.trim())
    throw new TemplateValidationError(`A template requires ${name}.`);
  return value.trim();
}

function normalizeTemplate(value: unknown): WebsiteTemplate {
  if (typeof value !== 'object' || value === null)
    throw new TemplateValidationError('A template must be an object.');
  const raw = value as Record<string, unknown>;
  const pages = raw.pages;
  if (typeof pages !== 'number' || !Number.isInteger(pages) || pages < 1)
    throw new TemplateValidationError('A template requires a page count.');
  if (!TEMPLATE_LAYOUTS.includes(raw.layout as TemplateLayout))
    throw new TemplateValidationError('A template requires a known layout.');
  if (!Array.isArray(raw.features) || !raw.features.length)
    throw new TemplateValidationError('A template requires features.');
  return {
    id: text(raw.id, 'an id'),
    name: text(raw.name, 'a name'),
    category: text(raw.category, 'a category'),
    description: text(raw.description, 'a description'),
    pages,
    layout: raw.layout as TemplateLayout,
    features: raw.features.map((feature) => text(feature, 'feature text')),
  };
}

export async function getTemplates(
  repository: TemplatesRepository = templatesRepository,
  signal?: AbortSignal,
): Promise<WebsiteTemplate[]> {
  const data = await repository.getTemplates(signal);
  if (!Array.isArray(data)) throw new TemplateValidationError('Templates must be a list.');
  const templates = data.map((value: unknown) => normalizeTemplate(value));
  if (new Set(templates.map((item) => item.id)).size !== templates.length)
    throw new TemplateValidationError('Template ids must be unique.');
  return templates;
}

export function templateCategories(templates: readonly WebsiteTemplate[]) {
  return [...new Set(templates.map((item) => item.category))];
}
