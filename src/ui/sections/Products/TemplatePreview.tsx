import type { ReactNode } from 'react';
import type { TemplateLayout } from '@/types/template';

const lines = (x: number, y: number, widths: number[], gap = 10) =>
  widths.map((width, index) => (
    <path
      key={`${x}-${y}-${index}`}
      className="template-ink"
      d={`M${x} ${y + index * gap}h${width}`}
    />
  ));

const image = (x: number, y: number, width: number, height: number) => (
  <rect
    key={`${x}-${y}`}
    className="template-image"
    x={x}
    y={y}
    width={width}
    height={height}
    rx="2"
  />
);

const LAYOUTS: Record<TemplateLayout, ReactNode> = {
  portfolio: (
    <>
      {lines(36, 62, [90])}
      {image(36, 80, 104, 70)}
      {image(150, 80, 104, 110)}
      {image(264, 80, 100, 56)}
      {image(36, 160, 104, 98)}
      {image(150, 200, 104, 58)}
      {image(264, 146, 100, 112)}
    </>
  ),
  shop: (
    <>
      {lines(36, 62, [70])}
      {[0, 1, 2].flatMap((column) =>
        [0, 1].map((row) => (
          <g key={`${column}-${row}`}>
            {image(36 + column * 112, 78 + row * 96, 96, 64)}
            {lines(36 + column * 112, 152 + row * 96, [70, 40], 8)}
          </g>
        )),
      )}
    </>
  ),
  menu: (
    <>
      {image(36, 58, 328, 70)}
      {[0, 1].map((column) => (
        <g key={column}>
          {lines(36 + column * 172, 146, [60])}
          {[0, 1, 2, 3, 4].map((row) => (
            <path
              key={row}
              className="template-ink template-ink--leader"
              d={`M${36 + column * 172} ${166 + row * 18}h140`}
            />
          ))}
        </g>
      ))}
    </>
  ),
  journal: (
    <>
      {lines(120, 70, [160, 110], 14)}
      {image(120, 104, 160, 60)}
      {lines(120, 182, [160, 150, 160, 120, 156, 90], 12)}
      {lines(36, 104, [56, 40, 48], 12)}
    </>
  ),
  services: (
    <>
      {lines(36, 74, [150, 120, 90], 14)}
      <rect className="template-button" x="36" y="122" width="64" height="16" rx="2" />
      {image(214, 58, 150, 100)}
      {[0, 1, 2].map((column) => (
        <g key={column}>
          <rect
            className="template-card-block"
            x={36 + column * 112}
            y="178"
            width="96"
            height="80"
            rx="2"
          />
          {lines(48 + column * 112, 196, [60, 70, 50], 12)}
        </g>
      ))}
    </>
  ),
  editorial: (
    <>
      {image(36, 58, 328, 120)}
      {lines(36, 196, [200, 150], 16)}
      {lines(36, 236, [130, 120], 10)}
      {lines(208, 236, [150, 110], 10)}
    </>
  ),
};

export function TemplatePreview({ layout }: { layout: TemplateLayout }) {
  return (
    <svg className="template-preview" viewBox="0 0 400 290" aria-hidden="true">
      <rect className="template-frame" x="16" y="14" width="368" height="262" rx="3" />
      <path className="template-ink" d="M16 40h368" />
      {[30, 42, 54].map((x) => (
        <circle key={x} className="template-ink" cx={x} cy="27" r="3" />
      ))}
      <rect className="template-ink" x="120" y="22" width="160" height="10" rx="5" />
      <g className="template-layout">{LAYOUTS[layout]}</g>
    </svg>
  );
}
