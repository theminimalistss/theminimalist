import { useServicePreview } from '@/hooks/useServicePreview';
import type { SoftwareService } from '@/types/service';
import { Icon } from '@/ui/components/Icon';
import { PlatformDrawing, ServiceSymbol, SystemDrawing } from './ServiceArtwork';
import { ServiceHeading, ServiceTitle } from './ServicePrimitives';

function PlatformExplorer({ detail }: { detail: SoftwareService }) {
  const { platform, setPlatform } = useServicePreview();
  const active = detail.preview.platforms.find((item) => item.id === platform)!;
  return (
    <figure
      className="sd-platform-explorer"
      aria-label="Software platforms illustration"
      data-service-scene=""
      data-reveal="item"
    >
      <div className="sd-platform-head">
        <span className="eyebrow">{detail.preview.name}</span>
        <span className="sd-platform-count">
          0{detail.preview.platforms.indexOf(active) + 1} / 05
        </span>
      </div>
      <div className="sd-platform-stage">
        <PlatformDrawing platform={platform} />
      </div>
      <div className="sd-platform-options" role="group" aria-label="Software platforms">
        {detail.preview.platforms.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={platform === item.id}
            onClick={() => setPlatform(item.id)}
          >
            <ServiceSymbol name={item.id} />
            <span>{item.title}</span>
          </button>
        ))}
      </div>
      <div className="sd-platform-copy" role="status" aria-atomic="true" key={platform}>
        <p>{active.text}</p>
        <ul className="sd-tags">
          {active.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <figcaption>{detail.preview.caption}</figcaption>
    </figure>
  );
}

const SYMBOLS = ['layers', 'api', 'desktop'] as const;

export function SoftwareDetail({ detail }: { detail: SoftwareService }) {
  return (
    <>
      <div className="sd-software-hero sd-pad">
        <ServiceTitle detail={detail} />
        <PlatformExplorer detail={detail} />
      </div>
      <section className="sd-software-capabilities sd-pad" aria-labelledby="software-capabilities">
        <ServiceHeading
          eyebrow="What we make possible"
          id="software-capabilities"
          title={detail.capabilities.title}
          accent={detail.capabilities.accent}
        />
        <div className="sd-capability-tiles" data-reveal="stagger">
          {detail.capabilities.items.map((item, index) => (
            <article key={item.title} data-service-scene="">
              <ServiceSymbol name={SYMBOLS[index % SYMBOLS.length]!} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <ul className="sd-tags">
                {item.items.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section
        className="sd-software-system sd-pad"
        aria-labelledby="software-process"
        data-service-scene=""
      >
        <div className="sd-system-visual" data-reveal="item">
          <span className="eyebrow">Experience / Logic / Connections</span>
          <SystemDrawing />
          <h2 className="serif">{detail.handover.title}</h2>
          <p>{detail.handover.text}</p>
          <ul className="sd-handover-chips">
            {detail.handover.items.map((item) => (
              <li key={item}>
                <Icon name="check" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="sd-system-process" data-reveal="stagger">
          <ServiceHeading
            id="software-process"
            eyebrow="How we build"
            title={detail.process.title}
            accent={detail.process.accent}
          />
          <ol className="sd-delivery-rail">
            {detail.process.steps.map((step, index) => (
              <li key={step.title}>
                <span className="serif">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
