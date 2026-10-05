import { Outlet } from 'react-router';
import { MAIN_CONTENT_ID } from '@/hooks/useRouteFocus';
import { SiteFooter } from '@/ui/components/SiteFooter';

export function PageLayout() {
  return (
    <>
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="page">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
