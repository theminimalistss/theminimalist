import { useSiteContent } from '@/hooks/useSiteContent';
import { PageIntro } from '@/ui/sections/Page/PageIntro';
import { ProductPanels } from '@/ui/sections/Products/ProductPanels';
import '@/ui/styles/products.css';

export default function ProductsPage() {
  const copy = useSiteContent('pages').products;
  return (
    <div className="products-overview">
      <PageIntro {...copy} />
      <ProductPanels />
    </div>
  );
}
