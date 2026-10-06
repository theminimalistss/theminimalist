import { useLocation } from 'react-router';
import { ROUTES } from '@/router/paths';
import { LotusMark } from '@/ui/components/LotusMark';
import { PageLink } from '@/ui/components/PageLink';

export function ContactFab() {
  const { pathname } = useLocation();
  if (pathname === ROUTES.contact || pathname.startsWith(`${ROUTES.inquiries}`)) return null;
  return (
    <PageLink className="contact-fab" to={ROUTES.contact} aria-label="Let’s talk with the studio">
      <span className="contact-fab-ring" aria-hidden="true" />
      <LotusMark className="contact-fab-mark" />
      <span className="contact-fab-label" aria-hidden="true">
        Let’s talk
      </span>
    </PageLink>
  );
}
