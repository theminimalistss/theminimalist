import { SERVICE_PROCESS } from '@/constants/pages';
import { SERVICE_PAGES } from '@/router/navigation';
import { ROUTES } from '@/router/paths';
import { PageLink } from '@/ui/components/PageLink';
import { PageOverview } from '@/ui/sections/Page/PageOverview';
import { PageDirectory, DirectoryArtwork } from '@/ui/sections/Page/PageDirectory';
import { EditorialSection } from '@/ui/sections/Page/EditorialSection';
import { EditorialList } from '@/ui/sections/Page/EditorialList';
import { PageIntro } from '@/ui/sections/Page/PageIntro';

export default function ServicesPage() {
  return (
    <>
      <PageOverview
        compactTitle
        intro={
          <PageIntro
            eyebrow="Services"
            title="Software, websites,"
            accent="and brands with feeling."
            lead="Three ways we help: we engineer software, build websites, and shape brand identities, each with the same calm, considered craft."
          />
        }
      >
        <PageDirectory
          title="Choose a service"
          label="Services"
          items={SERVICE_PAGES.map((item, index) => ({
            ...item,
            category: ['Engineering', 'Digital', 'Identity'][index]!,
            dark: index === 1,
            artwork: (
              <DirectoryArtwork
                icon={index === 2 ? 'diamond' : 'grid'}
                word={['Build.', 'Create.', 'Shape.'][index]!}
              />
            ),
          }))}
        />
      </PageOverview>
      <EditorialSection
        id="services-process"
        eyebrow="How we work"
        statement="Made together,"
        accent="made with care."
        footer="Listen · Shape · Build · Launch"
        title="Simple, collaborative,"
        titleAccent="on time."
        lead="From the first conversation to handover, the process stays clear and collaborative."
      >
        <EditorialList items={SERVICE_PROCESS} label="Our process" ordered />
        <PageLink className="text-button editorial-link" to={ROUTES.works}>
          Explore our works <span aria-hidden="true">↗</span>
        </PageLink>
        <div className="editorial-actions">
          <PageLink className="text-button" to={ROUTES.quote}>
            Request a quote <span aria-hidden="true">↗</span>
          </PageLink>
          <PageLink className="text-button" to={ROUTES.appointment}>
            Book an appointment <span aria-hidden="true">↗</span>
          </PageLink>
        </div>
      </EditorialSection>
    </>
  );
}
