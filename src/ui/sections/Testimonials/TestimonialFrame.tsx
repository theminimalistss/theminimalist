import type { Testimonial } from '@/types/testimonial';
import { initials } from '@/utils/testimonialField';
import { TestimonialMediaView } from './TestimonialMediaView';

type Props = {
  testimonial: Testimonial;
  tone: number;
  echo?: boolean;
  onOpen: (element: HTMLElement) => void;
};

export function TestimonialFrame({ testimonial, tone, echo = false, onOpen }: Props) {
  return (
    <button
      className="testimonial-frame"
      data-frame={echo ? undefined : ''}
      data-id={testimonial.id}
      tabIndex={echo ? -1 : undefined}
      aria-label={echo ? undefined : `Read ${testimonial.client}, ${testimonial.business}`}
      onClick={(event) => onOpen(event.currentTarget)}
    >
      <span className="testimonial-frame-visual" data-tone={tone} aria-hidden="true">
        <TestimonialMediaView media={testimonial.media} echo={echo} />
        <span className="testimonial-frame-monogram">{initials(testimonial.business)}</span>
        <span className="testimonial-frame-brand">{testimonial.business}</span>
        {testimonial.rating && (
          <span className="testimonial-frame-rating">
            {'★'.repeat(Math.round(testimonial.rating))}
          </span>
        )}
      </span>
      <span className="testimonial-frame-quote">“{testimonial.excerpt}”</span>
      <span className="testimonial-frame-meta">
        <span className="testimonial-frame-client">{testimonial.client}</span>
        <span className="testimonial-frame-open" aria-hidden="true">
          Read ↗
        </span>
      </span>
    </button>
  );
}
