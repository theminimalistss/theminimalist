import { useCallback } from 'react';
import { useWorkPreview } from '@/hooks/useWorkPreview';
import type { Testimonial } from '@/types/testimonial';

export function useTestimonialReader(testimonials: readonly Testimonial[]) {
  const preview = useWorkPreview<Testimonial>();
  const { show, open: openPreview } = preview;
  const current = preview.work;
  const position = current ? testimonials.findIndex((item) => item.id === current.id) : 0;

  const open = useCallback(
    (index: number, element: HTMLElement) => {
      const testimonial = testimonials[index];
      if (testimonial) openPreview(testimonial, element);
    },
    [testimonials, openPreview],
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      const count = testimonials.length;
      const next = testimonials[(position + direction + count) % count];
      if (next) show(next);
    },
    [testimonials, position, show],
  );

  return {
    current,
    position,
    reading: current !== null || preview.transitioning,
    open,
    close: preview.close,
    step,
  };
}
