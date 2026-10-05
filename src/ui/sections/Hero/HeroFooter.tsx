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
      <span className="footer-signature">
        EST. 2020 <span aria-hidden="true">—</span> DESIGN WITH INTENTION
      </span>
      {!gallery && (
        <button className="browse-button" onClick={onBrowse}>
          Explore the collection <span aria-hidden="true">↗</span>
        </button>
      )}
      {reducedMotion ? (
        <span className="motion-note">A quieter view. Motion is off.</span>
      ) : (
        <button
          className="motion-control"
          onClick={onToggle}
          aria-label={paused ? 'Play motion' : 'Pause motion'}
        >
          <span className={`motion-dot ${paused ? 'is-paused' : ''}`} />
          {paused ? 'Motion paused' : 'In motion'}
          <Icon name={paused ? 'play' : 'pause'} />
        </button>
      )}
    </footer>
  );
}
