import { useDialog } from '@/hooks/useDialog';
import { useMenuMorph } from '@/hooks/useMenuMorph';
import { Icon } from '@/ui/components/Icon';

type Props = {
  open: boolean;
  onClose: () => void;
  onView: (view: 'spiral' | 'gallery') => void;
  reducedMotion: boolean;
};

export function StudioMenu({ open, onClose, onView, reducedMotion }: Props) {
  const { phase, rendered, canvasRef, originRef, settle } = useMenuMorph(open, reducedMotion);
  const ref = useDialog(rendered);
  return (
    <dialog
      ref={ref}
      id="studio-menu"
      className="studio-menu"
      data-phase={phase}
      aria-labelledby="menu-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        settle();
        onClose();
      }}
    >
      <canvas ref={canvasRef} className="menu-morph" aria-hidden="true" />
      <div className="menu-top">
        <span className="eyebrow">THE MINIMALIST</span>
        <button ref={originRef} className="menu-trigger" onClick={onClose}>
          Close <Icon name="close" />
        </button>
      </div>
      <div className="menu-body">
        <div>
          <span className="eyebrow">A considered collection</span>
          <h2 id="menu-title">
            Good design.
            <br />
            <em className="serif">A little feeling.</em>
          </h2>
        </div>
        <nav aria-label="Collection views">
          {!reducedMotion && (
            <button onClick={() => onView('spiral')}>
              <span>01</span>Explore in motion
              <Icon name="arrow" />
            </button>
          )}
          <button onClick={() => onView('gallery')}>
            <span>02</span>Browse the collection
            <Icon name="arrow" />
          </button>
        </nav>
      </div>
      <div className="menu-bottom">
        <p>
          We’re an independent design studio.
          <br />
          Shaping identities and digital experiences
          <br />
          with clarity, character, and care.
        </p>
        <p>
          Brand. Digital. Experience.
          <br />
          <span className="serif">Less, but with feeling.</span>
        </p>
        <span className="eyebrow">EST. 2020</span>
      </div>
    </dialog>
  );
}
