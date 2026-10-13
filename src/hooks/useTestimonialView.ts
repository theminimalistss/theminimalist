import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { soundEngine } from '@/audio/soundEngine';
import { TESTIMONIAL_VIEW } from '@/constants/motion';
import { FLIGHT, headerSafe } from '@/hooks/frameFocus';
import { usePageVisibility } from '@/hooks/usePageVisibility';

export type TestimonialView = 'spatial' | 'gallery';

const PIECES = [
  '.testimonials-intro-surface',
  '.testimonials-intro > :not(.testimonials-intro-surface, .testimonials-stats, .testimonials-controls)',
  '.testimonials-stats > div',
  '.testimonials-controls > *',
  '.testimonial-space [data-frame]',
].join(', ');

function keyOf(element: HTMLElement) {
  const parent = element.parentElement;
  return (
    element.dataset.workId ??
    `${parent?.className}-${Array.prototype.indexOf.call(parent?.children ?? [], element)}`
  );
}

function snapshot(root: HTMLElement) {
  const boxes = new Map<string, DOMRect>();
  root.querySelectorAll<HTMLElement>(PIECES).forEach((element) => {
    boxes.set(keyOf(element), element.getBoundingClientRect());
  });
  return boxes;
}

function shown(box: DOMRect) {
  const top = headerSafe() + 64;
  const bottom = window.innerHeight * 0.92;
  const hidden =
    Math.min(1, Math.max(0, (top - box.top) / box.height)) +
    Math.min(1, Math.max(0, (box.bottom - bottom) / box.height)) / 2;
  return Math.max(0, 1 - hidden);
}

function fly(root: HTMLElement, before: Map<string, DOMRect>) {
  const unmasking = root.hasAttribute('data-still');
  root.querySelectorAll<HTMLElement>(PIECES).forEach((element, index) => {
    if (!element.animate) return;
    const from = before.get(keyOf(element));
    const to = element.getBoundingClientRect();
    const timing: KeyframeAnimationOptions = {
      duration: TESTIMONIAL_VIEW.duration,
      delay: index * TESTIMONIAL_VIEW.stagger,
      easing: TESTIMONIAL_VIEW.easing,
      fill: 'backwards',
      id: FLIGHT,
    };
    if (!to.width) return;
    if (!from) {
      element.animate([{ opacity: 0 }, { opacity: 1 }], {
        ...timing,
        delay: TESTIMONIAL_VIEW.duration / 2,
        duration: TESTIMONIAL_VIEW.duration / 2,
      });
      return;
    }
    const scale = to.width / (element.offsetWidth || to.width);
    const x = (from.left - to.left) / scale;
    const y = (from.top - to.top) / scale;
    if (element.dataset.workId) {
      const start = unmasking ? shown(from) : 1;
      element.animate(
        [
          {
            transform: `translate(${x}px, ${y}px) scale(${from.width / to.width}, ${from.height / to.height})`,
            transformOrigin: '0 0',
            opacity: start,
          },
          { transform: 'none', transformOrigin: '0 0', opacity: 1, offset: 1 },
        ],
        timing,
      );
    } else if (element.classList.contains('testimonials-intro-surface')) {
      element.animate(
        [
          {
            transform: `translate(${x}px, ${y}px)`,
            width: `${from.width}px`,
            height: `${from.height}px`,
          },
          { transform: 'none', width: `${to.width}px`, height: `${to.height}px` },
        ],
        { ...timing, delay: 0 },
      );
    } else {
      const rewrapped = Math.abs(from.width - to.width) > 4;
      element.animate(
        rewrapped
          ? [
              { transform: `translate(${x}px, ${y}px)`, opacity: 0.3 },
              { transform: 'none', opacity: 1 },
            ]
          : [{ transform: `translate(${x}px, ${y}px)` }, { transform: 'none' }],
        timing,
      );
    }
  });
}

export function useTestimonialView(reducedMotion: boolean) {
  const [chosen, setChosen] = useState<TestimonialView>('spatial');
  const view: TestimonialView = reducedMotion ? 'gallery' : chosen;
  const rootRef = useRef<HTMLElement>(null);
  const visible = usePageVisibility();

  useEffect(() => {
    const root = rootRef.current;
    if (view !== 'gallery' || reducedMotion || !visible || !root) return;
    if (typeof IntersectionObserver !== 'function') return;
    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>('.testimonial-space video'));
    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!(target instanceof HTMLVideoElement)) continue;
        if (isIntersecting) {
          target.muted = true;
          void target.play().catch(() => undefined);
        } else target.pause();
      }
    });
    videos.forEach((video) => observer.observe(video));
    return () => {
      observer.disconnect();
      videos.forEach((video) => video.pause());
    };
  }, [view, reducedMotion, visible]);

  const change = useCallback(
    (next: TestimonialView) => {
      if (next === view) return;
      const root = rootRef.current;
      if (!root || reducedMotion) {
        setChosen(next);
        return;
      }
      const before = snapshot(root);
      if (next === 'spatial') window.scrollTo({ top: 0 });
      soundEngine.play('switch');
      root.querySelectorAll<HTMLElement>('[data-float], [data-frame]').forEach((element) =>
        element.getAnimations().forEach((animation) => {
          if (animation instanceof CSSTransition || animation instanceof CSSAnimation) return;
          if (element.closest('.testimonial-echoes') && element.matches('[data-float]'))
            animation.commitStyles();
          animation.cancel();
        }),
      );
      flushSync(() => setChosen(next));
      fly(root, before);
    },
    [view, reducedMotion],
  );

  return { view, change, rootRef };
}
