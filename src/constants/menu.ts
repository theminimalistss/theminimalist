import arcAvif from '@/assets/images/hero/arc-480.avif';
import arcWebp from '@/assets/images/hero/arc-480.webp';
import earthAvif from '@/assets/images/hero/earth-poster-480.avif';
import earthWebp from '@/assets/images/hero/earth-poster-480.webp';
import formaAvif from '@/assets/images/hero/forma-480.avif';
import formaWebp from '@/assets/images/hero/forma-480.webp';
import solenneAvif from '@/assets/images/hero/solenne-480.avif';
import solenneWebp from '@/assets/images/hero/solenne-480.webp';
import stillAvif from '@/assets/images/hero/still-poster-480.avif';
import stillWebp from '@/assets/images/hero/still-poster-480.webp';
import { ROUTES, type RoutePath } from '@/router/paths';

export type MenuPreview = { avif: string; webp: string; cue: string };

export const MENU_PREVIEWS: Partial<Record<RoutePath, MenuPreview>> = {
  [ROUTES.home]: { avif: formaAvif, webp: formaWebp, cue: 'View the collection' },
  [ROUTES.works]: { avif: stillAvif, webp: stillWebp, cue: 'View works' },
  [ROUTES.about]: { avif: earthAvif, webp: earthWebp, cue: 'Meet the studio' },
  [ROUTES.products]: { avif: solenneAvif, webp: solenneWebp, cue: 'Browse products' },
  [ROUTES.contact]: { avif: arcAvif, webp: arcWebp, cue: 'Get in touch' },
};

export const HOVER_POINTER_QUERY = '(hover: hover) and (pointer: fine)';
