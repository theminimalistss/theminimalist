import { useState } from 'react';
import { COMPACT_QUERY } from '@/constants/motion';
import { useCollectionMorph } from '@/hooks/useCollectionMorph';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useHeroWorks } from '@/hooks/useHeroWorks';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MAIN_CONTENT_ID } from '@/hooks/useRouteFocus';
import { useSiteMenu } from '@/hooks/useSiteMenu';
import type { Work } from '@/types/work';
import { CollectionStatus } from '@/ui/components/CollectionStatus';
import { WorkDialog } from '@/ui/components/WorkDialog';
import { HeroFooter } from '@/ui/sections/Hero/HeroFooter';
import { HeroStatement } from '@/ui/sections/Hero/HeroStatement';
import { ViewControls, type CollectionView } from '@/ui/sections/Hero/ViewControls';
import { WorkCollection } from '@/ui/sections/Hero/WorkCollection';

export function Hero() {
  const state = useHeroWorks();
  const reducedMotion = useReducedMotion();
  const compact = useMediaQuery(COMPACT_QUERY);
  const pageVisible = usePageVisibility();
  const { open: menuOpen } = useSiteMenu();
  const [preferredView, setView] = useState<CollectionView>('spiral');
  const [paused, setPaused] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const view = reducedMotion ? 'gallery' : preferredView;
  const works = state.status === 'ready' ? state.works : [];
  const mediaPlaying = !paused && !reducedMotion && !menuOpen && !selectedWork && pageVisible;
  const { rootRef, morphing, capture } = useCollectionMorph(view);
  useDocumentTitle();

  function changeView(nextView: CollectionView) {
    if (nextView !== view) capture();
    setView(nextView);
    setInspecting(false);
  }

  return (
    <div ref={rootRef} className={`hero hero--${view}`} data-morphing={morphing ? '' : undefined}>
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        aria-labelledby="collection-title"
        className="hero-main"
      >
        <ViewControls
          view={view}
          onChange={changeView}
          reducedMotion={reducedMotion}
          count={works.length}
        />
        <CollectionStatus state={state} className="collection-status" />
        {works.length > 0 && (
          <WorkCollection
            works={works}
            view={view}
            playing={mediaPlaying}
            paused={!mediaPlaying || inspecting || morphing}
            compact={compact}
            onSelect={setSelectedWork}
            onInspect={setInspecting}
          />
        )}
        <HeroStatement />
        {view === 'spiral' && (
          <span className="hero-side-note" aria-hidden="true">
            BRAND · DIGITAL · EXPERIENCE
          </span>
        )}
      </main>
      <HeroFooter
        paused={paused}
        onToggle={() => setPaused((value) => !value)}
        reducedMotion={reducedMotion}
        gallery={view === 'gallery'}
        onBrowse={() => changeView('gallery')}
      />
      <WorkDialog work={selectedWork} onClose={() => setSelectedWork(null)} />
    </div>
  );
}
