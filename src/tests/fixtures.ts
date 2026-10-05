import type { ImageSources, ImageWork, VideoWork } from '@/types/work';

export const image: ImageSources = {
  src: '/media/test-960.avif',
  srcSmall: '/media/test-480.avif',
  webp: '/media/test-960.webp',
  webpSmall: '/media/test-480.webp',
};

export const imageWork: ImageWork = {
  id: 'test',
  slug: 'test-study',
  title: 'Test study',
  category: 'Brand identity',
  year: 2026,
  alt: 'A softly lit interior.',
  description: 'A concept study.',
  tagline: 'A quieter way.',
  width: 960,
  height: 1200,
  featured: true,
  isConcept: true,
  order: 0,
  artDirection: 'forma',
  mediaType: 'image',
  image,
};

export const videoWork: VideoWork = {
  ...imageWork,
  id: 'video',
  slug: 'video-study',
  title: 'Motion study',
  artDirection: 'still',
  mediaType: 'video',
  src: '/media/test.webm',
  mp4: '/media/test.mp4',
  poster: image,
};
