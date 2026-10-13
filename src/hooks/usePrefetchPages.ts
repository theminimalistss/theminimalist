import { useEffect } from 'react';
import { prefetchPages } from '@/router/pageModules';
import { scheduleIdle } from '@/utils/idle';

export function usePrefetchPages() {
  useEffect(() => scheduleIdle(prefetchPages, 4_000), []);
}
