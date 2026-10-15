import { Icon } from '@/ui/components/Icon';
import { PRODUCT_COPY } from '@/constants/pages';
import { useProductPanels } from '@/hooks/useProductPanels';
import { PRODUCT_PAGES } from '@/router/navigation';
import { PageLink } from '@/ui/components/PageLink';
import { PRODUCT_ART } from '@/utils/productArt';
import { ProductArtwork } from './ProductArtwork';

const LEADS = [PRODUCT_COPY.software, PRODUCT_COPY.templates, PRODUCT_COPY.hardware] as const;

export function ProductPanels() {
  const { active, setActive, enter, press, choose } = useProductPanels();
  return (
    <ul className="product-panels" aria-label="Product categories">
      {PRODUCT_PAGES.map((item, index) => {
        const art = PRODUCT_ART[index];
        const open = index === active;
        return (
          <li key={item.to} className="product-panel" data-open={open ? '' : undefined}>
            <PageLink
              to={item.to}
              className="product-panel-link"
              aria-describedby={`product-panel-${index}`}
              onPointerEnter={(event) => enter(index, event)}
              onPointerDown={press}
              onFocus={(event) => {
                if (event.currentTarget.matches(':focus-visible')) setActive(index);
              }}
              onClick={(event) => choose(index, event)}
            >
              <span className="product-panel-head" aria-hidden="true">
                <span className="product-panel-rule" />
                <span className="product-panel-gap" />
                <span className="product-panel-number">{String(index + 1).padStart(2, '0')}</span>
              </span>
              <span className="product-panel-status" data-status={LEADS[index]?.status}>
                {LEADS[index]?.status === 'available' ? 'Available' : 'Coming soon'}
              </span>
              {art && <ProductArtwork art={art} id={`product-art-${index}`} />}
              <span className="product-panel-copy">
                <span className="product-panel-title">{item.label}</span>
                <span className="product-panel-more">
                  <span>
                    <span className="product-panel-lead" id={`product-panel-${index}`}>
                      {LEADS[index]?.lead}
                    </span>
                    <span className="text-button product-panel-cta" aria-hidden="true">
                      Explore <Icon name="arrow" className="inline-icon" />
                    </span>
                  </span>
                </span>
              </span>
            </PageLink>
          </li>
        );
      })}
    </ul>
  );
}
