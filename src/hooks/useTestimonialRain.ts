import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TESTIMONIAL_RAIN } from '@/constants/motion';
import { useAppEntered } from '@/hooks/useAppEntered';
import { bindFrameFocus, headerSafe } from '@/hooks/frameFocus';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { focusPose, randomSeed, spreadFrames, toWorld, type Size } from '@/utils/testimonialField';

type Options = { enabled: boolean; held: boolean; layout: string };

type Arrangement = { width: number; spots: { x: number; y: number }[] };

const GLIDE = 'testimonial-glide';

const frameOf = (float: HTMLElement) => float.querySelector<HTMLElement>('[data-frame]');

function glide(frames: (HTMLElement | null)[], before: (DOMRect | undefined)[]) {
  frames.forEach((frame, index) => {
    const from = before[index];
    if (!frame || !from || !frame.animate) return;
    const to = frame.getBoundingClientRect();
    const scale = to.width / (frame.offsetWidth || to.width) || 1;
    const x = (from.left - to.left) / scale;
    const y = (from.top - to.top) / scale;
    if (Math.hypot(x, y) < 1) return;
    frame.animate([{ translate: `${x}px ${y}px` }, { translate: '0 0' }], {
      duration: TESTIMONIAL_RAIN.glide,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      id: GLIDE,
    });
  });
}

export function useTestimonialRain({ enabled, held, layout }: Options) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [seed] = useState(randomSeed);
  const visible = usePageVisibility();
  const entered = useAppEntered();
  const arrived = useRef(false);
  const settings = useRef({ paused, held, visible });
  const wakeRef = useRef(() => {});

  useEffect(() => {
    settings.current = { paused, held, visible };
    wakeRef.current();
  }, [paused, held, visible]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || !enabled) return;
    const scope = stage.parentElement ?? stage;
    const floats = Array.from(scope.querySelectorAll<HTMLElement>('[data-float]'));
    const frames = floats.map(frameOf);
    let animations: Animation[] = [];
    let rate = 1;
    let frame = 0;
    let last = 0;
    let focused: HTMLElement | null = null;
    let inView = true;
    const phases: number[] = [];
    const main = floats.filter((float) => !float.closest('.testimonial-echoes'));
    const lead = main[0] ? floats.indexOf(main[0]) : -1;
    let arrangement: Arrangement | null = null;
    let size = { width: 0, height: 0 };

    const place = (sizes: Size[], width: number, loop: number) => {
      if (!arrangement || Math.abs(width / arrangement.width - 1) > TESTIMONIAL_RAIN.relayout) {
        const spots = spreadFrames(sizes, width, loop, seed);
        arrangement = {
          width,
          spots: spots.map((spot) => ({ x: spot.x / width, y: spot.y / loop })),
        };
      }
      return arrangement.spots.map((spot, index) => {
        const half = (sizes[index]?.width ?? 0) / 2 + TESTIMONIAL_RAIN.edge;
        const x =
          half >= width - half ? width / 2 : Math.min(width - half, Math.max(half, spot.x * width));
        return { x, y: spot.y * loop };
      });
    };

    const build = () => {
      size = { width: stage.clientWidth, height: stage.clientHeight };
      const progress = animations.map((animation) => {
        const duration = Number(animation.effect?.getTiming().duration) || 1;
        return ((Number(animation.currentTime) || 0) % duration) / duration;
      });
      const shift = (progress[lead] ?? 0) - (phases[lead] ?? 0);
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
      const mainSizes = main.map(measure);
      const reach = Math.max(0, ...mainSizes.map((size) => size.height)) / 2 + 24;
      const loop = height + reach * 2;
      const spots = place(mainSizes, width, loop);
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
        const speed = Number(float.dataset.speed) || TESTIMONIAL_RAIN.speed;
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
        const start = spot ? (((phase + shift) % 1) + 1) % 1 : (progress[index] ?? phase);
        phases[index] = phase;
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

    const focus = bindFrameFocus(stage, {
      area: scope,
      pose: (frameElement) => {
        const float = frameElement.closest<HTMLElement>('[data-float]');
        if (!float) return null;
        const area = stage.getBoundingClientRect();
        const result = focusPose({
          frame: float.getBoundingClientRect(),
          stage: area,
          size: { width: float.offsetWidth, height: float.offsetHeight },
          z: Number(float.dataset.z) || 0,
          topSafe: Math.max(0, headerSafe() - area.top),
        });
        return `translate3d(${result.x.toFixed(1)}px, ${result.y.toFixed(1)}px, ${result.z.toFixed(1)}px) scale(${result.scale.toFixed(4)})`;
      },
      onChange: (next) => {
        focused = next;
        wake();
      },
    });

    build();
    const resize = new ResizeObserver(() => {
      if (stage.clientWidth === size.width && stage.clientHeight === size.height) return;
      const before = frames.map((frame) => frame?.getBoundingClientRect());
      frames.forEach((frame) =>
        frame?.getAnimations().forEach((animation) => {
          if (animation.id === GLIDE) animation.cancel();
        }),
      );
      build();
      glide(frames, before);
    });
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
          inView &&
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
    wake();
    return () => {
      cancelAnimationFrame(frame);
      focus.unbind();
      resize.disconnect();
      observer.disconnect();
      window.clearInterval(playback);
      videos.forEach((video) => video.pause());
      animations.forEach((animation) => animation.cancel());
      wakeRef.current = () => {};
    };
  }, [enabled, layout, seed]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || !enabled || !entered || arrived.current) return;
    arrived.current = true;
    const scope = stage.parentElement ?? stage;
    Array.from(scope.querySelectorAll<HTMLElement>('[data-float]'))
      .sort((a, b) => Number(a.dataset.z) - Number(b.dataset.z))
      .forEach((float, index) => {
        frameOf(float)?.animate?.(
          [
            { opacity: 0, translate: '0 -48px -240px' },
            { opacity: 1, translate: '0 0 0' },
          ],
          {
            duration: TESTIMONIAL_RAIN.entrance.duration,
            delay: index * TESTIMONIAL_RAIN.entrance.stagger,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'backwards',
          },
        );
      });
  }, [enabled, entered]);

  const togglePause = useCallback(() => setPaused((value) => !value), []);
  return { stageRef, paused, togglePause, seed };
}
