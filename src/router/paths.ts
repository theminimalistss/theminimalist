export const ROUTES = {
  home: '/',
  works: '/works',
  services: '/services',
  softwareDevelopment: '/services/software',
  websiteDevelopment: '/services/websites',
  branding: '/services/branding',
  about: '/about',
  founders: '/founders',
  testimonials: '/testimonials',
  products: '/products',
  software: '/products/software',
  templates: '/products/templates',
  hardware: '/products/hardware',
  contact: '/contact',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
export const SERVICE_ROUTES = {
  software: ROUTES.softwareDevelopment,
  websites: ROUTES.websiteDevelopment,
  branding: ROUTES.branding,
} as const;
export const PRODUCT_ROUTES = {
  software: ROUTES.software,
  templates: ROUTES.templates,
  hardware: ROUTES.hardware,
} as const;
export type LinkTarget = RoutePath | `${RoutePath}?${string}`;

export const CONTACT_LINKS = {
  general: `${ROUTES.contact}?inquiry=general`,
  quote: `${ROUTES.contact}?inquiry=quote`,
  appointment: `${ROUTES.contact}?inquiry=appointment`,
} as const satisfies Record<string, LinkTarget>;

export const LEGACY_INQUIRY_PATHS = {
  '/inquiries': CONTACT_LINKS.general,
  '/inquiries/quote': CONTACT_LINKS.quote,
  '/inquiries/appointment': CONTACT_LINKS.appointment,
} as const;
