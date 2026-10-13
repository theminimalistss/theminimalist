import type { TestimonialMedia } from '@/types/testimonial';

const SIZES = '(max-width: 767px) 48vw, 300px';

type Props = { media: TestimonialMedia; echo?: boolean; autoPlay?: boolean; sizes?: string };

export function TestimonialMediaView({
  media,
  echo = false,
  autoPlay = false,
  sizes = SIZES,
}: Props) {
  const image = media.type === 'image' ? media.image : media.poster;
  return (
    <>
      <picture>
        <source
          type="image/avif"
          srcSet={`${image.srcSmall} 480w, ${image.src} 960w`}
          sizes={sizes}
        />
        <img
          src={image.webpSmall}
          srcSet={`${image.webpSmall} 480w, ${image.webp} 960w`}
          sizes={sizes}
          alt=""
          width="480"
          height="600"
          loading={autoPlay ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
        />
      </picture>
      {media.type === 'video' && !echo && (
        <video
          data-testimonial-video=""
          muted
          loop
          playsInline
          autoPlay={autoPlay}
          preload={autoPlay ? 'metadata' : 'none'}
          poster={image.webpSmall}
        >
          <source src={media.src} type="video/webm" />
          <source src={media.mp4} type="video/mp4" />
        </video>
      )}
    </>
  );
}
