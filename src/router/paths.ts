export const ROUTES = {
  home: '/',
  works: '/works',
  about: '/about',
  founders: '/founders',
  testimonials: '/testimonials',
  products: '/products',
  software: '/products/software',
  templates: '/products/templates',
  hardware: '/products/hardware',
  contact: '/contact',
  inquiries: '/inquiries',
  quote: '/inquiries/quote',
  appointment: '/inquiries/appointment',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
