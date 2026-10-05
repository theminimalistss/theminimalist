import { useState } from 'react';
import type { ImageSources } from '@/types/work';

type Props = {
  image: ImageSources;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  preview?: boolean;
};

export function WorkImage({
  image,
  alt,
  priority = false,
  className = '',
  sizes = '(max-width: 767px) calc(100vw - 48px), (max-width: 1099px) 44vw, 30vw',
  preview = false,
}: Props) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div
        className={`media-fallback ${className}`}
        role="img"
        aria-label={`${alt} Preview unavailable.`}
      >
        <span>TM — Design study</span>
      </div>
    );

  return (
    <picture className={`work-image ${className}`}>
      {!preview && (
        <source
          type="image/avif"
          srcSet={`${image.srcSmall} 480w, ${image.src} 960w`}
          sizes={sizes}
        />
      )}
      <img
        src={preview ? image.webpSmall : image.webp}
        srcSet={preview ? undefined : `${image.webpSmall} 480w, ${image.webp} 960w`}
        sizes={sizes}
        alt={alt}
        width="960"
        height="1200"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onError={() => setFailed(true)}
      />
    </picture>
  );
}
