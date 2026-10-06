import type { Work } from '@/types/work';
import { WorkImage } from '@/ui/components/WorkImage';

type Props = {
  works: readonly Work[];
  index: number;
  onStep: (direction: 1 | -1) => void;
  onOpen: (work: Work) => void;
  showThumbnail: boolean;
};

const pad = (value: number) => String(value).padStart(2, '0');

/** One study at a time, so the control stays the same size for any collection. */
export function FocusStepper({ works, index, onStep, onOpen, showThumbnail }: Props) {
  const work = works[index];
  const count = works.length;
  if (!work) return null;
  const previous = works[(index - 1 + count) % count];
  const next = works[(index + 1) % count];
  return (
    <div className="focus-stepper" role="group" aria-label="Study in focus" data-glide="">
      <button
        className="focus-step"
        aria-label={`Previous study: ${previous?.title ?? ''}`}
        disabled={count < 2}
        onClick={() => onStep(-1)}
      >
        <span aria-hidden="true">←</span>
      </button>
      <button
        className="focus-current"
        aria-label={`Open ${work.title}, study ${index + 1} of ${count}`}
        onClick={() => onOpen(work)}
      >
        {showThumbnail && (
          <span className="focus-thumb" key={work.id} aria-hidden="true">
            <WorkImage
              image={work.mediaType === 'image' ? work.image : work.poster}
              alt=""
              sizes="48px"
            />
          </span>
        )}
        <span className="focus-count">
          {pad(index + 1)} / {pad(count)}
        </span>
        <span className="focus-title" key={`title-${work.id}`}>
          {work.title}
          <span className="focus-category">{work.category}</span>
        </span>
      </button>
      <button
        className="focus-step"
        aria-label={`Next study: ${next?.title ?? ''}`}
        disabled={count < 2}
        onClick={() => onStep(1)}
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
