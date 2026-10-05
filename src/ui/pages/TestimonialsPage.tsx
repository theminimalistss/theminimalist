import { ROUTES } from '@/router/paths';
import { LinkCards } from '@/ui/sections/Page/LinkCards';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageSection } from '@/ui/sections/Page/PageSection';
import { Placeholder } from '@/ui/sections/Page/Placeholder';

const SLOTS = ['first', 'second', 'third'];

const NEXT = [
  { label: 'Works', to: ROUTES.works, description: 'Selected studies from the studio.' },
  { label: 'Request a quote', to: ROUTES.quote, description: 'Start a project with us.' },
] as const;

export default function TestimonialsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Studio — Testimonials"
        documentTitle="Testimonials"
        title="Kind words,"
        accent="shared with permission."
        lead="What working with the studio feels like, in the words of the people we work with."
      />
      <PageSection eyebrow="Testimonials" title="Words on the way.">
        <ul className="quote-cards" aria-label="Testimonial placeholders" data-reveal="stagger">
          {SLOTS.map((slot) => (
            <li key={slot}>
              <span className="quote-mark" aria-hidden="true">
                “
              </span>
              <span className="quote-line" aria-hidden="true" />
              <span className="quote-line" aria-hidden="true" />
              <span className="quote-line" aria-hidden="true" />
              <p>Testimonial to be published</p>
            </li>
          ))}
        </ul>
        <Placeholder title="Coming soon">
          Client testimonials will appear here once clients approve them. We only publish words
          we’ve been given.
        </Placeholder>
      </PageSection>
      <PageSection eyebrow="Continue" title="See the work.">
        <LinkCards items={NEXT} label="Next steps" />
      </PageSection>
    </>
  );
}
