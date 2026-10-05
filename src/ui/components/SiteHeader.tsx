import { Link, useLocation } from 'react-router';
import { isNavGroupActive, PRIMARY_NAVIGATION } from '@/router/navigation';
import { Icon } from '@/ui/components/Icon';
import { StudioLogo } from '@/ui/components/StudioLogo';

type Props = { menuOpen: boolean; scrolled: boolean; onMenu: () => void };

export function SiteHeader({ menuOpen, scrolled, onMenu }: Props) {
  const { pathname } = useLocation();
  return (
    <header className="site-header" data-scrolled={scrolled ? '' : undefined}>
      <StudioLogo />
      <nav className="site-nav" aria-label="Primary">
        {PRIMARY_NAVIGATION.map((group) => (
          <Link
            key={group.to}
            to={group.to}
            className="site-nav-link"
            aria-current={isNavGroupActive(group, pathname) ? 'page' : undefined}
          >
            {group.label}
          </Link>
        ))}
      </nav>
      <button
        className="menu-trigger"
        onClick={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          onMenu();
        }}
        aria-expanded={menuOpen}
        aria-controls="studio-menu"
      >
        Menu <Icon name="menu" />
      </button>
    </header>
  );
}
