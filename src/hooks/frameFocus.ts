import { TESTIMONIAL_RAIN } from '@/constants/motion';

type FrameFocusOptions = {
  pose: (frame: HTMLElement) => string | null;
  onChange?: (frame: HTMLElement | null) => void;
  area?: HTMLElement;
};

export const FLIGHT = 'testimonial-flight';

const flying = (frame: HTMLElement) =>
  frame.getAnimations().some((animation) => animation.id === FLIGHT);

export function headerSafe() {
  return (
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 96
  );
}

export function bindFrameFocus(
  stage: HTMLElement,
  { pose, onChange, area = stage }: FrameFocusOptions,
) {
  let focused: HTMLElement | null = null;
  let releaseTimer = 0;

  const apply = (frame: HTMLElement) => {
    const transform = pose(frame);
    if (transform) frame.style.setProperty('--focus', transform);
  };
  const setFocus = (next: HTMLElement | null) => {
    window.clearTimeout(releaseTimer);
    if (next === focused) return;
    focused?.style.removeProperty('--focus');
    focused?.removeAttribute('data-focused');
    focused?.closest('[data-layer]')?.removeAttribute('data-holding');
    focused = next;
    next?.closest('[data-layer]')?.setAttribute('data-holding', '');
    if (next) apply(next);
    next?.setAttribute('data-focused', '');
    const video = next?.querySelector('video');
    if (video && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.muted = true;
      void video.play().catch(() => undefined);
    }
    stage.toggleAttribute('data-focus', !!next);
    stage.parentElement?.toggleAttribute('data-focus', !!next);
    onChange?.(next);
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
  const holds = (event: PointerEvent) => {
    const home = focused?.closest<HTMLElement>('[data-float]');
    return !!focused && (inside(focused, event) || (!!home && inside(home, event)));
  };
  const release = () => {
    window.clearTimeout(releaseTimer);
    releaseTimer = window.setTimeout(() => setFocus(null), TESTIMONIAL_RAIN.release);
  };
  const over = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const next = frameOf(event.target);
    if (next && next !== focused && flying(next)) return;
    if (focused && next !== focused && holds(event)) {
      window.clearTimeout(releaseTimer);
      return;
    }
    if (next) setFocus(next);
    else if (focused) release();
  };
  const leave = (event: PointerEvent) => {
    if (!holds(event)) release();
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !focused || area.contains(event.target as Node)) return;
    if (holds(event)) window.clearTimeout(releaseTimer);
    else release();
  };
  const focusIn = (event: FocusEvent) => {
    const frame = frameOf(event.target);
    if (frame?.matches(':focus-visible')) setFocus(frame);
  };
  const focusOut = (event: FocusEvent) => {
    if (!frameOf(event.relatedTarget)) setFocus(null);
  };

  area.addEventListener('pointerover', over);
  area.addEventListener('pointerleave', leave);
  document.addEventListener('pointermove', move);
  area.addEventListener('focusin', focusIn);
  area.addEventListener('focusout', focusOut);

  return {
    refresh() {
      if (focused) apply(focused);
    },
    unbind() {
      window.clearTimeout(releaseTimer);
      area.removeEventListener('pointerover', over);
      area.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointermove', move);
      area.removeEventListener('focusin', focusIn);
      area.removeEventListener('focusout', focusOut);
      focused?.style.removeProperty('--focus');
      focused?.removeAttribute('data-focused');
      focused?.closest('[data-layer]')?.removeAttribute('data-holding');
      stage.removeAttribute('data-focus');
      stage.parentElement?.removeAttribute('data-focus');
      focused = null;
    },
  };
}
