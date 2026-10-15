import { useServicePreview } from '@/hooks/useServicePreview';
import type { WebsiteService } from '@/types/service';
import { WorkImage } from '@/ui/components/WorkImage';
import { ServiceSymbol } from './ServiceArtwork';
import { ServiceHeading, ServiceTitle } from './ServicePrimitives';

function WebsitePreview({ detail }: { detail: WebsiteService }) {
  const { viewport, setViewport } = useServicePreview();
  return (
    <figure
      className="sd-website-preview"
      data-service-scene=""
      data-reveal="item"
      aria-label="Responsive website illustration"
      data-viewport={viewport}
    >
      <div className="sd-preview-toolbar">
        <span className="eyebrow">One identity. Every screen.</span>
        <div role="group" aria-label="Preview screen size">
          <button
            type="button"
            aria-pressed={viewport === 'desktop'}
            onClick={() => setViewport('desktop')}
          >
            Desktop
          </button>
          <button
            type="button"
            aria-pressed={viewport === 'mobile'}
            onClick={() => setViewport('mobile')}
          >
            Mobile
          </button>
        </div>
      </div>
      <div className="sd-browser-stage">
        <div className="sd-browser sd-ambient">
          <div className="sd-browser-bar" aria-hidden="true">
            <span className="sd-window-dots">
              <i />
              <i />
              <i />
            </span>
            <span>your own corner of the internet</span>
          </div>
          <div className="sd-sample-site">
            <div className="sd-sample-site-nav">
              <span>{detail.preview.name}</span>
              <span aria-hidden="true">Objects & living</span>
            </div>
            <div className="sd-sample-site-main">
              <div>
                <span className="eyebrow">Less, but considered.</span>
                <p className="serif">{detail.preview.headline}</p>
                <span className="sd-sample-site-line">{detail.preview.text}</span>
                <span className="sd-sample-site-rule" aria-hidden="true" />
              </div>
              <WorkImage
                image={detail.preview.image}
                alt="A light-filled interior with natural textures, used as sample website imagery."
                priority
                sizes="(max-width: 600px) 65vw, 420px"
              />
            </div>
            <div className="sd-sample-site-foot" aria-hidden="true">
              <span>Considered design</span>
              <span>Room to breathe</span>
              <span>Made for everyday</span>
            </div>
          </div>
        </div>
        <span className="sd-browser-side-note eyebrow" aria-hidden="true">
          Designed to feel like you.
        </span>
      </div>
      <figcaption>
        <span role="status" className="sr-only">
          {viewport === 'desktop' ? 'Desktop' : 'Mobile'} layout preview
        </span>
        {detail.preview.caption}
      </figcaption>
    </figure>
  );
}

const SYMBOLS = ['web', 'shop', 'compass'] as const;

export function WebsiteDetail({ detail }: { detail: WebsiteService }) {
  return (
    <>
      <div className="sd-website-hero sd-pad">
        <ServiceTitle detail={detail} />
        <p className="sd-website-fit" data-reveal="item">
          {detail.fit}
        </p>
      </div>
      <div className="sd-pad">
        <WebsitePreview detail={detail} />
      </div>
      <section className="sd-website-chapters sd-pad" aria-labelledby="website-capabilities">
        <ServiceHeading
          id="website-capabilities"
          eyebrow="The whole experience"
          title={detail.capabilities.title}
          accent={detail.capabilities.accent}
        />
        <div className="sd-chapters">
          {detail.capabilities.items.map((item, index) => (
            <article key={item.title} data-reveal="item" data-service-scene="">
              <ServiceSymbol name={SYMBOLS[index % SYMBOLS.length]!} />
              <div className="sd-chapter-name">
                <span className="eyebrow">0{index + 1}</span>
                <h3>{item.title}</h3>
              </div>
              <div>
                <p>{item.text}</p>
                <ul>
                  {item.items.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        className="sd-website-process sd-pad"
        aria-labelledby="website-process"
        data-service-scene=""
      >
        <ServiceHeading id="website-process" eyebrow="How we get there" {...detail.process} />
        <ol className="sd-launch-strip" data-reveal="stagger">
          {detail.process.steps.map((step, index) => (
            <li key={step.title}>
              <span className="sd-step-dot" aria-hidden="true" />
              <span className="eyebrow">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section
        className="sd-website-handover sd-pad"
        aria-labelledby="website-handover"
        data-reveal="item"
        data-service-scene=""
      >
        <div>
          <span className="eyebrow">The next chapter</span>
          <h2 id="website-handover" className="serif">
            {detail.handover.title}
          </h2>
          <p>{detail.handover.text}</p>
        </div>
        <ul>
          {detail.handover.items.map((item, index) => (
            <li key={item}>
              <ServiceSymbol name={(['web', 'book', 'api', 'compass'] as const)[index % 4]!} />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
