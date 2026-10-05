export type PageCopy = {
  title: string;
  accent: string;
  lead: string;
  checklist: readonly string[];
};

export const PRODUCT_COPY = {
  software: {
    title: 'Software solutions',
    accent: 'built to feel calm.',
    lead: 'Digital tools and platforms shaped with the same restraint as our identities. The catalog is being prepared.',
    checklist: [
      'Product overviews and walkthroughs',
      'Plans, licensing, and support',
      'Integration and onboarding notes',
    ],
  },
  templates: {
    title: 'Website templates',
    accent: 'considered starting points.',
    lead: 'Editorial website templates for studios, brands, and makers who value quiet, purposeful design.',
    checklist: [
      'Live previews of each template',
      'What’s included and how to make it yours',
      'Licensing and updates',
    ],
  },
  hardware: {
    title: 'Hardware products',
    accent: 'specified with intention.',
    lead: 'Physical products selected and specified with the same attention to material and detail.',
    checklist: [
      'Specifications and finishes',
      'Availability and lead times',
      'Installation and care guidance',
    ],
  },
} as const satisfies Record<string, PageCopy>;

export const INQUIRY_COPY = {
  general: {
    title: 'General inquiry',
    accent: 'Say hello.',
    lead: 'Questions, ideas, introductions. Tell us a little about what you have in mind.',
    checklist: ['Your name and email', 'Organisation (optional)', 'What you’d like to talk about'],
  },
  quote: {
    title: 'Request a quote',
    accent: 'Let’s scope it together.',
    lead: 'Share the shape of a project or product order and we’ll prepare a considered estimate.',
    checklist: [
      'Project or product type',
      'Goals, scope, and timeline',
      'Budget range',
      'Contact details',
    ],
  },
  appointment: {
    title: 'Book an appointment',
    accent: 'In person or online.',
    lead: 'Reserve time with the studio to talk through a project, a product, or an idea.',
    checklist: [
      'Preferred date and time',
      'In person or online',
      'What you’d like to discuss',
      'Contact details',
    ],
  },
} as const satisfies Record<string, PageCopy>;

export type ProductKey = keyof typeof PRODUCT_COPY;
export type InquiryKey = keyof typeof INQUIRY_COPY;
