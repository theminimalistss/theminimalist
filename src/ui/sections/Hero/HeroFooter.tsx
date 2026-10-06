import { Icon } from '@/ui/components/Icon';

type Props = {
  paused: boolean;
  onToggle: () => void;
  reducedMotion: boolean;
  gallery: boolean;
  onBrowse: () => void;
};

export function HeroFooter({ paused, onToggle, reducedMotion, gallery, onBrowse }: Props) {
  return (
    <footer className="hero-footer">
      <span className="footer-signature" data-morph-chrome="signature">
        EST. 2020 <span aria-hidden="true">—</span> DESIGN WITH INTENTION
      </span>
      {!gallery && (
        <button className="browse-button" onClick={onBrowse} data-morph-chrome="browse">
          Explore the collection <span aria-hidden="true">↗</span>
        </button>
      )}
      {reducedMotion ? (
        <span className="motion-note" data-morph-chrome="motion">
          A quieter view. Motion is off.
        </span>
      ) : (
        <button
          className="motion-control"
          onClick={onToggle}
          data-morph-chrome="motion"
          aria-label={paused ? 'Play motion' : 'Pause motion'}
        >
          <span className={`motion-dot ${paused ? 'is-paused' : ''}`} />
          <span className="motion-label">
            <span data-active={paused ? undefined : ''}>In motion</span>
            <span data-active={paused ? '' : undefined}>Motion paused</span>
          </span>
          <Icon name={paused ? 'play' : 'pause'} />
        </button>
      )}
    </footer>
  );
}
