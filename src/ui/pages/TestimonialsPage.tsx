import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTestimonialGalleryFocus } from '@/hooks/useTestimonialGalleryFocus';
import { useTestimonialRain } from '@/hooks/useTestimonialRain';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useTestimonialView } from '@/hooks/useTestimonialView';
import type { Testimonial } from '@/types/testimonial';
import { useTestimonialReader } from '@/hooks/useTestimonialReader';
import { CONTACT_LINKS, ROUTES } from '@/router/paths';
import { Icon } from '@/ui/components/Icon';
import { LinkCards } from '@/ui/sections/Page/LinkCards';
import { PageSection } from '@/ui/sections/Page/PageSection';
import { TestimonialBackdrop } from '@/ui/sections/Testimonials/TestimonialBackdrop';
import { TestimonialDialog } from '@/ui/sections/Testimonials/TestimonialDialog';
import { TestimonialRain } from '@/ui/sections/Testimonials/TestimonialRain';
import '@/ui/styles/testimonials.css';

const NEXT = [
  { label: 'Works', to: ROUTES.works, description: 'Selected studies from the studio.' },
  { label: 'Request a quote', to: CONTACT_LINKS.quote, description: 'Start a project with us.' },
] as const;

const NO_TESTIMONIALS: Testimonial[] = [];

export default function TestimonialsPage() {
  const state = useTestimonials();
  const reducedMotion = useReducedMotion();
  const testimonials = state.status === 'ready' ? state.testimonials : NO_TESTIMONIALS;
  const summary = state.status === 'ready' ? state.summary : null;
  const reader = useTestimonialReader(testimonials);
  const current = reader.current;
  const { view, change, rootRef } = useTestimonialView(reducedMotion);
  const gallery = view === 'gallery';
  const rain = useTestimonialRain({
    enabled: !gallery && testimonials.length > 0,
    held: reader.reading,
    layout: String(testimonials.length),
  });
  useTestimonialGalleryFocus(rain.stageRef, gallery && !reducedMotion && testimonials.length > 0);

  return (
    <>
      <section
        ref={rootRef}
        className="testimonials-hero"
        aria-labelledby="testimonials-title"
        data-receded={current ? '' : undefined}
        data-still={gallery ? '' : undefined}
      >
        <TestimonialBackdrop />
        <div className="testimonials-intro">
          <span className="testimonials-intro-surface" aria-hidden="true" />
          <span className="eyebrow">Studio — Testimonials</span>
          <h1 id="testimonials-title">
            Kind words, <em className="serif">from real clients.</em>
          </h1>
          <p>
            What working with the studio feels like, in our clients’ own words. Hover a frame to
            bring it close, open it to read it in full, or browse them all in the gallery.
          </p>
          {summary && summary.count > 0 && (
            <dl className="testimonials-stats">
              <div>
                <dt>Clients</dt>
                <dd>{summary.count}</dd>
              </div>
              <div>
                <dt>Average rating</dt>
                <dd>{summary.average.toFixed(1)}/5</dd>
              </div>
            </dl>
          )}
          {!reducedMotion && testimonials.length > 0 && (
            <div className="testimonials-controls">
              <div role="group" aria-label="Testimonials view">
                <button aria-pressed={!gallery} onClick={() => change('spatial')}>
                  Spatial
                </button>
                <button aria-pressed={gallery} onClick={() => change('gallery')}>
                  Gallery
                </button>
              </div>
              <button className="testimonials-pause" onClick={rain.togglePause} inert={gallery}>
                <Icon name={rain.paused ? 'play' : 'pause'} />
                <span>{rain.paused ? 'Play' : 'Pause'} the testimonials</span>
              </button>
            </div>
          )}
        </div>
        {state.status === 'error' && <p className="testimonials-error">{state.message}</p>}
        {testimonials.length > 0 && (
          <TestimonialRain
            testimonials={testimonials}
            stageRef={rain.stageRef}
            seed={rain.seed}
            playing={!reducedMotion}
            onOpen={reader.open}
          />
        )}
      </section>
      <TestimonialDialog
        testimonial={current}
        position={reader.position}
        direction={reader.direction}
        total={testimonials.length}
        onClose={reader.close}
        onStep={reader.step}
      />
      <PageSection eyebrow="Continue" title="See the work.">
        <LinkCards items={NEXT} label="Next steps" />
      </PageSection>
    </>
  );
}
