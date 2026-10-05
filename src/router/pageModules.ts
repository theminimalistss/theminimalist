export const PAGE_MODULES = {
  works: () => import('@/ui/pages/WorksPage'),
  about: () => import('@/ui/pages/AboutPage'),
  founders: () => import('@/ui/pages/FoundersPage'),
  testimonials: () => import('@/ui/pages/TestimonialsPage'),
  products: () => import('@/ui/pages/ProductsPage'),
  product: () => import('@/ui/pages/ProductPage'),
  contact: () => import('@/ui/pages/ContactPage'),
  inquiry: () => import('@/ui/pages/InquiryPage'),
  notFound: () => import('@/ui/pages/NotFoundPage'),
} as const;

export function prefetchPages() {
  for (const load of Object.values(PAGE_MODULES)) void load();
}
