import type { ImageSources } from '@/types/work';

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

export function resolveWorkMedia(name: string, mediaType: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(name)) {
    throw new Error('A work requires a known local asset key.');
  }
  if (mediaType === 'image') return { mediaType, image: image(name) };
  if (mediaType === 'video') {
    return {
      mediaType,
      src: asset(`videos/hero/${name}.webm`),
      mp4: asset(`videos/hero/${name}.mp4`),
      poster: image(`${name}-poster`),
    };
  }
  throw new Error('Unsupported work media type.');
}
