import { useCallback, useEffect, useRef, useState } from 'react';
import { soundEngine } from '@/audio/soundEngine';
import { TESSERACT } from '@/constants/tesseract';
import { clamp01, easeInOutCubic } from '@/utils/easing';
import { getFocusPlacement, type PreviewAnchor } from '@/utils/particlePreview';
import {
  getFrontAngles,
  getWorkAnchor,
  pickFront,
  projectPoint,
  shortestTurn,
} from '@/utils/tesseract';
import { createTesseractScene, type TesseractScene } from '@/utils/tesseractScene';

type Options = {
  count: number;
  /** A study is pinned by hover, focus, or tap: the sculpture eases to a stop. */
  holding: boolean;
  suspended: boolean;
  reducedMotion: boolean;
  /** The loader has gone (or the user navigated here): trace the sculpture in. */
  entered: boolean;
};

type Glide = {
  fromYaw: number;
  fromPitch: number;
  toYaw: number;
  toPitch: number;
  duration: number;
  elapsed: number;
};

const clampPitch = (pitch: number) =>
  Math.max(-TESSERACT.maxPitch, Math.min(TESSERACT.maxPitch, pitch));
const clampFling = (speed: number) =>
  Math.max(-TESSERACT.maxFling, Math.min(TESSERACT.maxFling, speed));

