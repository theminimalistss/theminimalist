import { PRODUCT_PAGES } from '@/router/navigation';
import { PageOverview } from '@/ui/sections/Page/PageOverview';
import { PageDirectory, DirectoryArtwork } from '@/ui/sections/Page/PageDirectory';
import { EditorialSection } from '@/ui/sections/Page/EditorialSection';
import { EditorialList } from '@/ui/sections/Page/EditorialList';
import { PageIntro } from '@/ui/sections/Page/PageIntro';

const CATALOG = [
  { title: 'Details', text: 'Product overviews, specifications, and previews.' },
  { title: 'Availability', text: 'Pricing, plans, and lead times.' },
  { title: 'Licensing', text: 'What is included and how to make it yours.' },
  { title: 'Support', text: 'Onboarding, updates, and care guidance.' },
] as const;

export default function ProductsPage() {
  return (
    <>
      <PageOverview
        compactTitle
        intro={
          <PageIntro
            eyebrow="Products"
            title="Made by the studio,"
            accent="made to last."
            lead="Software, website templates, and hardware, designed and selected with the same care as our identities."
          />
        }
      >
        <PageDirectory
          title="Browse the collection"
          label="Product categories"
          items={PRODUCT_PAGES.map((item, index) => ({
            ...item,
            category: ['Tools', 'Starting points', 'Objects'][index]!,
            dark: index === 1,
            artwork: (
              <DirectoryArtwork
                icon={index === 2 ? 'diamond' : 'grid'}
                word={['Tools.', 'Compose.', 'Objects.'][index]!}
              />
            ),
          }))}
        />
      </PageOverview>
      <EditorialSection
        id="product-catalog"
        eyebrow="Made by the studio"
        statement="Considered tools,"
        accent="everyday purpose."
        footer="Software · Templates · Hardware"
        title="Our catalog,"
        titleAccent="in preparation."
        lead="Individual products, pricing, and availability will be listed in each category soon."
      >
        <EditorialList items={CATALOG} label="Catalog information in preparation" />
      </EditorialSection>
    </>
  );
}
