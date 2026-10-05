import { useState } from 'react';
import { Link } from 'react-router';
import { useHeroWorks } from '@/hooks/useHeroWorks';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ROUTES } from '@/router/paths';
import type { Work } from '@/types/work';
import { WorkDialog } from '@/ui/components/WorkDialog';
import { WorkCollection } from '@/ui/sections/Hero/WorkCollection';
import { PageIntro } from '@/ui/sections/Page/PageIntro';

export default function WorksPage() {
  const state = useHeroWorks();
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisibility();
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const works = state.status === 'ready' ? state.works : [];

  return (
    <div className="collection-page">
      <PageIntro
        eyebrow="Works"
        title="Selected works."
        accent="Brand, digital, experience."
        lead="Independent concept studies exploring identity, digital experience, and motion. Commissioned work joins the collection as it is approved for publication."
      >
        <Link className="text-button" to={ROUTES.home}>
          See the collection in motion <span aria-hidden="true">↗</span>
        </Link>
        <Link className="text-button" to={ROUTES.quote}>
          Start a project <span aria-hidden="true">↗</span>
        </Link>
      </PageIntro>
      {state.status === 'loading' && (
        <p className="page-section" role="status">
          Gathering a little inspiration…
        </p>
      )}
      {state.status === 'error' && (
        <div className="page-section" role="alert">
          <p>{state.message}</p>
          <button className="text-button" onClick={state.retry}>
            Try again ↗
          </button>
        </div>
      )}
      {works.length > 0 && (
        <WorkCollection
          works={works}
          view="gallery"
          playing={!reducedMotion && !selectedWork && pageVisible}
          onSelect={setSelectedWork}
        />
      )}
      <WorkDialog work={selectedWork} onClose={() => setSelectedWork(null)} />
    </div>
  );
}
