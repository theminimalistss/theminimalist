import { useCallback, useEffect, useRef, useState } from 'react';
import { TESTIMONIAL_RAIN } from '@/constants/motion';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { focusPose, spreadFrames, toWorld } from '@/utils/testimonialField';

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
      const measure = (float: HTMLElement) => {
        const z = Number(float.dataset.z) || 0;
        const scale = TESTIMONIAL_RAIN.perspective / (TESTIMONIAL_RAIN.perspective - z);
        const w = float.offsetWidth || 250;
        const h = float.offsetHeight || 312;
        return { z, w, h, width: w * scale, height: h * scale };
      };
      const main = floats.filter((float) => !float.closest('.testimonial-echoes'));
      const mainSizes = main.map(measure);
      const reach = Math.max(0, ...mainSizes.map((size) => size.height)) / 2 + 24;
      const loop = height + reach * 2;
      const spots = spreadFrames(mainSizes, width, loop);
      animations = floats.flatMap((float, index) => {
        if (!float.animate) return [];
        const size = measure(float);
        const slot = main.indexOf(float);
        const spot = slot >= 0 ? spots[slot] : undefined;
        const margin = spot ? reach : size.height / 2 + 24;
        const half = size.width / 2 + TESTIMONIAL_RAIN.edge;
        const screenX = spot
          ? spot.x
          : Math.min(width - half, Math.max(half, Number(float.dataset.x) * width));
        const centerX = toWorld(screenX, vanishX, size.z);
        const from = toWorld(-margin, vanishY, size.z);
        const to = toWorld(height + margin, vanishY, size.z);
        const speed = Number(float.dataset.speed) || TESTIMONIAL_RAIN.bands[0].speed;
        const duration = ((height + margin * 2) / speed) * 1000;
        const left = centerX - size.w / 2;
        const z = size.z;
        const h = size.h;
        const animation = float.animate(
          [
            { transform: `translate3d(${left}px, ${from - h / 2}px, ${z}px)` },
            { transform: `translate3d(${left}px, ${to - h / 2}px, ${z}px)` },
          ],
          { duration, iterations: Infinity, easing: 'linear' },
        );
        const phase = spot ? spot.y / loop : Number(float.dataset.offset) % 1;
        const start = progress[index] ?? phase;
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

    const topSafe = () =>
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) ||
      96;
    const pose = (frameElement: HTMLElement) => {
      const float = frameElement.closest<HTMLElement>('[data-float]');
      if (!float) return;
      const box = float.getBoundingClientRect();
      const area = stage.getBoundingClientRect();
      const result = focusPose({
        frame: box,
        stage: area,
        size: { width: float.offsetWidth, height: float.offsetHeight },
        z: Number(float.dataset.z) || 0,
        topSafe: Math.max(0, topSafe() - area.top),
      });
      frameElement.style.setProperty(
        '--focus',
        `translate3d(${result.x.toFixed(1)}px, ${result.y.toFixed(1)}px, ${result.z.toFixed(1)}px) scale(${result.scale.toFixed(4)})`,
      );
    };
    const setFocus = (next: HTMLElement | null) => {
      window.clearTimeout(releaseTimer);
      if (next === focused) return;
      focused?.style.removeProperty('--focus');
      focused?.removeAttribute('data-focused');
      focused = next;
      if (next) pose(next);
      next?.setAttribute('data-focused', '');
      const video = next?.querySelector('video');
      if (video && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.muted = true;
        void video.play().catch(() => undefined);
      }
      stage.toggleAttribute('data-focus', !!next);
      stage.parentElement?.toggleAttribute('data-focus', !!next);
      wake();
    };
    const frameOf = (target: EventTarget | null) =>
      target instanceof Element ? target.closest<HTMLElement>('[data-frame]') : null;
    const inside = (element: HTMLElement, event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      return (
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom
      );
    };
    const over = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const next = frameOf(event.target);
      const home = focused?.closest<HTMLElement>('[data-float]');
      const held = focused && (inside(focused, event) || (home && inside(home, event)));
      if (focused && next !== focused && held) {
        window.clearTimeout(releaseTimer);
        return;
      }
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
    const videos = Array.from(stage.querySelectorAll<HTMLVideoElement>('.testimonial-space video'));
    const playVisible = () => {
      const area = stage.getBoundingClientRect();
      for (const video of videos) {
        const box = video.getBoundingClientRect();
        const shown =
          !document.hidden &&
          box.bottom > area.top &&
          box.top < area.bottom &&
          box.right > area.left &&
          box.left < area.right;
        if (shown && video.paused) {
          video.muted = true;
          void video.play().catch(() => undefined);
        } else if (!shown && !video.paused) video.pause();
      }
    };
    const playback = videos.length
      ? window.setInterval(playVisible, TESTIMONIAL_RAIN.videoCheck)
      : 0;
    playVisible();
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
      window.clearInterval(playback);
      videos.forEach((video) => video.pause());
      stage.removeEventListener('pointerover', over);
      stage.removeEventListener('pointerleave', leave);
      stage.removeEventListener('focusin', focusIn);
      stage.removeEventListener('focusout', focusOut);
      focused?.style.removeProperty('--focus');
      focused?.removeAttribute('data-focused');
      stage.removeAttribute('data-focus');
      stage.parentElement?.removeAttribute('data-focus');
      animations.forEach((animation) => animation.cancel());
      wakeRef.current = () => {};
    };
  }, [enabled, layout]);

  const togglePause = useCallback(() => setPaused((value) => !value), []);
  return { stageRef, paused, togglePause };
}
