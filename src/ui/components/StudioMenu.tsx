import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { HOVER_POINTER_QUERY, MENU_PREVIEWS } from '@/constants/menu';
import { useDialog } from '@/hooks/useDialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useMenuMorph } from '@/hooks/useMenuMorph';
import { usePointerCue } from '@/hooks/usePointerCue';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { focusMainContent } from '@/hooks/useRouteFocus';
import { isNavGroupActive, PRIMARY_NAVIGATION } from '@/router/navigation';
import { ROUTES } from '@/router/paths';
import { Icon } from '@/ui/components/Icon';
import { formatIndex } from '@/utils/format';

type Props = { open: boolean; onClose: () => void };

const MENU_ITEMS = [
  { label: 'Home', to: ROUTES.home, description: 'The collection in motion.', children: [] },
  ...PRIMARY_NAVIGATION,
];

export function StudioMenu({ open, onClose }: Props) {
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery(HOVER_POINTER_QUERY);
  const { pathname } = useLocation();
  const { phase, rendered, canvasRef, originRef, settle } = useMenuMorph(open, reducedMotion);
  const ref = useDialog(rendered);
  const navigated = useRef(false);
  const { areaRef, cueRef, cue } = usePointerCue<HTMLElement>(
    finePointer && rendered,
    !reducedMotion,
  );

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
        <nav ref={areaRef} className="menu-site-nav" aria-label="Site">
          <ol className="menu-nav">
            {MENU_ITEMS.map((item, index) => {
              const preview = MENU_PREVIEWS[item.to];
              const current =
                item.to === ROUTES.home
                  ? pathname === ROUTES.home
                  : isNavGroupActive(item, pathname);
              return (
                <li key={item.to} className="menu-row">
                  <span className="menu-index" aria-hidden="true">
                    {formatIndex(index)}
                  </span>
                  <span className="menu-preview" aria-hidden="true">
                    {preview && (
                      <picture>
                        <source type="image/avif" srcSet={preview.avif} />
                        <img
                          src={preview.webp}
                          alt=""
                          width="480"
                          height="600"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    )}
                  </span>
                  <Link
                    className="menu-link"
                    to={item.to}
                    onClick={navigate}
                    aria-current={current ? 'page' : undefined}
                    data-cue={preview?.cue}
                  >
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
          <span
            ref={cueRef}
            className="menu-cue"
            data-visible={cue.visible ? '' : undefined}
            aria-hidden="true"
          >
            <span className="menu-cue-tag">
              {cue.label}
              <Icon name="arrow" />
            </span>
          </span>
        </nav>
      </div>
      <div className="menu-bottom">
        <p>
          We’re The Minimalist, a design studio.
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
