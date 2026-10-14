import type { ComponentType } from 'react';
import type { ProductKey, ServiceKey } from '@/constants/pages';
import { createBrowserRouter, Navigate } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { PAGE_MODULES } from '@/router/pageModules';
import { LEGACY_INQUIRY_PATHS, ROUTES } from '@/router/paths';
import { ErrorFallback } from '@/ui/components/ErrorBoundary';
import { PageLayout } from '@/ui/layouts/PageLayout';
import { SiteLayout } from '@/ui/layouts/SiteLayout';
import HomePage from '@/ui/pages/HomePage';

function lazyPage(load: () => Promise<{ default: ComponentType }>) {
  return async () => ({ Component: (await load()).default });
}

function lazyService(service: ServiceKey) {
  return async () => {
    const { default: Page } = await PAGE_MODULES.service();
    return { Component: () => <Page service={service} /> };
  };
}

function lazyProduct(product: ProductKey) {
  return async () => {
    const { default: Page } = await PAGE_MODULES.product();
    return { Component: () => <Page product={product} /> };
  };
}

const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    hydrateFallbackElement: <></>,
    errorElement: <ErrorFallback />,
    children: [
      { index: true, element: <HomePage /> },
      {
        element: <PageLayout />,
        children: [
          { path: ROUTES.works, lazy: lazyPage(PAGE_MODULES.works) },
          { path: ROUTES.services, lazy: lazyPage(PAGE_MODULES.services) },
          { path: ROUTES.softwareDevelopment, lazy: lazyService('software') },
          { path: ROUTES.websiteDevelopment, lazy: lazyService('websites') },
          { path: ROUTES.branding, lazy: lazyService('branding') },
          { path: ROUTES.about, lazy: lazyPage(PAGE_MODULES.about) },
          { path: ROUTES.founders, lazy: lazyPage(PAGE_MODULES.founders) },
          { path: ROUTES.testimonials, lazy: lazyPage(PAGE_MODULES.testimonials) },
          { path: ROUTES.products, lazy: lazyPage(PAGE_MODULES.products) },
          { path: ROUTES.software, lazy: lazyProduct('software') },
          { path: ROUTES.templates, lazy: lazyProduct('templates') },
          { path: ROUTES.hardware, lazy: lazyProduct('hardware') },
          { path: ROUTES.contact, lazy: lazyPage(PAGE_MODULES.contact) },
          ...Object.entries(LEGACY_INQUIRY_PATHS).map(([path, to]) => ({
            path,
            element: <Navigate to={to} replace />,
          })),
          { path: '*', lazy: lazyPage(PAGE_MODULES.notFound) },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
