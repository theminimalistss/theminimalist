import type { HardwarePart, HardwareProduct } from '@/types/product';
import { useProductPreview } from '@/hooks/useProductPreview';
import { ProductChoices, ProductIntro, ProductNotes } from './ProductDetailPrimitives';

function ObjectDrawing({ part, exploded }: { part: HardwarePart; exploded: boolean }) {
  return (
    <svg
      className="pd-object"
      data-part={part}
      data-exploded={exploded ? '' : undefined}
      viewBox="0 0 600 520"
      aria-hidden="true"
    >
      <path
        className="pd-object-axis"
        d="M300 65v410M70 305l230 122 230-122M70 197l230-122 230 122"
      />
      <ellipse className="pd-object-shadow" cx="300" cy="440" rx="164" ry="24" />
      <g className="pd-object-drift pd-idle">
        <g className="pd-object-layer pd-object-base" data-object-part="base">
          <path
            className="pd-object-side"
            d="m130 268 170 90v18l-170-90Zm170 90 170-90v18l-170 90Z"
          />
          <path className="pd-object-face" d="m130 268 170-90 170 90-170 90Z" />
          <path className="pd-object-detail" d="m157 268 143-75 143 75-143 75Z" />
          {(
            [
              [-111, 0],
              [111, 0],
              [0, 59],
              [0, -59],
            ] as const
          ).map(([x, y], index) => (
            <ellipse key={index} cx={300 + x} cy={268 + y} rx="5" ry="2.5" />
          ))}
        </g>
        <g className="pd-object-layer pd-object-core" data-object-part="core">
          <path className="pd-object-board" d="m160 248 140-74 140 74-140 74Z" />
          <path
            className="pd-circuit"
            d="m192 247 108-57 108 57M192 247l108 57 108-57M215 235l85 45 85-45M240 222l60 31 60-31M300 190v31m0 59v24m-79-71 25-13m108 0 25 13"
          />
          <path className="pd-object-chip" d="m262 243 38-20 38 20-38 20Z" />
          <path className="pd-object-detail" d="m278 243 22-11 22 11-22 11Z" />
          <path className="pd-object-detail" d="m184 247 14 7m205-14 14 7m-124 50 14 7" />
        </g>
        <g className="pd-object-layer pd-object-shell" data-object-part="shell">
          <path
            className="pd-object-side"
            d="m130 218 170 90v45l-170-90Zm170 90 170-90v45l-170 90Z"
          />
          <path className="pd-object-face" d="m130 218 170-90 170 90-170 90Z" />
          <path className="pd-object-detail" d="m152 218 148-78 148 78-148 78Z" />
          <ellipse className="pd-object-dial" cx="300" cy="216" rx="39" ry="21" />
          <ellipse className="pd-object-detail" cx="300" cy="213" rx="27" ry="14" />
          <path
            className="pd-object-detail"
            d="m286 209 14 7 14-7M300 216v10m-130 16 39 20m-39-12 39 20"
          />
          <path className="pd-object-port" d="m367 292 35-18v9l-35 18Z" />
          <circle className="pd-object-light" cx="425" cy="269" r="3" />
        </g>
      </g>
      <g className="pd-object-rulers">
        <path d="m105 289-28 16 198 105 28-16M105 279l-15 8m25 8-15 8m25 8-15 8m25 8-15 8m25 8-15 8" />
        <path d="m487 240 35 18v134m-8-130h16m-16 130h16" />
      </g>
    </svg>
  );
}

export function HardwareProductDetail({ detail }: { detail: HardwareProduct }) {
  const { part, setPart, exploded, setExploded } = useProductPreview();
  const active = detail.parts.find((item) => item.id === part)!;
  return (
    <>
      <section className="pd-hardware-hero pd-pad">
        <ProductIntro detail={detail} />
        <figure
          className="pd-object-study"
          aria-label="Hardware object study"
          data-product-scene=""
        >
          <div className="pd-object-toolbar">
            <span className="eyebrow">Object 001 / An exploration</span>
            <div className="pd-choices" role="group" aria-label="Object assembly">
              <button type="button" aria-pressed={exploded} onClick={() => setExploded(true)}>
                Exploded
              </button>
              <button type="button" aria-pressed={!exploded} onClick={() => setExploded(false)}>
                Assembled
              </button>
            </div>
          </div>
          <div className="pd-object-stage">
            <ObjectDrawing part={part} exploded={exploded} />
            <div className="pd-object-caption">
              <span className="eyebrow">
                0{detail.parts.indexOf(active) + 1} / {active.material}
              </span>
              <div role="status" key={part}>
                <h2>{active.title}</h2>
                <p>{active.text}</p>
              </div>
              <ProductChoices
                label="Explore object components"
                choices={detail.parts}
                selected={part}
                choose={setPart}
              />
              <span className="pd-object-hint">Select a layer. See how it belongs.</span>
            </div>
          </div>
          <figcaption>{detail.notice}</figcaption>
        </figure>
      </section>
      <section className="pd-hardware-notes pd-pad">
        <div className="pd-hardware-note-heading" data-reveal="item">
          <p className="eyebrow">The details are the design</p>
          <h2>{detail.section.title}</h2>
          <p>{detail.section.text}</p>
        </div>
        <ProductNotes notes={detail.steps} label="Hardware product considerations" />
      </section>
    </>
  );
}
