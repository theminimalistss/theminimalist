import { Icon } from './Icon';

/** Decorative stars accompany the testimonial's existing accessible rating. */
export function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="rating-stars" aria-hidden="true">
      {Array.from({ length: Math.round(rating) }, (_, index) => (
        <Icon key={index} name="star" className="inline-icon" />
      ))}
    </span>
  );
}
