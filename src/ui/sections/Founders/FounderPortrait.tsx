import type { Founder } from '@/constants/founders';
import { useFounderDepth } from '@/hooks/useFounderDepth';

const PORTRAIT_SIZES = '(min-width: 1100px) 340px, (min-width: 442px) 300px, 68vw';
type Props = { founder: Founder; active: boolean; onHold: (held: boolean) => void };

export function FounderPortrait({ founder, active, onHold }: Props) {
  const ref = useFounderDepth(active);
  return (
    <div
      ref={ref}
      className="founder-portrait-shell"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') onHold(true);
      }}
      onPointerLeave={() => onHold(false)}
      onPointerCancel={() => onHold(false)}
    >
      <div className="founder-portrait">
        <picture>
          <source
            type="image/avif"
            srcSet={`${founder.portrait.avifSmall} 480w, ${founder.portrait.avif} 960w`}
            sizes={PORTRAIT_SIZES}
          />
          <img
            src={founder.portrait.webp}
            srcSet={`${founder.portrait.webpSmall} 480w, ${founder.portrait.webp} 960w`}
            sizes={PORTRAIT_SIZES}
            alt={`Portrait of ${founder.name}`}
            width="960"
            height="1200"
            decoding="async"
            draggable={false}
          />
        </picture>
      </div>
    </div>
  );
}
