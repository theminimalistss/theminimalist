import { useEffect, useState } from 'react';
import { getTestimonials, summarizeTestimonials } from '@/services/testimonials.service';
import type { Testimonial } from '@/types/testimonial';

type State =
  | { status: 'loading' }
  | {
      status: 'ready';
      testimonials: Testimonial[];
      summary: ReturnType<typeof summarizeTestimonials>;
    }
  | { status: 'error'; message: string };

export function useTestimonials() {
  const [state, setState] = useState<State>({ status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    void getTestimonials(undefined, controller.signal).then(
      (testimonials) => {
        if (!controller.signal.aborted)
          setState({ status: 'ready', testimonials, summary: summarizeTestimonials(testimonials) });
      },
      () => {
        if (!controller.signal.aborted)
          setState({
            status: 'error',
            message: 'Testimonials couldn’t be loaded. Please try again.',
          });
      },
    );
    return () => controller.abort();
  }, []);
  return state;
}
