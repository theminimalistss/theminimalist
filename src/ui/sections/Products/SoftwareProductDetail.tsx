import type { SoftwareProduct, SoftwareView } from '@/types/product';
import { useProductPreview } from '@/hooks/useProductPreview';
import { Icon } from '@/ui/components/Icon';
import { ProductChoices, ProductIntro, ProductNotes } from './ProductDetailPrimitives';

function WorkspaceDrawing({ view, items }: { view: SoftwareView; items: readonly string[] }) {
  return (
    <div className="pd-workspace-content" key={view} aria-hidden="true">
      {view === 'organise' && (
        <div className="pd-task-board">
          {items.map((item, index) => (
            <div className="pd-task pd-idle" key={item}>
              <span className="pd-task-dot" />
              <span>{item}</span>
              <span className="pd-task-lines">
                <i />
                <i />
              </span>
              <span className="pd-task-tag">0{index + 1}</span>
            </div>
          ))}
        </div>
      )}
      {view === 'connect' && (
        <div className="pd-connection-map">
          <svg viewBox="0 0 440 210">
            <path className="pd-flow-line pd-idle" d="M106 105H186M249 85 330 38M249 125 330 172" />
            <circle cx="220" cy="105" r="34" />
            <path className="pd-map-check" d="m205 105 10 10 20-22" />
            {(
              [
                [10, 82],
                [330, 15],
                [330, 149],
              ] as const
            ).map(([x, y], index) => (
              <g className="pd-map-node" key={index}>
                <rect x={x} y={y} width="100" height="46" />
                <text x={x + 50} y={y + 27} textAnchor="middle">
                  {items[index]}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
      {view === 'understand' && (
        <div className="pd-insight">
          <div className="pd-insight-chart">
            {[38, 62, 48, 76, 66, 92, 80].map((height, index) => (
              <span className="pd-idle" key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="pd-insight-keys">
            {items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SoftwareProductDetail({ detail }: { detail: SoftwareProduct }) {
  const { workspace, setWorkspace } = useProductPreview();
  const active = detail.views.find((item) => item.id === workspace)!;
  return (
    <>
      <section className="pd-software-hero pd-pad">
        <ProductIntro detail={detail}>
          <a href="#software-principles" className="pd-inline-link">
            Designed around your day <Icon name="arrow-right" />
          </a>
        </ProductIntro>
        <figure
          className="pd-workspace-figure"
          aria-label="Software workspace study"
          data-product-scene=""
        >
          <div className="pd-workspace">
            <div className="pd-workspace-toolbar">
              <span className="pd-window-dots" />
              <span className="eyebrow">The everyday workspace</span>
              <Icon name="grid" />
            </div>
            <div className="pd-workspace-body">
              <aside className="pd-workspace-sidebar" aria-hidden="true">
                <span className="pd-workspace-mark">m.</span>
                <i />
                <i />
                <i />
                <i />
                <span className="pd-sidebar-foot" />
              </aside>
              <div className="pd-workspace-main">
                <p className="eyebrow">A little space for what matters</p>
                <h2>{active.title}</h2>
                <WorkspaceDrawing view={workspace} items={active.items} />
                <ProductChoices
                  label="Explore software concepts"
                  choices={detail.views}
                  selected={workspace}
                  choose={setWorkspace}
                />
              </div>
            </div>
          </div>
          <div className="pd-preview-caption" role="status">
            <span className="pd-index">0{detail.views.indexOf(active) + 1}</span>
            <p key={workspace}>{active.text}</p>
          </div>
          <figcaption>{detail.notice}</figcaption>
        </figure>
      </section>
      <section className="pd-software-principles pd-pad" id="software-principles">
        <div className="pd-software-manifesto" data-product-scene="">
          <svg className="pd-orbit-art" viewBox="0 0 240 240" aria-hidden="true">
            <circle cx="120" cy="120" r="89" />
            <ellipse className="pd-idle" cx="120" cy="120" rx="89" ry="34" />
            <ellipse cx="120" cy="120" rx="34" ry="89" />
            <path d="M31 120h178M120 31v178" />
            <circle className="pd-orbit-dot pd-idle" cx="120" cy="31" r="6" />
          </svg>
          <div data-reveal="item">
            <p className="eyebrow">The product philosophy</p>
            <h2>{detail.section.title}</h2>
            <p>{detail.section.text}</p>
          </div>
        </div>
        <ProductNotes notes={detail.steps} label="Software product principles" />
      </section>
    </>
  );
}
