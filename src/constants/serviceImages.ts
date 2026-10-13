import brandingAvif from '@/assets/images/services/branding-960.avif';
import brandingAvifSmall from '@/assets/images/services/branding-480.avif';
import brandingWebp from '@/assets/images/services/branding-960.webp';
import brandingWebpSmall from '@/assets/images/services/branding-480.webp';
import softwareAvif from '@/assets/images/services/software-960.avif';
import softwareAvifSmall from '@/assets/images/services/software-480.avif';
import softwareWebp from '@/assets/images/services/software-960.webp';
import softwareWebpSmall from '@/assets/images/services/software-480.webp';
import websitesAvif from '@/assets/images/services/websites-960.avif';
import websitesAvifSmall from '@/assets/images/services/websites-480.avif';
import websitesWebp from '@/assets/images/services/websites-960.webp';
import websitesWebpSmall from '@/assets/images/services/websites-480.webp';
import type { ImageSources } from '@/types/work';

export const SERVICE_IMAGES: readonly ImageSources[] = [
  {
    src: softwareAvif,
    srcSmall: softwareAvifSmall,
    webp: softwareWebp,
    webpSmall: softwareWebpSmall,
  },
  {
    src: websitesAvif,
    srcSmall: websitesAvifSmall,
    webp: websitesWebp,
    webpSmall: websitesWebpSmall,
  },
  {
    src: brandingAvif,
    srcSmall: brandingAvifSmall,
    webp: brandingWebp,
    webpSmall: brandingWebpSmall,
  },
];
