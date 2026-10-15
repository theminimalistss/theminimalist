import pages from '@/data/page-intros.json';
import studio from '@/data/studio.json';
import products from '@/data/products.json';
import process from '@/data/service-process.json';
import inquiry from '@/data/inquiry.json';
import contact from '@/data/contact.json';
import type { SiteContentRepository, SiteContentSource } from '@/types/content';

// Bundled content is checked at compile time; each read supplies an isolated snapshot.
const content = { pages, studio, products, process, inquiry, contact } satisfies SiteContentSource;

export const siteContentRepository: SiteContentRepository = {
  read<Key extends keyof SiteContentSource>(key: Key): SiteContentSource[Key] {
    return JSON.parse(JSON.stringify(content[key])) as SiteContentSource[Key];
  },
};
