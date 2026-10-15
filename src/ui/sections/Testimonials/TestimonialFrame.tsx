import { RatingStars } from '@/ui/components/RatingStars';
import { Icon } from '@/ui/components/Icon';
import type { Testimonial } from '@/types/testimonial';
import { TestimonialMediaView } from './TestimonialMediaView';

type Props = {
  testimonial: Testimonial;
  number: number;
  echo?: boolean;
  playing?: boolean;
  onOpen: (element: HTMLElement) => void;
};

export function TestimonialFrame({
  testimonial,
  number,
  echo = false,
  playing = false,
  onOpen,
}: Props) {
  return (
    <button
      className="testimonial-frame"
      data-frame=""
      data-echo={echo ? '' : undefined}
      data-work-id={testimonial.id}
      tabIndex={echo ? -1 : undefined}
      aria-label={echo ? undefined : `Read ${testimonial.client}, ${testimonial.business}`}
      onClick={(event) => onOpen(event.currentTarget)}
    >
      <span className="testimonial-frame-media" data-work-part="media" aria-hidden="true">
        <TestimonialMediaView media={testimonial.media} echo={echo} autoPlay={playing && !echo} />
      </span>
      <span className="testimonial-frame-top" aria-hidden="true">
        <span data-work-part="category">{testimonial.business}</span>
        {testimonial.rating && <RatingStars rating={testimonial.rating} />}
      </span>
      <span className="testimonial-frame-body" aria-hidden="true">
        <span className="testimonial-frame-glyph">“</span>
        <span className="testimonial-frame-quote">{testimonial.excerpt}</span>
      </span>
      <span className="testimonial-frame-bottom" aria-hidden="true">
        <span className="testimonial-frame-client" data-work-part="title">
          {testimonial.client}
        </span>
        <span className="testimonial-frame-index">
          {String(number).padStart(2, '0')}{' '}
          <span className="testimonial-frame-read">
            Read <Icon name="arrow" className="inline-icon" />
          </span>
        </span>
      </span>
    </button>
  );
}
