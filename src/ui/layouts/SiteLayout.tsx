import { Suspense, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useRouteFocus } from '@/hooks/useRouteFocus';
import { useScrolledPast } from '@/hooks/useScrolledPast';
import { SiteMenuContext } from '@/hooks/useSiteMenu';
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
        <Outlet />
      </Suspense>
      <StudioMenu open={menuOpen} onClose={menu.close} />
    </SiteMenuContext.Provider>
  );
}
