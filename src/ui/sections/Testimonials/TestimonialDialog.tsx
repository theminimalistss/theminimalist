import { useDialog } from '@/hooks/useDialog';
import type { Testimonial } from '@/types/testimonial';
import { Icon } from '@/ui/components/Icon';
import { TestimonialMediaView } from './TestimonialMediaView';

type Props = {
  testimonial: Testimonial | null;
  position: number;
  direction: 1 | -1 | 0;
  total: number;
  onClose: () => void;
  onStep: (direction: 1 | -1) => void;
};

export function TestimonialDialog({
  testimonial,
  position,
  direction,
  total,
  onClose,
  onStep,
}: Props) {
  const ref = useDialog(testimonial !== null);
  return (
    <dialog
      ref={ref}
      className="work-dialog testimonial-dialog"
      aria-labelledby="testimonial-dialog-client"
      data-step={direction > 0 ? 'next' : direction < 0 ? 'previous' : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') onStep(1);
        if (event.key === 'ArrowLeft') onStep(-1);
      }}
    >
      {testimonial && (
        <div className="work-dialog-inner" tabIndex={-1}>
          <button
            className="icon-button dialog-close"
            aria-label="Close testimonial"
            data-sound="off"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
          <div className="work-dialog-image testimonial-dialog-media" data-work-part="media">
            <TestimonialMediaView
              key={testimonial.id}
              media={testimonial.media}
              autoPlay
              sizes="(max-width: 767px) 100vw, 440px"
            />
          </div>
          <div className="work-dialog-copy testimonial-dialog-copy" key={testimonial.id}>
            <span className="eyebrow">
              <span data-work-part="category">{testimonial.business}</span> ·{' '}
              {String(position + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <h2 id="testimonial-dialog-client">
              <span className="work-dialog-title" data-work-part="title">
                {testimonial.client}
              </span>
              <span className="serif work-dialog-tagline">
                {testimonial.role ? `${testimonial.role}, ` : ''}
                {testimonial.business}
              </span>
            </h2>
            {testimonial.headline && (
              <p className="testimonial-dialog-headline">{testimonial.headline}</p>
            )}
            <blockquote className="testimonial-dialog-quote">
              {testimonial.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </blockquote>
            {testimonial.rating && (
              <p className="testimonial-dialog-rating">
                <span aria-hidden="true">{'★'.repeat(Math.round(testimonial.rating))}</span>{' '}
                <span className="sr-only">Rated</span> {testimonial.rating.toFixed(1)}/5
              </p>
            )}
            <nav className="testimonial-dialog-steps" aria-label="More testimonials">
              <button onClick={() => onStep(-1)} aria-label="Previous testimonial">
                <span aria-hidden="true">←</span> Previous
              </button>
              <button onClick={() => onStep(1)} aria-label="Next testimonial">
                Next <span aria-hidden="true">→</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </dialog>
  );
}
