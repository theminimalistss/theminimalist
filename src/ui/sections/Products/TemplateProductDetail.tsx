import type { TemplateProduct } from '@/types/product';
import { useProductPreview } from '@/hooks/useProductPreview';
import { Icon } from '@/ui/components/Icon';
import { TemplatePreview } from './TemplatePreview';
import { TemplateCatalog } from './TemplateCatalog';
import { ProductChoices, ProductIntro, ProductNotes } from './ProductDetailPrimitives';

export function TemplateProductDetail({ detail }: { detail: TemplateProduct }) {
  const { layout, setLayout } = useProductPreview();
  const active = detail.views.find((item) => item.id === layout)!;
  return (
    <>
      <section className="pd-template-hero pd-pad">
        <ProductIntro detail={detail}>
          <a href="#template-collection" className="text-button">
            Explore the collection <Icon name="arrow" className="inline-icon" />
          </a>
        </ProductIntro>
        <figure
          className="pd-template-study"
          aria-label="Template layout study"
          data-product-scene=""
        >
          <div className="pd-template-paper pd-idle">
            <span className="pd-paper-edition eyebrow">
              Layout studies / 0{detail.views.indexOf(active) + 1}
            </span>
            <div className="pd-paper-window" key={layout}>
              <TemplatePreview layout={layout} />
            </div>
            <span className="pd-paper-title">{active.title}</span>
            <span className="pd-paper-foot eyebrow">The Minimalist / Digital editions</span>
          </div>
          <div className="pd-template-study-controls">
            <ProductChoices
              label="Explore template layouts"
              choices={detail.views}
              selected={layout}
              choose={setLayout}
            />
            <p role="status">{active.text}</p>
          </div>
          <figcaption>{detail.notice}</figcaption>
        </figure>
      </section>
      <section id="template-collection" className="pd-template-collection pd-pad">
        <header className="pd-collection-heading" data-reveal="item">
          <div>
            <p className="eyebrow">The collection / 01—06</p>
            <h2>{detail.collection.title}</h2>
          </div>
          <p>{detail.collection.text}</p>
        </header>
        <TemplateCatalog />
      </section>
      <section className="pd-template-making pd-pad">
        <div data-reveal="item">
          <p className="eyebrow">From a starting point to your own</p>
          <h2>{detail.section.title}</h2>
          <p>{detail.section.text}</p>
        </div>
        <ProductNotes notes={detail.steps} label="Making a template your own" />
      </section>
    </>
  );
}
