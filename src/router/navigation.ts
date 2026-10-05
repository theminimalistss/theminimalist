import { ROUTES, type RoutePath } from '@/router/paths';

export type NavItem = { label: string; to: RoutePath; description: string };
export type NavGroup = NavItem & { children: readonly NavItem[] };

export const STUDIO_PAGES: readonly NavItem[] = [
  { label: 'About', to: ROUTES.about, description: 'Who we are and how we work.' },
  { label: 'Founders', to: ROUTES.founders, description: 'The people behind the studio.' },
  {
    label: 'Testimonials',
    to: ROUTES.testimonials,
    description: 'Words from the people we work with.',
  },
];

export const PRODUCT_PAGES: readonly NavItem[] = [
  {
    label: 'Software solutions',
    to: ROUTES.software,
    description: 'Tools and platforms built with care.',
  },
  {
    label: 'Website templates',
    to: ROUTES.templates,
    description: 'Considered starting points for the web.',
  },
  {
    label: 'Hardware products',
    to: ROUTES.hardware,
    description: 'Physical products, thoughtfully specified.',
  },
];

export const INQUIRY_PAGES: readonly NavItem[] = [
  {
    label: 'General inquiry',
    to: ROUTES.inquiries,
    description: 'Questions, ideas, and introductions.',
  },
  {
    label: 'Request a quote',
    to: ROUTES.quote,
    description: 'Scope and pricing for a project or product.',
  },
  {
    label: 'Book an appointment',
    to: ROUTES.appointment,
    description: 'A conversation with the studio.',
  },
];

export const PRIMARY_NAVIGATION: readonly NavGroup[] = [
  {
    label: 'Works',
    to: ROUTES.works,
    description: 'Selected studies across brand, digital, and experience.',
    children: [],
  },
  { label: 'Studio', to: ROUTES.about, description: 'About the studio.', children: STUDIO_PAGES },
  { label: 'Products', to: ROUTES.products, description: 'What we make.', children: PRODUCT_PAGES },
  {
    label: 'Contact',
    to: ROUTES.contact,
    description: 'Start a conversation.',
    children: [
      { label: 'Contact', to: ROUTES.contact, description: 'How to reach the studio.' },
      ...INQUIRY_PAGES,
    ],
  },
];

export function isNavGroupActive(group: NavGroup, pathname: string) {
  return [group, ...group.children].some(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
  );
}
