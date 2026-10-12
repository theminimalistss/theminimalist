import { useCallback, useEffect, useRef, useState } from 'react';
import { TESTIMONIAL_RAIN } from '@/constants/motion';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { toWorld } from '@/utils/testimonialField';

type Options = { enabled: boolean; held: boolean; layout: string };

export function useTestimonialRain({ enabled, held, layout }: Options) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const visible = usePageVisibility();
  const settings = useRef({ paused, held, visible });
  const wakeRef = useRef(() => {});

  useEffect(() => {
    settings.current = { paused, held, visible };
    wakeRef.current();
  }, [paused, held, visible]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !enabled) return;
    const floats = Array.from(stage.querySelectorAll<HTMLElement>('[data-float]'));
    let animations: Animation[] = [];
    let rate = 1;
    let frame = 0;
    let last = 0;
    let focused: HTMLElement | null = null;
    let inView = true;
    let releaseTimer = 0;

    const build = () => {
      const progress = animations.map((animation) => {
        const duration = Number(animation.effect?.getTiming().duration) || 1;
        return ((Number(animation.currentTime) || 0) % duration) / duration;
      });
      animations.forEach((animation) => animation.cancel());
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const vanishX = width / 2;
      const vanishY = height * TESTIMONIAL_RAIN.horizon;
      animations = floats.flatMap((float, index) => {
        if (!float.animate) return [];
        const w = float.offsetWidth || 236;
        const h = float.offsetHeight || 320;
        const z = Number(float.dataset.z) || 0;
        const scale = TESTIMONIAL_RAIN.perspective / (TESTIMONIAL_RAIN.perspective - z);
        const margin = (h * scale) / 2 + 24;
        const centerX = toWorld(Number(float.dataset.x) * width, vanishX, z);
        const from = toWorld(-margin, vanishY, z);
        const to = toWorld(height + margin, vanishY, z);
        const speed = Number(float.dataset.speed) || 20;
        const duration = ((height + margin * 2) / speed) * 1000;
        const left = centerX - w / 2;
        const animation = float.animate(
          [
            { transform: `translate3d(${left}px, ${from - h / 2}px, ${z}px)` },
            { transform: `translate3d(${left}px, ${to - h / 2}px, ${z}px)` },
          ],
          { duration, iterations: Infinity, easing: 'linear' },
        );
        const start = progress[index] ?? Number(float.dataset.offset) % 1;
        animation.currentTime = start * duration;
        animation.playbackRate = rate;
        return [animation];
      });
    };
    const target = () =>
      settings.current.paused ||
      settings.current.held ||
      !settings.current.visible ||
      !inView ||
      focused
        ? 0
        : 1;
    const step = (time: number) => {
      frame = 0;
      const goal = target();
      const delta = last ? Math.min(64, time - last) : 16;
      last = time;
      rate += (goal - rate) * (1 - Math.exp(-delta / TESTIMONIAL_RAIN.ease));
      if (Math.abs(goal - rate) < 0.004) rate = goal;
      animations.forEach((animation) => {
        animation.playbackRate = rate;
      });
      if (rate === goal) {
        last = 0;
        return;
      }
      frame = requestAnimationFrame(step);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };
    wakeRef.current = wake;

    const setFocus = (next: HTMLElement | null) => {
      window.clearTimeout(releaseTimer);
      if (next === focused) return;
      focused?.removeAttribute('data-focused');
      focused?.querySelector('video')?.pause();
      focused = next;
      next?.setAttribute('data-focused', '');
      const video = next?.querySelector('video');
      if (video && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.muted = true;
        void video.play().catch(() => undefined);
      }
      stage.toggleAttribute('data-focus', !!next);
      wake();
    };
    const frameOf = (target: EventTarget | null) =>
      target instanceof Element ? target.closest<HTMLElement>('[data-frame]') : null;
    const over = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const next = frameOf(event.target);
      if (next) setFocus(next);
      else if (focused) {
        window.clearTimeout(releaseTimer);
        releaseTimer = window.setTimeout(() => setFocus(null), TESTIMONIAL_RAIN.release);
      }
    };
    const leave = () => {
      releaseTimer = window.setTimeout(() => setFocus(null), TESTIMONIAL_RAIN.release);
    };
    const focusIn = (event: FocusEvent) => setFocus(frameOf(event.target));
    const focusOut = (event: FocusEvent) => {
      if (!frameOf(event.relatedTarget)) setFocus(null);
    };

    build();
    const resize = new ResizeObserver(() => build());
    resize.observe(stage);
    const observer = new IntersectionObserver(([entry]) => {
      inView = !!entry?.isIntersecting;
      wake();
    });
    observer.observe(stage);
    stage.addEventListener('pointerover', over);
    stage.addEventListener('pointerleave', leave);
    stage.addEventListener('focusin', focusIn);
    stage.addEventListener('focusout', focusOut);
    wake();
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(releaseTimer);
      resize.disconnect();
      observer.disconnect();
      stage.removeEventListener('pointerover', over);
      stage.removeEventListener('pointerleave', leave);
      stage.removeEventListener('focusin', focusIn);
      stage.removeEventListener('focusout', focusOut);
      focused?.removeAttribute('data-focused');
      stage.removeAttribute('data-focus');
      animations.forEach((animation) => animation.cancel());
      wakeRef.current = () => {};
    };
  }, [enabled, layout]);

  const togglePause = useCallback(() => setPaused((value) => !value), []);
  return { stageRef, paused, togglePause };
}
