import { useState } from 'react';
import type { SoftwarePlatform } from '@/types/service';

/** Previews only change on input; there is no timer or continuous render loop. */
export function useServicePreview() {
  const [platform, setPlatform] = useState<SoftwarePlatform>('web');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  return { platform, setPlatform, viewport, setViewport };
}
