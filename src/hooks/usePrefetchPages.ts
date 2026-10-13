import { useEffect } from 'react';
import { prefetchPages } from '@/router/pageModules';
import { scheduleIdle } from '@/utils/idle';
import { useAppEntered } from '@/hooks/useAppEntered';
import { usePageVisibility } from '@/hooks/usePageVisibility';

function canPrefetch() {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  return (
    !document.hidden &&
    !connection?.saveData &&
    !['slow-2g', '2g'].includes(connection?.effectiveType ?? '')
  );
}

export function usePrefetchPages() {
  const entered = useAppEntered();
  const visible = usePageVisibility();
  useEffect(() => {
    if (!entered || !visible || !canPrefetch()) return;
    let cancelled = false;
    const cancelIdle = scheduleIdle(
      () => void prefetchPages(() => !cancelled && canPrefetch()),
      4_000,
    );
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [entered, visible]);
}
