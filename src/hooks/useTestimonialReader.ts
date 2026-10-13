import { useCallback, useLayoutEffect, useState } from 'react';
import { useWorkPreview } from '@/hooks/useWorkPreview';
import type { Testimonial } from '@/types/testimonial';

export function useTestimonialReader(testimonials: readonly Testimonial[]) {
  const preview = useWorkPreview<Testimonial>();
  const { show, open: openPreview } = preview;
  const current = preview.work;
  const position = current ? testimonials.findIndex((item) => item.id === current.id) : 0;
  const lifted = current?.id;
  const [direction, setDirection] = useState<1 | -1 | 0>(0);

  useLayoutEffect(() => {
    if (!lifted) return;
    const frame = document.querySelector<HTMLElement>(
      `.testimonial-space [data-work-id="${CSS.escape(lifted)}"]`,
    );
    frame?.setAttribute('data-lifted', '');
    return () => frame?.removeAttribute('data-lifted');
  }, [lifted]);

  const open = useCallback(
    (index: number, element: HTMLElement) => {
      const testimonial = testimonials[index];
      if (!testimonial) return;
      setDirection(0);
      openPreview(testimonial, element);
    },
    [testimonials, openPreview],
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      const count = testimonials.length;
      const next = testimonials[(position + direction + count) % count];
      if (!next) return;
      setDirection(direction);
      show(next);
    },
    [testimonials, position, show],
  );

  return {
    current,
    position,
    direction,
    reading: current !== null || preview.transitioning,
    open,
    close: preview.close,
    step,
  };
}
