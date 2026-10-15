import { useSiteContent } from '@/hooks/useSiteContent';
import { Icon } from '@/ui/components/Icon';
import { CONTACT_LINKS } from '@/router/paths';
import { PageLink } from '@/ui/components/PageLink';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { ServiceProcess } from '@/ui/sections/Services/ServiceProcess';
import { ServiceDirectory } from '@/ui/sections/Services/ServiceDirectory';
import '@/ui/styles/services.css';

export default function ServicesPage() {
  const copy = useSiteContent('pages').services;
  return (
    <>
      <div className="services-overview">
        <PageIntro {...copy}>
          <PageLink className="text-button" to={CONTACT_LINKS.quote}>
            Start a project <Icon name="arrow" className="inline-icon" />
          </PageLink>
          <PageLink className="text-button" to={CONTACT_LINKS.appointment}>
            Let’s talk <Icon name="arrow" className="inline-icon" />
          </PageLink>
        </PageIntro>
        <ServiceProcess />
      </div>
      <ServiceDirectory />
    </>
  );
}
