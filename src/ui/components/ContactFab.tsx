import { useLocation } from 'react-router';
import { useContactContrast } from '@/hooks/useContactContrast';
import { ROUTES } from '@/router/paths';
import { LotusMark } from '@/ui/components/LotusMark';
import { PageLink } from '@/ui/components/PageLink';

export function ContactFab() {
  const { pathname } = useLocation();
  const { ref, surface } = useContactContrast(pathname, pathname !== ROUTES.contact);
  if (pathname === ROUTES.contact) return null;
  return (
    <PageLink
      ref={ref}
      data-surface={surface}
      className="contact-fab"
      to={ROUTES.contact}
      aria-label="Let’s talk with the studio"
    >
      <span className="contact-fab-ring" aria-hidden="true" />
      <LotusMark className="contact-fab-mark" />
      <span className="contact-fab-label" aria-hidden="true">
        Let’s talk
      </span>
    </PageLink>
  );
}
