import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { useDialog } from '@/hooks/useDialog';
import { useMenuMorph } from '@/hooks/useMenuMorph';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { focusMainContent } from '@/hooks/useRouteFocus';
import { isNavGroupActive, PRIMARY_NAVIGATION } from '@/router/navigation';
import { ROUTES } from '@/router/paths';
import { Icon } from '@/ui/components/Icon';

type Props = { open: boolean; onClose: () => void };

const MENU_ITEMS = [
  { label: 'Home', to: ROUTES.home, description: 'The collection in motion.', children: [] },
  ...PRIMARY_NAVIGATION,
];

export function StudioMenu({ open, onClose }: Props) {
  const reducedMotion = useReducedMotion();
  const { pathname } = useLocation();
  const { phase, rendered, canvasRef, originRef, settle } = useMenuMorph(open, reducedMotion);
  const ref = useDialog(rendered);
  const navigated = useRef(false);

  useEffect(() => {
    if (rendered || !navigated.current) return;
    navigated.current = false;
    focusMainContent();
  }, [rendered]);

  const navigate = () => {
    navigated.current = true;
    onClose();
  };

  return (
    <dialog
      ref={ref}
      id="studio-menu"
      className="studio-menu"
      data-phase={phase}
      aria-labelledby="menu-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        settle();
        onClose();
      }}
    >
      <canvas ref={canvasRef} className="menu-morph" aria-hidden="true" />
      <div className="menu-top">
        <span className="eyebrow">THE MINIMALIST</span>
        <button ref={originRef} className="menu-trigger" onClick={onClose}>
          Close <Icon name="close" />
        </button>
      </div>
      <div className="menu-body">
        <div>
          <span className="eyebrow">A considered collection</span>
          <h2 id="menu-title">
            Good design.
            <br />
            <em className="serif">A little feeling.</em>
          </h2>
        </div>
        <nav aria-label="Site">
          <ol className="menu-nav">
            {MENU_ITEMS.map((item, index) => {
              const current =
                item.to === ROUTES.home
                  ? pathname === ROUTES.home
                  : isNavGroupActive(item, pathname);
              return (
                <li key={item.to}>
                  <Link
                    className="menu-link"
                    to={item.to}
                    onClick={navigate}
                    aria-current={current ? 'page' : undefined}
                  >
                    <span className="menu-index">{String(index + 1).padStart(2, '0')}</span>
                    {item.label}
                    <Icon name="arrow" />
                  </Link>
                  {item.children.length > 0 && (
                    <ul className="menu-sublinks" aria-label={`${item.label} pages`}>
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            to={child.to}
                            onClick={navigate}
                            aria-current={pathname === child.to ? 'page' : undefined}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
      <div className="menu-bottom">
        <p>
          We’re an independent design studio.
          <br />
          Shaping identities and digital experiences
          <br />
          with clarity, character, and care.
        </p>
        <p>
          Brand. Digital. Experience.
          <br />
          <span className="serif">Less, but with feeling.</span>
        </p>
        <span className="eyebrow">EST. 2020</span>
      </div>
    </dialog>
  );
}
