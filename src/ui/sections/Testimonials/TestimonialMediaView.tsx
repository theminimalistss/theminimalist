import type { TestimonialMedia } from '@/types/testimonial';

const SIZES = '(max-width: 767px) 44vw, 240px';

type Props = { media: TestimonialMedia; echo: boolean; autoPlay?: boolean };

export function TestimonialMediaView({ media, echo, autoPlay = false }: Props) {
  const image = media.type === 'image' ? media.image : media.poster;
  return (
    <span className="testimonial-media">
      <picture>
        <source
          type="image/avif"
          srcSet={`${image.srcSmall} 480w, ${image.src} 960w`}
          sizes={SIZES}
        />
        <img
          src={image.webpSmall}
          srcSet={`${image.webpSmall} 480w, ${image.webp} 960w`}
          sizes={SIZES}
          alt=""
          width="480"
          height="600"
          loading="lazy"
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
          preload={autoPlay ? 'auto' : 'none'}
          poster={image.webpSmall}
        >
          <source src={media.src} type="video/webm" />
          <source src={media.mp4} type="video/mp4" />
        </video>
      )}
    </span>
  );
}
