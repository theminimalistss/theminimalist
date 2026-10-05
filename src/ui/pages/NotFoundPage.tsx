import { Link } from 'react-router';
import { ROUTES } from '@/router/paths';
import { PageIntro } from '@/ui/sections/Page/PageIntro';

export default function NotFoundPage() {
  return (
    <PageIntro
      eyebrow="404 — A little too minimal"
      title="Nothing here."
      accent="Something good awaits."
      lead="The page you’re looking for has moved or doesn’t exist yet."
    >
      <Link className="text-button" to={ROUTES.home}>
        Back to the collection ↗
      </Link>
      <Link className="text-button" to={ROUTES.contact}>
        Contact the studio ↗
      </Link>
    </PageIntro>
  );
}
