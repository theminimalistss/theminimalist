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
      <span className="eyebrow collection-kicker">A collection of possibilities</span>
      <h1 id="collection-title">
        Selected
        <br />
        <em className="serif">works.</em>
        <sup>({String(count).padStart(2, '0')})</sup>
      </h1>
      <div className="view-controls" role="group" aria-label="Collection view">
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
      <span className="collection-note">Independent concept studies</span>
    </div>
  );
}
