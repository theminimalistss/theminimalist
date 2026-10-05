import { useState } from 'react';
import { useHeroWorks } from '@/hooks/useHeroWorks';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ROUTES } from '@/router/paths';
import type { Work } from '@/types/work';
import { CollectionStatus } from '@/ui/components/CollectionStatus';
import { WorkDialog } from '@/ui/components/WorkDialog';
import { WorkCollection } from '@/ui/sections/Hero/WorkCollection';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageLink } from '@/ui/components/PageLink';

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
        documentTitle="Works"
        title="Selected works."
        accent="Brand, digital, experience."
        lead="Independent concept studies exploring identity, digital experience, and motion. Commissioned work joins the collection as it is approved for publication."
      >
        <PageLink className="text-button" to={ROUTES.home}>
          See the collection in motion <span aria-hidden="true">↗</span>
        </PageLink>
        <PageLink className="text-button" to={ROUTES.quote}>
          Start a project <span aria-hidden="true">↗</span>
        </PageLink>
      </PageIntro>
      <CollectionStatus state={state} className="page-section" />
      {works.length > 0 && (
        <WorkCollection
          works={works}
          view="gallery"
          reveal
          playing={!reducedMotion && !selectedWork && pageVisible}
          onSelect={setSelectedWork}
        />
      )}
      <WorkDialog work={selectedWork} onClose={() => setSelectedWork(null)} />
    </div>
  );
}
