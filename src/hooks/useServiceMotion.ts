import { useIllustrationMotion } from '@/hooks/useIllustrationMotion';

/** CSS owns the artwork; the hook owns playback and per-scene visibility. */
export function useServiceMotion(ready: boolean) {
  return useIllustrationMotion(ready, '[data-service-scene]');
}
