import { SERVICE_COPY, SERVICE_PROCESS, type ServiceKey } from '@/constants/pages';
import { SERVICE_PAGES } from '@/router/navigation';
import { ROUTES } from '@/router/paths';
import { PageLink } from '@/ui/components/PageLink';
import { Breadcrumbs } from '@/ui/sections/Page/Breadcrumbs';
import { Checklist } from '@/ui/sections/Page/Checklist';
import { LinkCards } from '@/ui/sections/Page/LinkCards';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageSection } from '@/ui/sections/Page/PageSection';
import { SectionTabs } from '@/ui/sections/Page/SectionTabs';

const NEXT = [
  { label: 'Works', to: ROUTES.works, description: 'Concept studies from the studio.' },
  { label: 'Testimonials', to: ROUTES.testimonials, description: 'What our clients say.' },
  { label: 'Request a quote', to: ROUTES.quote, description: 'Start a project with us.' },
] as const;

export default function ServicePage({ service }: { service: ServiceKey }) {
  const copy = SERVICE_COPY[service];
  return (
    <>
      <Breadcrumbs trail={[{ label: 'Services', to: ROUTES.services }, { label: copy.title }]} />
      <SectionTabs items={SERVICE_PAGES} label="Services" />
      <PageIntro eyebrow="Services" title={copy.title} accent={copy.accent} lead={copy.lead}>
        <PageLink className="text-button" to={ROUTES.quote}>
          Request a quote <span aria-hidden="true">↗</span>
        </PageLink>
        <PageLink className="text-button" to={ROUTES.appointment}>
          Book an appointment <span aria-hidden="true">↗</span>
        </PageLink>
      </PageIntro>
      <PageSection eyebrow="What’s included" title="Everything it needs.">
        <Checklist items={copy.checklist} label={`${copy.title} includes`} />
      </PageSection>
      <PageSection eyebrow="How we work" title="Listen, shape, build, launch.">
        <ol className="service-list" data-reveal="stagger">
          {SERVICE_PROCESS.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </PageSection>
      <PageSection eyebrow="Continue" title="See it in practice.">
        <p className="page-lead">{copy.works}</p>
        <LinkCards items={NEXT} label="Next steps" />
      </PageSection>
    </>
  );
}
