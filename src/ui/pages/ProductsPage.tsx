import { PRODUCT_PAGES } from '@/router/navigation';
import { LinkCards } from '@/ui/sections/Page/LinkCards';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { PageSection } from '@/ui/sections/Page/PageSection';
import { Placeholder } from '@/ui/sections/Page/Placeholder';

export default function ProductsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Products"
        documentTitle="Products"
        title="Made by the studio,"
        accent="made to last."
        lead="Software, website templates, and hardware, designed and selected with the same care as our identities."
      />
      <PageSection eyebrow="Browse" title="Three ways we make things.">
        <LinkCards items={PRODUCT_PAGES} label="Product categories" />
        <Placeholder title="Catalog in preparation">
          Individual products, pricing, and availability will be listed in each category soon.
        </Placeholder>
      </PageSection>
    </>
  );
}
