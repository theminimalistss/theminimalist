import { useDialog } from '@/hooks/useDialog';
import type { Work } from '@/types/work';
import { Icon } from '@/ui/components/Icon';
import { WorkImage } from '@/ui/components/WorkImage';

export function WorkDialog({ work, onClose }: { work: Work | null; onClose: () => void }) {
  const ref = useDialog(work !== null);
  return (
    <dialog
      ref={ref}
      className="work-dialog"
      aria-labelledby="work-dialog-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {work && (
        <div className="work-dialog-inner">
          <button className="icon-button dialog-close" aria-label="Close project" onClick={onClose}>
            <Icon name="close" />
          </button>
          <div className="work-dialog-image">
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
            <button className="text-button" onClick={onClose}>
              Back to the collection <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
