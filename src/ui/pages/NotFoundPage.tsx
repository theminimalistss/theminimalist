import { ROUTES } from '@/router/paths';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageLink } from '@/ui/components/PageLink';

export default function NotFoundPage() {
  return (
    <PageIntro
      eyebrow="404 — A little too minimal"
      title="Nothing here."
      accent="Something good awaits."
      lead="The page you’re looking for has moved or doesn’t exist yet."
    >
      <PageLink className="text-button" to={ROUTES.home}>
        Back to the collection ↗
      </PageLink>
      <PageLink className="text-button" to={ROUTES.contact}>
        Contact the studio ↗
      </PageLink>
    </PageIntro>
  );
}
