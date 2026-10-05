import { Link } from 'react-router';
import { ROUTES } from '@/router/paths';
import { LotusMark } from '@/ui/components/LotusMark';

export function StudioLogo() {
  return (
    <Link
      className="studio-logo"
      to={ROUTES.home}
      aria-label="The Minimalist Independent Design Studio — Home"
    >
      <LotusMark className="studio-mark" />
      <span className="studio-logo-type">
        THE MINIMALIST<span>INDEPENDENT DESIGN STUDIO</span>
      </span>
    </Link>
  );
}
