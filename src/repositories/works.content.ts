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
const collection = { ...base, featured: false };

export const works = [
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
  {
    ...collection,
    id: 'terra',
    slug: 'terra-ceramics',
    title: 'Terra',
    category: 'Packaging & identity',
    tagline: 'Made of earth, made to keep.',
    order: 6,
    artDirection: 'solenne',
    alt: 'Pastel ceramic vases holding dried grasses on a soft linen surface.',
    description:
      'A packaging and identity study for a small ceramics studio. Soft glazes, honest forms, and labels that feel made by hand.',
    mediaType: 'image',
    image: image('terra'),
  },
  {
    ...collection,
    id: 'lumen',
    slug: 'lumen-focus',
    title: 'Lumen',
    category: 'Software product',
    tagline: 'Work in better light.',
    order: 7,
    artDirection: 'ink',
    alt: 'The shadow of a palm sways across a warm, sunlit wall.',
    description:
      'A software concept for a calm focus app. The interface follows the light of the day, with fewer alerts and more room to think.',
    mediaType: 'video',
    src: asset('videos/hero/lumen.webm'),
    mp4: asset('videos/hero/lumen.mp4'),
    poster: image('lumen-poster'),
  },
  {
    ...collection,
    id: 'folio',
    slug: 'folio-press',
    title: 'Folio',
    category: 'Editorial website',
    tagline: 'Words, given room.',
    order: 8,
    artDirection: 'arc',
    alt: 'A blank sheet of white paper beside a black pen on a grey surface.',
    description:
      'An editorial website study for an independent publisher. Generous margins, quiet typography, and reading that feels like paper.',
    mediaType: 'image',
    image: image('folio'),
  },
  {
    ...collection,
    id: 'grain',
    slug: 'grain-bakery',
    title: 'Grain',
    category: 'Brand & website',
    tagline: 'Slow bread, honest crust.',
    order: 9,
    artDirection: 'wild',
    alt: 'Floured hands knead soft dough on a dusted work surface.',
    description:
      'A brand and ordering website for a neighbourhood bakery. Warm textures, a daily menu, and pickup arranged in a few taps.',
    mediaType: 'video',
    src: asset('videos/hero/grain.webm'),
    mp4: asset('videos/hero/grain.mp4'),
    poster: image('grain-poster'),
  },
  {
    ...collection,
    id: 'linnea',
    slug: 'linnea-linen',
    title: 'Linnea',
    category: 'E-commerce',
    tagline: 'Wear it softly.',
    order: 10,
    artDirection: 'forma',
    alt: 'Linen garments hang on wooden hangers in a softly lit wardrobe.',
    description:
      'An e-commerce study for a linen label. Natural textures, unhurried product pages, and a checkout that stays out of the way.',
    mediaType: 'image',
    image: image('linnea'),
  },
  {
    ...collection,
    id: 'haven',
    slug: 'haven-retreat',
    title: 'Haven',
    category: 'Booking platform',
    tagline: 'Arrive somewhere quiet.',
    order: 11,
    artDirection: 'ink',
    alt: 'A sheer white curtain moves softly in warm morning light.',
    description:
      'A booking platform concept for a concrete retreat. Clear availability, calm imagery, and a stay planned in minutes.',
    mediaType: 'video',
    src: asset('videos/hero/haven.webm'),
    mp4: asset('videos/hero/haven.mp4'),
    poster: image('haven-poster'),
  },
] satisfies Work[];
