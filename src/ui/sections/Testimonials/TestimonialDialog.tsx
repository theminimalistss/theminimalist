import { useDialog } from '@/hooks/useDialog';
import type { Testimonial } from '@/types/testimonial';
import { Icon } from '@/ui/components/Icon';
import { TestimonialMediaView } from './TestimonialMediaView';

type Props = {
  testimonial: Testimonial | null;
  position: number;
  total: number;
  onClose: () => void;
  onStep: (direction: 1 | -1) => void;
};

export function TestimonialDialog({ testimonial, position, total, onClose, onStep }: Props) {
  const ref = useDialog(testimonial !== null);
  return (
    <dialog
      ref={ref}
      className="testimonial-dialog"
      aria-labelledby="testimonial-dialog-client"
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
        <article className="testimonial-dialog-panel" tabIndex={-1}>
          <button
            className="icon-button testimonial-dialog-close"
            aria-label="Close testimonial"
            data-sound="off"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
          <div className="testimonial-dialog-visual" aria-hidden="true" key={`m-${testimonial.id}`}>
            <TestimonialMediaView media={testimonial.media} echo={false} autoPlay />
            <span className="testimonial-dialog-brand">{testimonial.business}</span>
          </div>
          <div className="testimonial-dialog-body" key={testimonial.id}>
            <span className="eyebrow">
              {String(position + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} — Client
              words
            </span>
            {testimonial.headline && (
              <p className="testimonial-dialog-headline">{testimonial.headline}</p>
            )}
            <blockquote className="testimonial-dialog-quote">
              {testimonial.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </blockquote>
            <footer className="testimonial-dialog-client">
              <span className="testimonial-dialog-mark" aria-hidden="true" />
              <span>
                <strong id="testimonial-dialog-client">{testimonial.client}</strong>
                <span>
                  {testimonial.role ? `${testimonial.role}, ` : ''}
                  {testimonial.business}
                </span>
              </span>
              {testimonial.rating && (
                <span className="testimonial-dialog-rating">
                  <span aria-hidden="true">{'★'.repeat(Math.round(testimonial.rating))}</span>
                  <span className="sr-only">Rated</span> {testimonial.rating.toFixed(1)}/5
                </span>
              )}
            </footer>
          </div>
          <nav className="testimonial-dialog-steps" aria-label="More testimonials">
            <button onClick={() => onStep(-1)} aria-label="Previous testimonial">
              <span aria-hidden="true">←</span> Previous
            </button>
            <button onClick={() => onStep(1)} aria-label="Next testimonial">
              Next <span aria-hidden="true">→</span>
            </button>
          </nav>
        </article>
      )}
    </dialog>
  );
}
