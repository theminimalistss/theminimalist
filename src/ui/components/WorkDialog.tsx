import { useDialog } from '@/hooks/useDialog';
import { useMediaFlight } from '@/hooks/useMediaFlight';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Work } from '@/types/work';
import { Icon } from '@/ui/components/Icon';
import { WorkImage } from '@/ui/components/WorkImage';

export function WorkDialog({ work, onClose }: { work: Work | null; onClose: () => void }) {
  const reducedMotion = useReducedMotion();
  const ref = useDialog(work !== null);
  const { phase, ghostRef, targetRef, panelRef, requestClose } = useMediaFlight(
    work?.id ?? null,
    !reducedMotion,
    onClose,
  );

  return (
    <dialog
      ref={ref}
      className="work-dialog"
      data-phase={phase}
      aria-labelledby="work-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={() => {
        if (work) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      {(phase === 'opening' || phase === 'closing') && (
        <img ref={ghostRef} className="work-dialog-ghost" alt="" aria-hidden="true" />
      )}
      {work && (
        <div ref={panelRef} className="work-dialog-inner">
          <button
            className="icon-button dialog-close"
            aria-label="Close project"
            onClick={requestClose}
          >
            <Icon name="close" />
          </button>
          <div ref={targetRef} className="work-dialog-image">
            <WorkImage
              image={work.mediaType === 'image' ? work.image : work.poster}
              alt={work.alt}
              priority
            />
          </div>
          <div className="work-dialog-copy">
            <span className="eyebrow">
              {work.category} · {work.year}
            </span>
            <h2 id="work-dialog-title">
              {work.title}
              <span className="serif">{work.tagline}</span>
            </h2>
            <p>{work.description}</p>
            {work.isConcept && (
              <p className="concept-note">
                Independent concept study, presented with licensed stock imagery. Not commissioned
                client work.
              </p>
            )}
            <button className="text-button" onClick={requestClose}>
              Back to the collection <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
