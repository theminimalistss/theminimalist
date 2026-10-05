import type { ImageSources, Work } from '@/types/work';

const media = import.meta.glob<string>('../assets/**/*.{avif,webp,webm,mp4}', {
  eager: true,
  query: '?url',
  import: 'default',
});

function asset(path: string): string {
  const url = media[`../assets/${path}`];
  if (!url) throw new Error(`Missing local work asset: ${path}`);
  return url;
}

function image(name: string): ImageSources {
  return {
    src: asset(`images/hero/${name}-960.avif`),
    srcSmall: asset(`images/hero/${name}-480.avif`),
    webp: asset(`images/hero/${name}-960.webp`),
    webpSmall: asset(`images/hero/${name}-480.webp`),
  };
}

const base = { year: 2026, featured: true, isConcept: true, width: 960, height: 1200 };

export const featuredWorks = [
  {
    ...base,
    id: 'forma',
    slug: 'forma-living',
    title: 'Forma',
    category: 'Brand identity',
    tagline: 'A quieter way of living.',
    order: 0,
    artDirection: 'forma',
    alt: 'A warm, minimal living room with a sculptural sofa and natural materials.',
    description:
      'An identity study for a considered approach to living. Architectural typography meets tactile materials and a softer sense of space.',
    mediaType: 'image',
    image: image('forma'),
  },
  {
    ...base,
    id: 'still',
    slug: 'still-retreat',
    title: 'Still',
    category: 'Digital experience',
    tagline: 'Somewhere to simply be.',
    order: 1,
    artDirection: 'still',
    alt: 'Ocean waves roll onto a quiet sandy shore, viewed from above.',
    description:
      'A digital hospitality study inspired by the rhythm of the coast. A spacious visual language that gives a place room to breathe.',
    mediaType: 'video',
    src: asset('videos/hero/still.webm'),
    mp4: asset('videos/hero/still.mp4'),
    poster: image('still-poster'),
  },
  {
    ...base,
    id: 'solenne',
    slug: 'solenne-essentials',
    title: 'Solenne',
    category: 'Art direction',
    tagline: 'Everyday, intentionally.',
    order: 2,
    artDirection: 'solenne',
    alt: 'A minimal cream bottle casts a soft shadow across a sunlit beige surface.',
    description:
      'An art direction study exploring the beauty in daily rituals. Soft light, honest forms, and an understated editorial identity.',
    mediaType: 'image',
    image: image('solenne'),
  },
  {
    ...base,
    id: 'earth',
    slug: 'earth-and-hand',
    title: 'Earth & Hand',
    category: 'Brand & motion',
    tagline: 'Made slowly. Made to stay.',
    order: 3,
    artDirection: 'earth',
    alt: 'Hands carefully shape wet clay on a spinning pottery wheel.',
    description:
      'A brand and motion study celebrating the human hand. An earthy identity shaped by patience, material, and the beauty of imperfection.',
    mediaType: 'video',
    src: asset('videos/hero/earth.webm'),
    mp4: asset('videos/hero/earth.mp4'),
    poster: image('earth-poster'),
  },
  {
    ...base,
    id: 'arc',
    slug: 'arc-journal',
    title: 'Arc',
    category: 'Editorial design',
    tagline: 'A different perspective.',
    order: 4,
    artDirection: 'arc',
    alt: 'Repeating architectural arches create a sculptural rhythm of light and shadow.',
    description:
      'An editorial study at the intersection of architecture and culture. Precise grids and expressive scale make space for new perspectives.',
    mediaType: 'image',
    image: image('arc'),
  },
  {
    ...base,
    id: 'wild',
    slug: 'wild-ground',
    title: 'Wild Ground',
    category: 'Digital & motion',
    tagline: 'Rooted in something real.',
    order: 5,
    artDirection: 'wild',
    alt: 'Sunlight moves through a canopy of green forest leaves.',
    description:
      'A digital and motion study for a closer connection to nature. Organic movement and a grounded identity bring the outdoors into focus.',
    mediaType: 'video',
    src: asset('videos/hero/wild.webm'),
    mp4: asset('videos/hero/wild.mp4'),
    poster: image('wild-poster'),
  },
] satisfies Work[];
