import { useHeroWorks } from '@/hooks/useHeroWorks';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSoundScene } from '@/hooks/useSound';
import { useWorkPreview } from '@/hooks/useWorkPreview';
import { useSiteMenu } from '@/hooks/useSiteMenu';
import { useWorksView } from '@/hooks/useWorksView';
import { ROUTES } from '@/router/paths';
import { CollectionStatus } from '@/ui/components/CollectionStatus';
import { WorkDialog } from '@/ui/components/WorkDialog';
import { WorkCollection } from '@/ui/sections/Hero/WorkCollection';
import { PageLink } from '@/ui/components/PageLink';
import { WorkExplorer } from '@/ui/sections/Works/WorkExplorer';
import '@/ui/styles/works-explorer.css';

export default function WorksPage() {
  const state = useHeroWorks();
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisibility();
  const preview = useWorkPreview();
  const menu = useSiteMenu();
  const { view, change } = useWorksView(reducedMotion);
  const gallery = view === 'gallery';
  useSoundScene('works');
  const works = state.status === 'ready' ? state.works : [];
  const suspended = !pageVisible || menu.open || !!preview.work || preview.transitioning;

  return (
    <div className={`collection-page works-page works-page--${gallery ? 'gallery' : 'spatial'}`}>
      <header className="works-intro">
        <div>
          <span className="eyebrow">Works / A collection of possibilities</span>
          <h1>
            Selected works.
            <em className="serif"> A different perspective.</em>
          </h1>
        </div>
        <div className="works-intro-note">
          <p>
            A meeting of brand, digital, and experience. <br />
            Different perspectives. One considered whole.
          </p>
          <PageLink className="text-button" to={ROUTES.quote}>
            Start a project <span aria-hidden="true">↗</span>
          </PageLink>
        </div>
      </header>
      <div className="works-toolbar">
        <p>
          Independent concept studies <span>({String(works.length).padStart(2, '0')})</span>
        </p>
        <div role="group" aria-label="Works presentation">
          <button aria-pressed={!gallery} onClick={() => change('spatial')}>
            Spatial
          </button>
          <button aria-pressed={gallery} onClick={() => change('gallery')}>
            Gallery
          </button>
        </div>
      </div>
      <CollectionStatus state={state} className="page-section" />
      {works.length > 0 &&
        (gallery ? (
          <WorkCollection
            works={works}
            view="gallery"
            reveal
            playing={!reducedMotion && !suspended}
            onSelect={preview.open}
          />
        ) : (
          <WorkExplorer
            works={works}
            suspended={suspended}
            reducedMotion={reducedMotion}
            onOpen={preview.open}
          />
        ))}
      {gallery && (
        <p className="works-provenance">
          An evolving collection of independent explorations, presented with licensed imagery.
          Commissioned work joins the collection as it is approved for publication.
        </p>
      )}
      <WorkDialog work={preview.work} onClose={preview.close} />
    </div>
  );
}
