import type { InquiryKind } from '@/types/inquiry';

export const PRODUCT_KEYS = ['software', 'templates', 'hardware'] as const;
export type ProductKey = (typeof PRODUCT_KEYS)[number];
export type OverviewKey = 'about' | 'services' | 'products' | 'contact';

export type PageIntroCopy = Readonly<{
  eyebrow: string;
  title: string;
  accent: string;
  lead: string;
}>;

export type ProductCopy = Readonly<{
  status: 'available' | 'soon';
  title: string;
  accent: string;
  lead: string;
  checklist: readonly string[];
}>;

export type ProcessStage = Readonly<{ title: string; text: string }>;
type PortalCopy = Readonly<{ label: string; category: string; description: string }>;

export type StudioCopy = Readonly<{
  approach: Readonly<{
    eyebrow: string;
    statement: string;
    accent: string;
    footer: string;
    title: string;
    titleAccent: string;
    lead: string;
    linkLabel: string;
  }>;
  principles: readonly ProcessStage[];
  directoryTitle: string;
  portals: Readonly<Record<'founders' | 'testimonials' | 'works', PortalCopy>>;
}>;

type InquiryIntent = Readonly<{
  kind: InquiryKind;
  label: string;
  hint: string;
  prompt: string;
}>;

export type InquiryCopy = Readonly<{
  intents: readonly InquiryIntent[];
  options: Readonly<{
    services: readonly string[];
    timelines: readonly string[];
    times: readonly string[];
    formats: readonly string[];
  }>;
}>;

export type SiteContent = {
  pages: Readonly<Record<OverviewKey, PageIntroCopy>>;
  studio: StudioCopy;
  products: Readonly<Record<ProductKey, ProductCopy>>;
  process: readonly ProcessStage[];
  inquiry: InquiryCopy;
  contact: Readonly<{ email: string; hours: string; replies: string }>;
};

// JSON widens string literals. The service narrows these domain values.
export type SiteContentSource = Omit<SiteContent, 'products' | 'inquiry'> & {
  products: Readonly<Record<ProductKey, Omit<ProductCopy, 'status'> & { status: string }>>;
  inquiry: Omit<InquiryCopy, 'intents'> & {
    intents: readonly (Omit<InquiryIntent, 'kind'> & { kind: string })[];
  };
};

export interface SiteContentRepository {
  read<Key extends keyof SiteContentSource>(key: Key): SiteContentSource[Key];
}
