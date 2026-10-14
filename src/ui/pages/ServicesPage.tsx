import { CONTACT_LINKS } from '@/router/paths';
import { PageLink } from '@/ui/components/PageLink';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { ServiceProcess } from '@/ui/sections/Services/ServiceProcess';
import { ServiceDirectory } from '@/ui/sections/Services/ServiceDirectory';
import '@/ui/styles/services.css';

export default function ServicesPage() {
  return (
    <>
      <div className="services-overview">
        <PageIntro
          eyebrow="Services"
          title="Software, websites,"
          accent="and brands with feeling."
          lead="Three ways we help: we engineer software, build websites, and shape brand identities, each with the same calm, considered craft."
        >
          <PageLink className="text-button" to={CONTACT_LINKS.quote}>
            Start a project <span aria-hidden="true">↗</span>
          </PageLink>
          <PageLink className="text-button" to={CONTACT_LINKS.appointment}>
            Let’s talk <span aria-hidden="true">↗</span>
          </PageLink>
        </PageIntro>
        <ServiceProcess />
      </div>
      <ServiceDirectory />
    </>
  );
}
