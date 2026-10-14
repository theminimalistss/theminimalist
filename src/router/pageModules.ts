export const PAGE_MODULES = {
  works: () => import('@/ui/pages/WorksPage'),
  services: () => import('@/ui/pages/ServicesPage'),
  service: () => import('@/ui/pages/ServicePage'),
  about: () => import('@/ui/pages/AboutPage'),
  founders: () => import('@/ui/pages/FoundersPage'),
  testimonials: () => import('@/ui/pages/TestimonialsPage'),
  products: () => import('@/ui/pages/ProductsPage'),
  product: () => import('@/ui/pages/ProductPage'),
  contact: () => import('@/ui/pages/ContactPage'),
  notFound: () => import('@/ui/pages/NotFoundPage'),
} as const;

export async function prefetchPages(shouldContinue: () => boolean = () => true) {
  for (const load of Object.values(PAGE_MODULES)) {
    if (!shouldContinue()) return;
    try {
      await load();
    } catch {
      return;
    }
  }
}
