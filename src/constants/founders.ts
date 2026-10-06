import daisyAvif480 from '@/assets/images/founders/daisy-nuique-480.avif';
import daisyWebp480 from '@/assets/images/founders/daisy-nuique-480.webp';
import daisyAvif960 from '@/assets/images/founders/daisy-nuique-960.avif';
import daisyWebp960 from '@/assets/images/founders/daisy-nuique-960.webp';
import rexAvif480 from '@/assets/images/founders/rex-pinili-480.avif';
import rexWebp480 from '@/assets/images/founders/rex-pinili-480.webp';
import rexAvif960 from '@/assets/images/founders/rex-pinili-960.avif';
import rexWebp960 from '@/assets/images/founders/rex-pinili-960.webp';
import founders from '@/constants/founders.json';

export type FounderPortrait = { avif: string; webp: string; avifSmall: string; webpSmall: string };
export type Founder = { slug: string; name: string; role: string; portrait: FounderPortrait };

const PORTRAITS: Record<string, FounderPortrait> = {
  'daisy-nuique': {
    avif: daisyAvif960,
    webp: daisyWebp960,
    avifSmall: daisyAvif480,
    webpSmall: daisyWebp480,
  },
  'rex-pinili': {
    avif: rexAvif960,
    webp: rexWebp960,
    avifSmall: rexAvif480,
    webpSmall: rexWebp480,
  },
};

export const FOUNDER_TITLE = 'Founding partner';

export const FOUNDERS: readonly Founder[] = founders.flatMap((founder) => {
  const portrait = PORTRAITS[founder.slug];
  return portrait ? [{ ...founder, portrait }] : [];
});
