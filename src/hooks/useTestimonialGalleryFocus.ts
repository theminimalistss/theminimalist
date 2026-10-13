import { useEffect, type RefObject } from 'react';
import { bindFrameFocus, headerSafe } from '@/hooks/frameFocus';
import { flatFocusPose } from '@/utils/testimonialField';

export function useTestimonialGalleryFocus(
  stageRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !enabled) return;
    const focus = bindFrameFocus(stage, {
      pose: (frame) => {
        const float = frame.closest<HTMLElement>('[data-float]');
        if (!float) return null;
        const pose = flatFocusPose({
          frame: float.getBoundingClientRect(),
          view: { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight },
          topSafe: headerSafe(),
        });
        return `translate(${pose.x.toFixed(1)}px, ${pose.y.toFixed(1)}px) scale(${pose.scale.toFixed(4)})`;
      },
    });
    let frame = 0;
    const refresh = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          focus.refresh();
        });
    };
    window.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', refresh);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('resize', refresh);
      focus.unbind();
    };
  }, [stageRef, enabled]);
}
