import { describe, expect, it } from 'vitest';
import { filterTemplates, getTemplates, templateCategories } from '@/services/templates.service';

const valid = {
  id: 'one',
  name: 'One',
  category: 'Studio portfolio',
  description: 'A quiet site.',
  pages: 3,
  layout: 'portfolio',
  features: ['Case studies'],
};

describe('templates', () => {
  it('filters by exact category without mutating the catalog', async () => {
    const templates = await getTemplates();
    const ids = templates.map((item) => item.id);
    expect(filterTemplates(templates, 'Online shop').map((item) => item.name)).toEqual(['Mercer']);
    expect(filterTemplates(templates, 'Unknown')).toEqual([]);
    expect(filterTemplates(templates, null).map((item) => item.id)).toEqual(ids);
    expect(templates.map((item) => item.id)).toEqual(ids);
  });
  it('lists the website templates with unique ids and known layouts', async () => {
    const templates = await getTemplates();
    expect(templates.length).toBeGreaterThan(0);
    expect(new Set(templates.map((item) => item.id)).size).toBe(templates.length);
    expect(templateCategories(templates).length).toBe(templates.length);
  });

  it('rejects incomplete or duplicate templates', async () => {
    const repository = (data: unknown) => ({ getTemplates: async () => data });
    await expect(getTemplates(repository([{ ...valid, pages: 0 }]))).rejects.toThrow('page count');
    await expect(getTemplates(repository([{ ...valid, layout: 'gallery' }]))).rejects.toThrow(
      'known layout',
    );
    await expect(getTemplates(repository([valid, valid]))).rejects.toThrow('unique');
    await expect(getTemplates(repository({}))).rejects.toThrow('list');
  });
});
