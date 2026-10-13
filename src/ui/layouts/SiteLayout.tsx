import { Suspense, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useInteractionSounds } from '@/hooks/useInteractionSounds';
import { usePrefetchPages } from '@/hooks/usePrefetchPages';
import { useRouteFocus } from '@/hooks/useRouteFocus';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useScrolledPast } from '@/hooks/useScrolledPast';
import { SiteMenuContext } from '@/hooks/useSiteMenu';
import { ContactFab } from '@/ui/components/ContactFab';
import { SiteHeader } from '@/ui/components/SiteHeader';
import { StudioMenu } from '@/ui/components/StudioMenu';

export function SiteLayout() {
  const { pathname } = useLocation();
  const { sentinelRef, scrolled } = useScrolledPast();
  const [menuOpen, setMenuOpen] = useState(false);
  const menu = useMemo(
    () => ({ open: menuOpen, show: () => setMenuOpen(true), close: () => setMenuOpen(false) }),
    [menuOpen],
  );
  useRouteFocus(pathname);
  useDocumentMeta(pathname);
  useInteractionSounds(pathname, menuOpen);
  useScrollReveal();
  usePrefetchPages();

  return (
    <SiteMenuContext.Provider value={menu}>
      <span ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />
      <SiteHeader menuOpen={menuOpen} scrolled={scrolled} onMenu={menu.show} />
      <Suspense
        fallback={
          <main className="page-status" role="status">
            One moment…
          </main>
        }
      >
        <div key={pathname} className="route-view">
          <Outlet />
        </div>
      </Suspense>
      <ContactFab />
      <StudioMenu open={menuOpen} onClose={menu.close} />
    </SiteMenuContext.Provider>
  );
}
