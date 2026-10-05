import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ROUTES } from '@/router/paths';
import { PageLayout } from '@/ui/layouts/PageLayout';
import { SiteLayout } from '@/ui/layouts/SiteLayout';
import HomePage from '@/ui/pages/HomePage';

const WorksPage = lazy(() => import('@/ui/pages/WorksPage'));
const AboutPage = lazy(() => import('@/ui/pages/AboutPage'));
const FoundersPage = lazy(() => import('@/ui/pages/FoundersPage'));
const TestimonialsPage = lazy(() => import('@/ui/pages/TestimonialsPage'));
const ProductsPage = lazy(() => import('@/ui/pages/ProductsPage'));
const ProductPage = lazy(() => import('@/ui/pages/ProductPage'));
const ContactPage = lazy(() => import('@/ui/pages/ContactPage'));
const InquiryPage = lazy(() => import('@/ui/pages/InquiryPage'));
const NotFoundPage = lazy(() => import('@/ui/pages/NotFoundPage'));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route element={<PageLayout />}>
            <Route path={ROUTES.works} element={<WorksPage />} />
            <Route path={ROUTES.about} element={<AboutPage />} />
            <Route path={ROUTES.founders} element={<FoundersPage />} />
            <Route path={ROUTES.testimonials} element={<TestimonialsPage />} />
            <Route path={ROUTES.products} element={<ProductsPage />} />
            <Route path={ROUTES.software} element={<ProductPage product="software" />} />
            <Route path={ROUTES.templates} element={<ProductPage product="templates" />} />
            <Route path={ROUTES.hardware} element={<ProductPage product="hardware" />} />
            <Route path={ROUTES.contact} element={<ContactPage />} />
            <Route path={ROUTES.inquiries} element={<InquiryPage inquiry="general" />} />
            <Route path={ROUTES.quote} element={<InquiryPage inquiry="quote" />} />
            <Route path={ROUTES.appointment} element={<InquiryPage inquiry="appointment" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
