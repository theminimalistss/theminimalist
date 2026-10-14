import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { PAGE_MODULES } from '@/router/pageModules';
import { LEGACY_INQUIRY_PATHS, ROUTES } from '@/router/paths';
import { ErrorFallback } from '@/ui/components/ErrorBoundary';
import { PageLayout } from '@/ui/layouts/PageLayout';
import { SiteLayout } from '@/ui/layouts/SiteLayout';
import HomePage from '@/ui/pages/HomePage';

const WorksPage = lazy(PAGE_MODULES.works);
const ServicesPage = lazy(PAGE_MODULES.services);
const ServicePage = lazy(PAGE_MODULES.service);
const AboutPage = lazy(PAGE_MODULES.about);
const FoundersPage = lazy(PAGE_MODULES.founders);
const TestimonialsPage = lazy(PAGE_MODULES.testimonials);
const ProductsPage = lazy(PAGE_MODULES.products);
const ProductPage = lazy(PAGE_MODULES.product);
const ContactPage = lazy(PAGE_MODULES.contact);
const NotFoundPage = lazy(PAGE_MODULES.notFound);

const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    errorElement: <ErrorFallback />,
    children: [
      { index: true, element: <HomePage /> },
      {
        element: <PageLayout />,
        children: [
          { path: ROUTES.works, element: <WorksPage /> },
          { path: ROUTES.services, element: <ServicesPage /> },
          { path: ROUTES.softwareDevelopment, element: <ServicePage service="software" /> },
          { path: ROUTES.websiteDevelopment, element: <ServicePage service="websites" /> },
          { path: ROUTES.branding, element: <ServicePage service="branding" /> },
          { path: ROUTES.about, element: <AboutPage /> },
          { path: ROUTES.founders, element: <FoundersPage /> },
          { path: ROUTES.testimonials, element: <TestimonialsPage /> },
          { path: ROUTES.products, element: <ProductsPage /> },
          { path: ROUTES.software, element: <ProductPage product="software" /> },
          { path: ROUTES.templates, element: <ProductPage product="templates" /> },
          { path: ROUTES.hardware, element: <ProductPage product="hardware" /> },
          { path: ROUTES.contact, element: <ContactPage /> },
          ...Object.entries(LEGACY_INQUIRY_PATHS).map(([path, to]) => ({
            path,
            element: <Navigate to={to} replace />,
          })),
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
