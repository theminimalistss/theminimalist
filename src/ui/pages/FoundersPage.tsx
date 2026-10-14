import { FOUNDERS } from '@/constants/founders';
import { CONTACT_LINKS, ROUTES } from '@/router/paths';
import { FounderShowcase } from '@/ui/sections/Founders/FounderShowcase';
import { LinkCards } from '@/ui/sections/Page/LinkCards';
import { PageSection } from '@/ui/sections/Page/PageSection';

const NEXT = [
  { label: 'About', to: ROUTES.about, description: 'Who we are and how we work.' },
  { label: 'Book an appointment', to: CONTACT_LINKS.appointment, description: 'Meet the studio.' },
] as const;

export default function FoundersPage() {
  return (
    <>
      <FounderShowcase
        founders={FOUNDERS}
        intro={
          <>
            <span className="eyebrow">Studio — Founders</span>
            <h1>
              Two founders, <em className="serif">one studio.</em>
            </h1>
            <p>
              A partnership between design and engineering, built on one belief: good design should
              feel calm, honest, and a little personal.
            </p>
          </>
        }
      />
      <PageSection eyebrow="Continue" title="Say hello.">
        <LinkCards items={NEXT} label="Next steps" />
      </PageSection>
    </>
  );
}
