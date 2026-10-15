import { Icon } from '@/ui/components/Icon';
import { PRODUCT_COPY, type ProductKey } from '@/constants/pages';
import { PRODUCT_PAGES } from '@/router/navigation';
import { CONTACT_LINKS, ROUTES } from '@/router/paths';
import { Breadcrumbs } from '@/ui/sections/Page/Breadcrumbs';
import { Checklist } from '@/ui/sections/Page/Checklist';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageSection } from '@/ui/sections/Page/PageSection';
import { Placeholder } from '@/ui/sections/Page/Placeholder';
import { SectionTabs } from '@/ui/sections/Page/SectionTabs';
import { PageLink } from '@/ui/components/PageLink';
import { TemplateCatalog } from '@/ui/sections/Products/TemplateCatalog';
import '@/ui/styles/products.css';

export default function ProductPage({ product }: { product: ProductKey }) {
  const copy = PRODUCT_COPY[product];
  return (
    <>
      <Breadcrumbs trail={[{ label: 'Products', to: ROUTES.products }, { label: copy.title }]} />
      <SectionTabs items={PRODUCT_PAGES} label="Product categories" />
      <PageIntro
        eyebrow={copy.status === 'available' ? 'Products · Available' : 'Products · Coming soon'}
        title={copy.title}
        accent={copy.accent}
        lead={copy.lead}
      >
        <PageLink className="text-button" to={CONTACT_LINKS.quote}>
          {copy.status === 'available' ? 'Request a quote' : 'Ask to be notified'}{' '}
          <Icon name="arrow" className="inline-icon" />
        </PageLink>
        <PageLink className="text-button" to={CONTACT_LINKS.appointment}>
          Book an appointment <Icon name="arrow" className="inline-icon" />
        </PageLink>
      </PageIntro>
      {copy.status === 'available' ? (
        <PageSection eyebrow="Templates" title="Choose a starting point.">
          <TemplateCatalog />
        </PageSection>
      ) : (
        <PageSection eyebrow="Coming soon" title="In the studio now.">
          <Checklist items={copy.checklist} label={`${copy.title} catalog contents`} />
          <Placeholder title="Coming soon">
            {copy.title} are in development and will be listed here. In the meantime, ask us
            directly about what you need.
          </Placeholder>
        </PageSection>
      )}
    </>
  );
}
