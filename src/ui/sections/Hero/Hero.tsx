import { useState } from 'react';
import { COMPACT_QUERY } from '@/constants/motion';
import { useCollectionMorph } from '@/hooks/useCollectionMorph';
import { useHeroWorks } from '@/hooks/useHeroWorks';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Work } from '@/types/work';
import { StudioMenu } from '@/ui/components/StudioMenu';
import { WorkDialog } from '@/ui/components/WorkDialog';
import { HeroHeader } from '@/ui/sections/Hero/HeroHeader';
import { HeroStatement } from '@/ui/sections/Hero/HeroStatement';
import { HeroFooter } from '@/ui/sections/Hero/HeroFooter';
import { ViewControls, type CollectionView } from '@/ui/sections/Hero/ViewControls';
import { WorkGallery } from '@/ui/sections/Hero/WorkGallery';
import { WorkSpiral } from '@/ui/sections/Hero/WorkSpiral';

export function Hero() {
  const state = useHeroWorks();
  const reducedMotion = useReducedMotion();
  const compact = useMediaQuery(COMPACT_QUERY);
  const pageVisible = usePageVisibility();
  const [preferredView, setView] = useState<CollectionView>('spiral');
  const [paused, setPaused] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const view = reducedMotion ? 'gallery' : preferredView;
  const works = state.status === 'ready' ? state.works : [];
  const mediaPlaying = !paused && !reducedMotion && !menuOpen && !selectedWork && pageVisible;
  const { rootRef, morphing, capture } = useCollectionMorph(view);

  function changeView(nextView: CollectionView) {
    if (nextView !== view) capture();
    setView(nextView);
    setInspecting(false);
    setMenuOpen(false);
  }

  return (
    <div ref={rootRef} className={`hero hero--${view}`} data-morphing={morphing ? '' : undefined}>
      <HeroHeader onMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
      <main
        id="main-content"
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
        {state.status === 'loading' && (
          <div className="collection-status" role="status">
            <span className="loading-line" />
            Gathering a little inspiration…
          </div>
        )}
        {state.status === 'error' && (
          <div className="collection-status" role="alert">
            <p>{state.message}</p>
            <button className="text-button" onClick={state.retry}>
              Try again ↗
            </button>
          </div>
        )}
        {state.status === 'ready' && works.length === 0 && (
          <div className="collection-status">
            <p>A new collection is taking shape.</p>
            <span>Come back soon for a little inspiration.</span>
          </div>
        )}
        {works.length > 0 &&
          (view === 'spiral' ? (
            <WorkSpiral
              works={works}
              paused={!mediaPlaying || inspecting || morphing}
              mediaPlaying={mediaPlaying}
              compact={compact}
              onSelect={setSelectedWork}
              onInspect={setInspecting}
            />
          ) : (
            <WorkGallery works={works} playing={mediaPlaying} onSelect={setSelectedWork} />
          ))}
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
      <StudioMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onView={changeView}
        reducedMotion={reducedMotion}
      />
      <WorkDialog work={selectedWork} onClose={() => setSelectedWork(null)} />
    </div>
  );
}
