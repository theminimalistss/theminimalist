import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { PAGE_MODULES } from '@/router/pageModules';
import { ROUTES } from '@/router/paths';
import { ErrorFallback } from '@/ui/components/ErrorBoundary';
import { PageLayout } from '@/ui/layouts/PageLayout';
import { SiteLayout } from '@/ui/layouts/SiteLayout';
import HomePage from '@/ui/pages/HomePage';

const WorksPage = lazy(PAGE_MODULES.works);
const AboutPage = lazy(PAGE_MODULES.about);
const FoundersPage = lazy(PAGE_MODULES.founders);
const TestimonialsPage = lazy(PAGE_MODULES.testimonials);
const ProductsPage = lazy(PAGE_MODULES.products);
const ProductPage = lazy(PAGE_MODULES.product);
const ContactPage = lazy(PAGE_MODULES.contact);
const InquiryPage = lazy(PAGE_MODULES.inquiry);
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
          { path: ROUTES.about, element: <AboutPage /> },
          { path: ROUTES.founders, element: <FoundersPage /> },
          { path: ROUTES.testimonials, element: <TestimonialsPage /> },
          { path: ROUTES.products, element: <ProductsPage /> },
          { path: ROUTES.software, element: <ProductPage product="software" /> },
          { path: ROUTES.templates, element: <ProductPage product="templates" /> },
          { path: ROUTES.hardware, element: <ProductPage product="hardware" /> },
          { path: ROUTES.contact, element: <ContactPage /> },
          { path: ROUTES.inquiries, element: <InquiryPage inquiry="general" /> },
          { path: ROUTES.quote, element: <InquiryPage inquiry="quote" /> },
          { path: ROUTES.appointment, element: <InquiryPage inquiry="appointment" /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
