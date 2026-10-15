import type { BrandingService } from '@/types/service';
import { useId } from 'react';
import { useBrandDisclosure } from '@/hooks/useBrandDisclosure';
import { Icon } from '@/ui/components/Icon';
import { ServiceSymbol } from './ServiceArtwork';
import { ServiceHeading, ServiceTitle } from './ServicePrimitives';

function BrandBoard({ detail }: { detail: BrandingService }) {
  const { preview } = detail;
  return (
    <figure
      data-service-scene=""
      data-reveal="item"
      className="sd-brand-board"
      aria-label="Illustrative brand identity"
    >
      <div className="sd-brand-materials">
        <div className="sd-brand-wordmark sd-ambient">
          <ServiceSymbol name="mark" />
          <span className="serif">
            {preview.name}
            <span>.</span>
          </span>
          <span>{preview.tagline}</span>
        </div>
        <div className="sd-brand-card sd-ambient">
          <span className="serif">
            {preview.monogram}
            <span>.</span>
          </span>
          <span className="eyebrow">{preview.note}</span>
        </div>
        <div className="sd-brand-swatch" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="sd-brand-tag sd-ambient">
          <span className="sd-tag-hole" aria-hidden="true" />
          <span className="serif">{preview.name}</span>
          <span>{preview.tagline}</span>
        </div>
        <div className="sd-brand-type sd-ambient">
          <span className="serif">Aa.</span>
          <span className="eyebrow">Colour / Type / Character</span>
        </div>
      </div>
      <figcaption>{preview.caption}</figcaption>
    </figure>
  );
}

const SYMBOLS = ['mark', 'type', 'box', 'social', 'print', 'book'] as const;

function BrandDeliverables({ detail }: { detail: BrandingService }) {
  const id = useId();
  const items = detail.capabilities.items;
  const { ref, active, choices, choose } = useBrandDisclosure(items.length);
  return (
    <div ref={ref} className="sd-brand-accordions" role="group" aria-label="Brand deliverables">
      {choices.map((selected, row) => {
        const item = items[selected]!;
        const open = active !== null && Math.floor(active / 2) === row;
        return (
          <div className="sd-brand-row" key={row} data-reveal="item">
            {items.slice(row * 2, row * 2 + 2).map((item, offset) => {
              const index = row * 2 + offset;
              return (
                <button
                  type="button"
                  key={item.title}
                  id={`${id}-item-${index}`}
                  className="sd-brand-choice"
                  data-service-scene=""
                  aria-expanded={active === index}
                  aria-controls={`${id}-panel-${row}`}
                  onClick={() => choose(index)}
                >
                  <ServiceSymbol name={SYMBOLS[index % SYMBOLS.length]!} />
                  <span>{item.title}</span>
                  <Icon name="plus" />
                </button>
              );
            })}
            <div
              id={`${id}-panel-${row}`}
              className="sd-brand-drawer"
              data-brand-drawer=""
              data-open={open ? '' : undefined}
              role="region"
              aria-labelledby={`${id}-item-${selected}`}
              aria-hidden={!open}
              inert={!open}
            >
              <div className="sd-brand-drawer-inner">
                <div className="sd-brand-drawer-copy" key={selected}>
                  <p>{item.text}</p>
                  <ul className="sd-tags">
                    {item.items.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BrandingDetail({ detail }: { detail: BrandingService }) {
  return (
    <>
      <div className="sd-brand-hero sd-pad">
        <ServiceTitle detail={detail} />
        <BrandBoard detail={detail} />
      </div>
      <p className="sd-fit sd-pad" data-reveal="item" data-service-scene="">
        <span className="eyebrow">A good fit for</span>
        {detail.fit}
      </p>
      <section
        className="sd-brand-process sd-pad"
        aria-labelledby="branding-process"
        data-service-scene=""
      >
        <ServiceHeading id="branding-process" eyebrow="More than a logo" {...detail.process} />
        <ol data-reveal="stagger">
          {detail.process.steps.map((step, index) => (
            <li key={step.title}>
              <ServiceSymbol name={(['compass', 'mark', 'layers'] as const)[index]!} />
              <span className="eyebrow">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="sd-brand-deliverables sd-pad" aria-labelledby="branding-capabilities">
        <ServiceHeading
          id="branding-capabilities"
          eyebrow="What we can shape"
          title={detail.capabilities.title}
          accent={detail.capabilities.accent}
        />
        <div className="sd-brand-inclusions">
          <BrandDeliverables detail={detail} />
          <aside
            className="sd-brand-guide"
            aria-labelledby="branding-handover"
            data-reveal="item"
            data-service-scene=""
          >
            <div className="sd-guide-cover sd-ambient" aria-hidden="true">
              <span className="eyebrow">A considered identity</span>
              <span className="serif">
                The
                <br />
                brand
                <br />
                <em>book.</em>
              </span>
              <span className="eyebrow">Clarity / Character / Consistency</span>
            </div>
            <h2 id="branding-handover">{detail.handover.title}</h2>
            <p>{detail.handover.text}</p>
            <ul>
              {detail.handover.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
