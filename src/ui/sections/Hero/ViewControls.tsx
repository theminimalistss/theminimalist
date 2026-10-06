import { Icon } from '@/ui/components/Icon';

export type CollectionView = 'spiral' | 'gallery';

type Props = {
  view: CollectionView;
  onChange: (view: CollectionView) => void;
  reducedMotion: boolean;
  count: number;
};

export function ViewControls({ view, onChange, reducedMotion, count }: Props) {
  return (
    <div className="collection-heading">
      <span className="eyebrow collection-kicker" data-morph-chrome="kicker">
        A collection of possibilities
      </span>
      <h1 id="collection-title">
        <span className="morph-word" data-morph-chrome="title-lead">
          Selected
        </span>
        <br />
        <em className="serif morph-word" data-morph-chrome="title-accent">
          works.
        </em>
        <sup data-morph-chrome="title-count">({String(count).padStart(2, '0')})</sup>
      </h1>
      <div
        className="view-controls"
        role="group"
        aria-label="Collection view"
        data-morph-chrome="view-controls"
      >
        {!reducedMotion && (
          <button
            className="view-button"
            aria-pressed={view === 'spiral'}
            onClick={() => onChange('spiral')}
          >
            <Icon name="spiral" />
            Spiral
          </button>
        )}
        <button
          className="view-button"
          aria-pressed={view === 'gallery'}
          onClick={() => onChange('gallery')}
        >
          <Icon name="grid" />
          Gallery
        </button>
      </div>
      <span className="collection-note" data-morph-chrome="note">
        Independent concept studies
      </span>
    </div>
  );
}
