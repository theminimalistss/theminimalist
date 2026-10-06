export type ImageSources = {
  src: string;
  srcSmall: string;
  webp: string;
  webpSmall: string;
};

export type WorkBase = {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: number;
  alt: string;
  description: string;
  tagline: string;
  width: number;
  height: number;
  featured: boolean;
  order: number;
  isConcept: boolean;
  artDirection: 'forma' | 'still' | 'solenne' | 'earth' | 'arc' | 'wild' | 'ink';
};

export type ImageWork = WorkBase & {
  mediaType: 'image';
  image: ImageSources;
};

export type VideoWork = WorkBase & {
  mediaType: 'video';
  src: string;
  mp4: string;
  poster: ImageSources;
};

export type Work = ImageWork | VideoWork;

export interface WorksRepository {
  getWorks(signal?: AbortSignal): Promise<unknown>;
}
