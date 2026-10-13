import { SERVICE_PROCESS } from '@/constants/pages';
import { SERVICE_PAGES } from '@/router/navigation';
import { ROUTES } from '@/router/paths';
import { PageLink } from '@/ui/components/PageLink';
import { LinkCards } from '@/ui/sections/Page/LinkCards';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageSection } from '@/ui/sections/Page/PageSection';

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Software, websites,"
        accent="and brands with feeling."
        lead="Three ways we help: we engineer software, build websites, and shape brand identities, each with the same calm, considered craft."
      >
        <PageLink className="text-button" to={ROUTES.quote}>
          Request a quote <span aria-hidden="true">↗</span>
        </PageLink>
        <PageLink className="text-button" to={ROUTES.appointment}>
          Book an appointment <span aria-hidden="true">↗</span>
        </PageLink>
      </PageIntro>
      <PageSection eyebrow="What we do" title="Choose a service.">
        <LinkCards items={SERVICE_PAGES} label="Services" />
      </PageSection>
      <PageSection eyebrow="How we work" title="Simple, collaborative, on time.">
        <ol className="service-list" data-reveal="stagger">
          {SERVICE_PROCESS.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </PageSection>
    </>
  );
}