/** Owns GPU resources, input and scheduling; no project data or domain rules. */
export function useTesseract({ count, holding, suspended, reducedMotion, entered }: Options) {
  const anchorsRef = useRef<PreviewAnchor[]>([]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbitRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [paused, setPaused] = useState(false);
  const [focus, setFocus] = useState(0);
  const [docked, setDocked] = useState(false);
  const [traced, setTraced] = useState(false);
  const settings = useRef({ holding, suspended, reducedMotion, paused, entered });
  const wakeRef = useRef(() => {});
  const resetRef = useRef(() => {});
  const steerRef = useRef((index: number) => void index);

  useEffect(() => {
    settings.current = { holding, suspended, reducedMotion, paused, entered };
    wakeRef.current();
  }, [holding, suspended, reducedMotion, paused, entered]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    const orbit = orbitRef.current;
    if (!viewport || !canvas || !orbit) return;
    let scene: TesseractScene | null = null;
    let frame = 0;
    let last = 0;
    let visible = true;
    let keyboardFocus = false;
    let disposed = false;
    let yaw: number = TESSERACT.yaw;
    let pitch: number = TESSERACT.pitch;
    let width = 1;
    let height = 1;
    // Cruise eases between 0 (held) and 1 (turning) instead of stopping dead.
    let speed = 0;
    let speedFrom = 0;
    let speedGoal = 0;
    let speedElapsed = 0;
    let flingYaw = 0;
    let flingPitch = 0;
    let glide: Glide | null = null;
    let drag: { id: number; x: number; y: number; time: number; vx: number; vy: number } | null =
      null;
    let front = -1;
    let reveal = 0;
    const nodes = Array.from(viewport.querySelectorAll<HTMLElement>('[data-work-node]'));
    const anchors = nodes.map((_, index) => getWorkAnchor(index, count));

    const markFront = (index: number, announce: boolean) => {
      if (index === front) return;
      front = index;
      nodes.forEach((node, at) => node.toggleAttribute('data-front', at === index));
      setFocus(index);
      if (announce) soundEngine.note(index, 'focus');
    };
    const draw = () => {
      scene?.draw(yaw, pitch, width, height, reveal);
      const scale = Math.min(width, height) * TESSERACT.scale;
      const depths = nodes.map((node, index) => {
        const point = projectPoint(anchors[index]!, yaw, pitch);
        node.style.transform = `translate(-50%, -50%) translate(${(point.x * scale).toFixed(2)}px, ${(-point.y * scale).toFixed(2)}px)`;
        node.style.zIndex = String(Math.round((point.z + 3) * 10));
        anchorsRef.current[index] = {
          x: width / 2 + point.x * scale,
          y: height / 2 - point.y * scale,
          width,
          height,
        };
        return point.z;
      });
      if (!glide) markFront(pickFront(depths, front, TESSERACT.focusMargin), front >= 0);
    };
    const markTraced = () => {
      if (viewport.dataset.traced !== undefined) return;
      viewport.dataset.traced = '';
      setTraced(true);
    };
    const live = () =>
      !!scene &&
      visible &&
      !document.hidden &&
      !settings.current.suspended &&
      settings.current.entered;
    const held = () =>
      settings.current.reducedMotion ||
      settings.current.paused ||
      settings.current.holding ||
      keyboardFocus ||
      !!drag ||
      !!glide;
    const animate = (time: number) => {
      frame = 0;
      if (disposed) return;
      if (!live()) {
        // Resume from rest after a dialog, the menu, or a hidden tab.
        speed = speedFrom = speedGoal = 0;
        last = 0;
        return;
      }
      const delta = last ? Math.min(64, time - last) : 0;
      last = time;
      const goal = held() ? 0 : 1;
      if (goal !== speedGoal) {
        speedGoal = goal;
        speedFrom = speed;
        speedElapsed = 0;
      }
      speedElapsed += delta;
      const eased = easeInOutCubic(clamp01(speedElapsed / TESSERACT.holdDuration));
      speed = settings.current.reducedMotion ? goal : speedFrom + (speedGoal - speedFrom) * eased;
      if (reveal < 1) {
        reveal = settings.current.reducedMotion
          ? 1
          : Math.min(1, reveal + delta / TESSERACT.traceDuration);
        if (reveal >= TESSERACT.pointsAt) markTraced();
      }
      if (glide) {
        glide.elapsed += delta;
        const amount = easeInOutCubic(clamp01(glide.elapsed / glide.duration));
        yaw = glide.fromYaw + (glide.toYaw - glide.fromYaw) * amount;
        pitch = glide.fromPitch + (glide.toPitch - glide.fromPitch) * amount;
        if (amount >= 1) glide = null;
      } else if (!drag) {
        const decay = Math.exp(-delta / TESSERACT.flingDecay);
        flingYaw = Math.abs(flingYaw * decay) < 1e-6 ? 0 : flingYaw * decay;
        flingPitch = Math.abs(flingPitch * decay) < 1e-6 ? 0 : flingPitch * decay;
        yaw += (TESSERACT.rotationSpeed * speed + flingYaw) * delta;
        pitch = clampPitch(pitch + flingPitch * delta);
      }
      draw();
      const resting =
        reveal >= 1 &&
        speedGoal === 0 &&
        speed === 0 &&
        !glide &&
        !drag &&
        !flingYaw &&
        !flingPitch;
      if (resting) {
        last = 0;
        return;
      }
      frame = requestAnimationFrame(animate);
    };
    const wake = () => {
      if (disposed || frame || !live()) return;
      last = 0;
      frame = requestAnimationFrame(animate);
    };
    const glideTo = (toYaw: number, toPitch: number, duration: number) => {
      flingYaw = flingPitch = 0;
      glide = {
        fromYaw: yaw,
        fromPitch: pitch,
        toYaw: yaw + shortestTurn(yaw, toYaw),
        toPitch: clampPitch(toPitch),
        duration: settings.current.reducedMotion ? 1 : duration,
        elapsed: 0,
      };
      if (!live()) {
        yaw = glide.toYaw;
        pitch = glide.toPitch;
        glide = null;
        draw();
      }
      wake();
    };
    wakeRef.current = wake;
    resetRef.current = () => glideTo(TESSERACT.yaw, TESSERACT.pitch, TESSERACT.steerDuration);
    steerRef.current = (index: number) => {
      const anchor = anchors[index];
      if (!anchor) return;
      markFront(index, false);
      const target = getFrontAngles(anchor);
      glideTo(target.yaw, target.pitch, TESSERACT.steerDuration);
    };
    const resize = () => {
      width = Math.max(1, viewport.clientWidth);
      height = Math.max(1, viewport.clientHeight);
      setDocked(getFocusPlacement({ width, height }) !== null);
      draw();
    };
    const initialize = () => {
      scene?.dispose();
      scene = createTesseractScene(canvas);
      setStatus(scene ? 'ready' : 'unavailable');
      if (!scene) markTraced();
      resize();
      wake();
    };
    const lost = (event: Event) => {
      event.preventDefault();
      scene?.dispose();
      scene = null;
      setStatus('unavailable');
      markTraced();
    };
    const pointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || !event.isPrimary || settings.current.suspended) return;
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        time: event.timeStamp,
        vx: 0,
        vy: 0,
      };
      glide = null;
      flingYaw = flingPitch = 0;
      orbit.setPointerCapture(event.pointerId);
      viewport.dataset.dragging = '';
      soundEngine.grab();
      wake();
    };
    const pointerMove = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const elapsed = Math.max(1, event.timeStamp - drag.time);
      const turnX = (event.clientX - drag.x) * TESSERACT.dragSpeed;
      const turnY = (event.clientY - drag.y) * TESSERACT.dragSpeed;
      yaw += turnX;
      pitch = clampPitch(pitch + turnY);
      drag.vx = drag.vx * 0.5 + (turnX / elapsed) * 0.5;
      drag.vy = drag.vy * 0.5 + (turnY / elapsed) * 0.5;
      drag.x = event.clientX;
      drag.y = event.clientY;
      drag.time = event.timeStamp;
      draw();
    };
    const pointerEnd = (event: PointerEvent) => {
      if (!drag) return;
      if (orbit.hasPointerCapture(drag.id)) orbit.releasePointerCapture(drag.id);
      // A pause before release means the user set the sculpture down rather than threw it.
      const stillness = event.timeStamp - drag.time;
      const carry = stillness > 90 ? 0 : 1;
      flingYaw = clampFling(drag.vx * carry);
      flingPitch = clampFling(drag.vy * carry) * 0.5;
      drag = null;
      delete viewport.dataset.dragging;
      soundEngine.fling(Math.abs(flingYaw) / TESSERACT.maxFling);
      wake();
    };
    const keyDown = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') {
        resetRef.current();
        return;
      }
      const base = glide ?? { toYaw: yaw, toPitch: pitch };
      const turn = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
      const tilt = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0;
      glideTo(
        base.toYaw + turn * TESSERACT.nudge,
        base.toPitch + tilt * TESSERACT.nudge,
        TESSERACT.nudgeDuration,
      );
    };
    // Only keyboard focus holds the sculpture; a pointer drag focuses the control too.
    const focusIn = (event: FocusEvent) => {
      keyboardFocus = event.target instanceof Element && event.target.matches(':focus-visible');
      wake();
    };
    const focusOut = (event: FocusEvent) => {
      if (!viewport.contains(event.relatedTarget as Node | null)) keyboardFocus = false;
      wake();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        wake();
      },
      { threshold: 0.05 },
    );
    intersection.observe(viewport);
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', initialize);
    orbit.addEventListener('pointerdown', pointerDown);
    orbit.addEventListener('pointermove', pointerMove);
    orbit.addEventListener('pointerup', pointerEnd);
    orbit.addEventListener('pointercancel', pointerEnd);
    orbit.addEventListener('lostpointercapture', pointerEnd);
    orbit.addEventListener('keydown', keyDown);
    viewport.addEventListener('focusin', focusIn);
    viewport.addEventListener('focusout', focusOut);
    document.addEventListener('visibilitychange', wake);
    const boot = requestAnimationFrame(initialize);
    return () => {
      disposed = true;
      cancelAnimationFrame(boot);
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', initialize);
      orbit.removeEventListener('pointerdown', pointerDown);
      orbit.removeEventListener('pointermove', pointerMove);
      orbit.removeEventListener('pointerup', pointerEnd);
      orbit.removeEventListener('pointercancel', pointerEnd);
      orbit.removeEventListener('lostpointercapture', pointerEnd);
      orbit.removeEventListener('keydown', keyDown);
      viewport.removeEventListener('focusin', focusIn);
      viewport.removeEventListener('focusout', focusOut);
      document.removeEventListener('visibilitychange', wake);
      scene?.dispose();
      wakeRef.current = () => {};
      resetRef.current = () => {};
      steerRef.current = () => {};
    };
  }, [count]);

  const toggle = useCallback(() => setPaused((value) => !value), []);
  const reset = useCallback(() => resetRef.current(), []);
  const steer = useCallback((index: number) => steerRef.current(index), []);

  return {
    anchorsRef,
    viewportRef,
    canvasRef,
    orbitRef,
    status,
    paused,
    focus,
    docked,
    traced,
    toggle,
    reset,
    steer,
  };
}
