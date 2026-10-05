import meta from './pageMeta.json' with { type: 'json' };

export type PageMeta = {
  title: string;
  eyebrow: string;
  heading: string;
  description: string;
  image: string;
};

export const SITE = meta.site;
export const PAGE_META: Record<string, PageMeta> = meta.pages;
export const NOT_FOUND_META: PageMeta = meta.notFound;

export function getPageMeta(path: string): PageMeta {
  return PAGE_META[path] ?? NOT_FOUND_META;
}

export function formatPageTitle(path: string) {
  const page = getPageMeta(path);
  return path === '/' ? page.title : `${page.title} — ${SITE.name}`;
}
