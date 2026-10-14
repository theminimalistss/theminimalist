import type { CSSProperties } from 'react';
import type { ProductArt } from '@/utils/productArt';

function ArtLayers({ art, solid }: { art: ProductArt; solid: boolean }) {
  let order = 0;
  return (
    <g className="product-art-body">
      {art.layers.map((layer, index) => {
        const fold = solid ? layer.fold : undefined;
        const style = fold
          ? ({
              '--fold-x': `${fold.x}px`,
              '--fold-y': `${fold.y}px`,
              '--fold-r': `${fold.rotate}deg`,
              '--fold-s': fold.scale,
              '--order': order++,
            } as CSSProperties)
          : undefined;
        return (
          <g key={index} className={fold ? 'product-art-part' : undefined} style={style}>
            {layer.faces.map((face, key) => (
              <path
                key={key}
                d={face.d}
                className={`product-art-face product-art-face--${face.tone}`}
              />
            ))}
            {layer.lines
              .filter((line) => !solid || line.tone !== 'hidden')
              .map((line, key) => (
                <path
                  key={key}
                  d={line.d}
                  className={`product-art-line product-art-line--${line.tone}`}
                />
              ))}
          </g>
        );
      })}
    </g>
  );
}

export function ProductArtwork({ art, id }: { art: ProductArt; id: string }) {
  return (
    <span className="product-panel-art" aria-hidden="true">
      <svg className="product-art product-art--wire" viewBox="0 0 600 600">
        <ArtLayers art={art} solid={false} />
      </svg>
      <svg className="product-art product-art--solid" viewBox="0 0 600 600">
        <defs>
          <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="7" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.16" />
            </feComponentTransfer>
            <feComposite in2="SourceGraphic" operator="in" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
        <g filter={`url(#${id}-grain)`}>
          <ArtLayers art={art} solid />
        </g>
      </svg>
    </span>
  );
}
