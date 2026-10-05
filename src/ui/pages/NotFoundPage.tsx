import { Link } from 'react-router';
import { ROUTES } from '@/router/paths';
import { StudioLogo } from '@/ui/components/StudioLogo';

export default function NotFoundPage() {
  return (
    <main id="main-content" className="not-found">
      <StudioLogo />
      <span className="eyebrow">404 — A little too minimal</span>
      <h1>
        Nothing here.
        <br />
        <em className="serif">Something good awaits.</em>
      </h1>
      <Link className="text-button" to={ROUTES.home}>
        Back to the collection ↗
      </Link>
    </main>
  );
}
