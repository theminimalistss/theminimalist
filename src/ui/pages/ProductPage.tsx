import { PRODUCT_COPY, type ProductKey } from '@/constants/pages';
import { PRODUCT_PAGES } from '@/router/navigation';
import { ROUTES } from '@/router/paths';
import { Breadcrumbs } from '@/ui/sections/Page/Breadcrumbs';
import { Checklist } from '@/ui/sections/Page/Checklist';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageSection } from '@/ui/sections/Page/PageSection';
import { Placeholder } from '@/ui/sections/Page/Placeholder';
import { SectionTabs } from '@/ui/sections/Page/SectionTabs';
import { PageLink } from '@/ui/components/PageLink';

export default function ProductPage({ product }: { product: ProductKey }) {
  const copy = PRODUCT_COPY[product];
  return (
    <>
      <Breadcrumbs trail={[{ label: 'Products', to: ROUTES.products }, { label: copy.title }]} />
      <SectionTabs items={PRODUCT_PAGES} label="Product categories" />
      <PageIntro eyebrow="Products" title={copy.title} accent={copy.accent} lead={copy.lead}>
        <PageLink className="text-button" to={ROUTES.quote}>
          Request a quote <span aria-hidden="true">↗</span>
        </PageLink>
        <PageLink className="text-button" to={ROUTES.appointment}>
          Book an appointment <span aria-hidden="true">↗</span>
        </PageLink>
      </PageIntro>
      <PageSection eyebrow="What you’ll find here" title="The catalog is on its way.">
        <Checklist items={copy.checklist} label={`${copy.title} catalog contents`} />
        <Placeholder title="Coming soon">
          {copy.title} will be listed here. In the meantime, ask us directly about what you need.
        </Placeholder>
      </PageSection>
    </>
  );
}
