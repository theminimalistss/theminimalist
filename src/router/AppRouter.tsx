import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ROUTES } from '@/router/paths';
import HomePage from '@/ui/pages/HomePage';

const NotFoundPage = lazy(() => import('@/ui/pages/NotFoundPage'));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <main className="collection-status" role="status">
            One moment…
          </main>
        }
      >
        <Routes>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
