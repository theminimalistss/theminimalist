export type PageCopy = {
  title: string;
  accent: string;
  lead: string;
  checklist: readonly string[];
};

export type ServiceCopy = PageCopy & { works: string };

export const SERVICE_COPY = {
  software: {
    title: 'Software development',
    accent: 'built to feel calm.',
    lead: 'Custom software, web apps, and internal tools, engineered with the same care as our design: clear, dependable, and easy to use.',
    checklist: [
      'Discovery and product scoping',
      'Interface and experience design',
      'Web and mobile application development',
      'Integrations, APIs, and data',
      'Testing, launch, and ongoing support',
    ],
    works: 'Software concepts such as Lumen sit in the Works collection.',
  },
  websites: {
    title: 'Website development',
    accent: 'calm, fast, and yours.',
    lead: 'Editorial websites and online stores, designed and built to load fast, read well, and stay easy to update.',
    checklist: [
      'Site strategy and structure',
      'Visual design and content layout',
      'Responsive, accessible development',
      'E-commerce and booking setups',
      'Search, sharing, and analytics basics',
    ],
    works: 'Website concepts such as Folio, Grain, and Haven sit in the Works collection.',
  },
  branding: {
    title: 'Branding identity',
    accent: 'clarity and character.',
    lead: 'Logos and identities with clarity and character, from the first sketch to packaging, labels, and hang tags.',
    checklist: [
      'Logo design and refinements',
      'Colour, typography, and brand guidelines',
      'Packaging, labels, and hang tags',
      'Social and print templates',
      'Brand files ready for every use',
      'Add-on applications, from business cards to menus and brochures',
    ],
    works: 'Identity concepts such as Forma and Terra sit in the Works collection.',
  },
} as const satisfies Record<string, ServiceCopy>;

export type ServiceKey = keyof typeof SERVICE_COPY;

export const SERVICE_PROCESS = [
  { title: 'Listen', text: 'Your goals, your audience, and what you already have.' },
  { title: 'Shape', text: 'Directions and options, refined with you until it feels right.' },
  { title: 'Build', text: 'Careful craft, with regular updates along the way.' },
  { title: 'Launch', text: 'Files, handover, and support once it goes live.' },
] as const;

export type ProductCopy = PageCopy & { status: 'available' | 'soon' };

export const PRODUCT_COPY = {
  software: {
    status: 'soon',
    title: 'Software solutions',
    accent: 'built to feel calm.',
    lead: 'Digital tools and platforms shaped with the same restraint as our identities, now in development.',
    checklist: [
      'Product overviews and walkthroughs',
      'Plans, licensing, and support',
      'Integration and onboarding notes',
    ],
  },
  templates: {
    status: 'available',
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
    status: 'soon',
    title: 'Hardware products',
    accent: 'specified with intention.',
    lead: 'Physical products selected and specified with the same attention to material and detail.',
    checklist: [
      'Specifications and finishes',
      'Availability and lead times',
      'Installation and care guidance',
    ],
  },
} as const satisfies Record<string, ProductCopy>;

export type ProductKey = keyof typeof PRODUCT_COPY;
