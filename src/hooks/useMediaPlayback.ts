import { useEffect, useRef, useState } from 'react';
import { usePageVisibility } from '@/hooks/usePageVisibility';

export function useMediaPlayback(enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const visiblePage = usePageVisibility();
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let active = true;

    const update = (visible: boolean) => {
      if (enabled && visiblePage && visible && !unavailable) {
        video.muted = true;
        void video.play().catch((error: unknown) => {
          if (active && !(error instanceof DOMException && error.name === 'AbortError')) {
            setUnavailable(true);
          }
        });
      } else {
        video.pause();
      }
    };
    // Native autoplay is omitted so browsers cannot start offscreen or reduced-motion media.
    const observer = new IntersectionObserver(
      (entries) => {
        update(entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.15));
      },
      { threshold: [0, 0.15, 0.5] },
    );
    observer.observe(video);
    if (!enabled || !visiblePage) video.pause();

    return () => {
      active = false;
      observer.disconnect();
      video.pause();
    };
  }, [enabled, visiblePage, unavailable]);

  return { videoRef, unavailable, onError: () => setUnavailable(true) };
}
