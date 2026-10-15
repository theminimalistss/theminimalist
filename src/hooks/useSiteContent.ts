import { useMemo } from 'react';
import { getSiteContent } from '@/services/siteContent.service';
import type { SiteContent } from '@/types/content';

// Local, synchronous copy needs no loading frame or browser request.
export function useSiteContent<Key extends keyof SiteContent>(key: Key): SiteContent[Key] {
  return useMemo(() => getSiteContent(key), [key]);
}
