import { ROUTES } from '@/router/paths';
import { LotusMark } from '@/ui/components/LotusMark';
import { PageLink } from '@/ui/components/PageLink';

export function StudioLogo() {
  return (
    <PageLink
      className="studio-logo"
      to={ROUTES.home}
      aria-label="The Minimalist Design Studio — Home"
    >
      <LotusMark className="studio-mark" />
      <span className="studio-logo-type">
        THE MINIMALIST<span>DESIGN STUDIO</span>
      </span>
    </PageLink>
  );
}
