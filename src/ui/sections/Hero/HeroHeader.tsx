import { Icon } from '@/ui/components/Icon';
import { StudioLogo } from '@/ui/components/StudioLogo';

export function HeroHeader({ onMenu, menuOpen }: { onMenu: () => void; menuOpen: boolean }) {
  return (
    <header className="hero-header">
      <StudioLogo />
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
