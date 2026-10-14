import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { ProductPanels } from '@/ui/sections/Products/ProductPanels';
import '@/ui/styles/products.css';

export default function ProductsPage() {
  return (
    <div className="products-overview">
      <PageIntro
        eyebrow="Products"
        title="Made by the studio,"
        accent="made to last."
        lead="Software, website templates, and hardware, designed and selected with the same care as our identities."
      />
      <ProductPanels />
    </div>
  );
}
