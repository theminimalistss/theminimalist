import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTestimonialRain } from '@/hooks/useTestimonialRain';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useWorkPreview } from '@/hooks/useWorkPreview';
import type { Testimonial } from '@/types/testimonial';
import { ROUTES } from '@/router/paths';
import { Icon } from '@/ui/components/Icon';
import { LinkCards } from '@/ui/sections/Page/LinkCards';
import { PageSection } from '@/ui/sections/Page/PageSection';
import { TestimonialBackdrop } from '@/ui/sections/Testimonials/TestimonialBackdrop';
import { TestimonialDialog } from '@/ui/sections/Testimonials/TestimonialDialog';
import { TestimonialRain } from '@/ui/sections/Testimonials/TestimonialRain';
import '@/ui/styles/testimonials.css';

const NEXT = [
  { label: 'Works', to: ROUTES.works, description: 'Selected studies from the studio.' },
  { label: 'Request a quote', to: ROUTES.quote, description: 'Start a project with us.' },
] as const;

export default function TestimonialsPage() {
  const state = useTestimonials();
  const reducedMotion = useReducedMotion();
  const testimonials = state.status === 'ready' ? state.testimonials : [];
  const preview = useWorkPreview<Testimonial>();
  const current = preview.work;
  const position = current ? testimonials.findIndex((item) => item.id === current.id) : 0;
  const step = (direction: 1 | -1) => {
    const next = testimonials[(position + direction + testimonials.length) % testimonials.length];
    if (next) preview.show(next);
  };
  const rain = useTestimonialRain({
    enabled: !reducedMotion && testimonials.length > 0,
    held: current !== null || preview.transitioning,
    layout: String(testimonials.length),
  });
  const rated = testimonials.filter((item) => item.rating);
  const average = rated.length
    ? rated.reduce((sum, item) => sum + (item.rating ?? 0), 0) / rated.length
    : 0;

  return (
    <>
      <section
        className="testimonials-hero"
        aria-labelledby="testimonials-title"
        data-receded={current ? '' : undefined}
        data-still={reducedMotion ? '' : undefined}
      >
        <TestimonialBackdrop />
        <div className="testimonials-intro">
          <span className="eyebrow">Studio — Testimonials</span>
          <h1 id="testimonials-title">
            Kind words, <em className="serif">from real clients.</em>
          </h1>
          <p>
            What working with the studio feels like, in our clients’ own words. Hover a frame to
            bring it close; open it to read it in full.
          </p>
          {testimonials.length > 0 && (
            <dl className="testimonials-stats">
              <div>
                <dt>Clients</dt>
                <dd>{testimonials.length}</dd>
              </div>
              <div>
                <dt>Average rating</dt>
                <dd>{average.toFixed(1)}/5</dd>
              </div>
            </dl>
          )}
          {!reducedMotion && testimonials.length > 0 && (
            <button className="testimonials-pause" onClick={rain.togglePause}>
              <Icon name={rain.paused ? 'play' : 'pause'} />
              <span>{rain.paused ? 'Play' : 'Pause'} the testimonials</span>
            </button>
          )}
        </div>
        {state.status === 'error' && <p className="testimonials-error">{state.message}</p>}
        {testimonials.length > 0 && (
          <TestimonialRain
            testimonials={testimonials}
            stageRef={rain.stageRef}
            playing={!reducedMotion}
            onOpen={(index, element) => {
              const testimonial = testimonials[index];
              if (testimonial) preview.open(testimonial, element);
            }}
          />
        )}
      </section>
      <TestimonialDialog
        testimonial={current}
        position={position}
        total={testimonials.length}
        onClose={preview.close}
        onStep={step}
      />
      <PageSection eyebrow="Continue" title="See the work.">
        <LinkCards items={NEXT} label="Next steps" />
      </PageSection>
    </>
  );
}
