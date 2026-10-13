import type { TestimonialMedia } from '@/types/testimonial';
import type { ImageSources } from '@/types/work';

const files = import.meta.glob<string>(
  ['../assets/images/testimonials/*.{avif,webp}', '../assets/videos/testimonials/*.{webm,mp4}'],
  { eager: true, query: '?url', import: 'default' },
);

function asset(path: string) {
  const url = files[`../assets/${path}`];
  if (!url) throw new Error(`Missing local testimonial asset: ${path}`);
  return url;
}

function image(name: string): ImageSources {
  return {
    src: asset(`images/testimonials/${name}-960.avif`),
    srcSmall: asset(`images/testimonials/${name}-480.avif`),
    webp: asset(`images/testimonials/${name}-960.webp`),
    webpSmall: asset(`images/testimonials/${name}-480.webp`),
  };
}

function video(name: string): TestimonialMedia {
  return {
    type: 'video',
    src: asset(`videos/testimonials/${name}.webm`),
    mp4: asset(`videos/testimonials/${name}.mp4`),
    poster: image(`${name}-poster`),
  };
}

const still = (name: string): TestimonialMedia => ({ type: 'image', image: image(name) });

export const TESTIMONIAL_MEDIA: Record<string, TestimonialMedia> = {
  arkcladd: still('frame'),
  'cebu-social-club': video('toast'),
  'gibby-snaps': video('sway'),
  'good-creamery': still('pale'),
  greenmart: still('vessel'),
  'hey-lulu-pastries': video('leaves'),
  'moon-marines': still('dusk'),
  'polaris-soundworks': still('window'),
  'samfran-design-studio': video('drape'),
  'sevenstreet-bakery': still('calm'),
  'shotto-corner': still('wall'),
  'skin-sciences': video('fern'),
  snaccidents: still('linen'),
  'the-compound-court': still('page'),
};
