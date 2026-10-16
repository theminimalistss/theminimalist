import { useProductDetail } from '@/hooks/useProductDetail';
import { useIllustrationMotion } from '@/hooks/useIllustrationMotion';
import type { ProductKey } from '@/types/content';
import { PRODUCT_PAGES } from '@/router/navigation';
import { PRODUCT_ROUTES, ROUTES } from '@/router/paths';
import { Icon } from '@/ui/components/Icon';
import { Breadcrumbs } from '@/ui/sections/Page/Breadcrumbs';
import { SectionTabs } from '@/ui/sections/Page/SectionTabs';
import { SoftwareProductDetail } from '@/ui/sections/Products/SoftwareProductDetail';
import { TemplateProductDetail } from '@/ui/sections/Products/TemplateProductDetail';
import { HardwareProductDetail } from '@/ui/sections/Products/HardwareProductDetail';
import { ProductClosing } from '@/ui/sections/Products/ProductDetailPrimitives';
import '@/ui/styles/products.css';
import '@/ui/styles/product-detail.css';

export default function ProductPage({ product }: { product: ProductKey }) {
  const { state, retry } = useProductDetail(product);
  const { ref, paused, reduced, running, toggle } = useIllustrationMotion(
    state.status === 'ready',
    '[data-product-scene]',
  );
  const title = PRODUCT_PAGES.find((item) => item.to === PRODUCT_ROUTES[product])!.label;
  return (
    <div
      ref={ref}
      className={`product-detail product-detail--${product}`}
      data-motion={running ? 'running' : 'paused'}
    >
      <Breadcrumbs trail={[{ label: 'Products', to: ROUTES.products }, { label: title }]} />
      <SectionTabs items={PRODUCT_PAGES} label="Product categories" />
      {state.status === 'ready' && !reduced && (
        <div className="pd-motion-tools pd-pad">
          <button type="button" aria-pressed={paused} onClick={toggle}>
            <Icon name={paused ? 'play' : 'pause'} />
            {paused ? 'Play' : 'Pause'} illustrations
          </button>
        </div>
      )}
      {state.status === 'loading' && (
        <p className="pd-status" role="status">
          Gathering the collection…
        </p>
      )}
      {state.status === 'error' && (
        <div className="pd-status" role="alert">
          <h1>{title}</h1>
          <p>The product details couldn’t be loaded.</p>
          <button type="button" className="text-button" onClick={retry}>
            Try again
          </button>
        </div>
      )}
      {state.status === 'ready' && (
        <>
          {state.detail.key === 'software' && <SoftwareProductDetail detail={state.detail} />}
          {state.detail.key === 'templates' && <TemplateProductDetail detail={state.detail} />}
          {state.detail.key === 'hardware' && <HardwareProductDetail detail={state.detail} />}
          <ProductClosing detail={state.detail} />
        </>
      )}
    </div>
  );
}
