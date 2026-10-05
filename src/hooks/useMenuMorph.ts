import { useCallback, useEffect, useRef, useState } from 'react';
import { MENU_MORPH, MOTION } from '@/constants/motion';
import { MENU_MORPH_SHADER } from '@/shaders/menuMorph';
import { easeInOutCubic } from '@/utils/easing';
import {
  createFullscreenScene,
  fitCanvas,
  readColorToken,
  type FullscreenScene,
} from '@/utils/webgl';

export type MorphPhase = 'closed' | 'opening' | 'open' | 'closing';

type Point = { x: number; y: number };

function measureOrigin(element: HTMLElement | null): Point {
  const rect = element?.getBoundingClientRect();
  if (!rect || !rect.width) return { x: window.innerWidth, y: 0 };
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function paint(
  canvas: HTMLCanvasElement,
  scene: FullscreenScene | null,
  progress: number,
  origin: Point,
  time: number,
) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (!scene) {
    const reach = Math.hypot(
      Math.max(origin.x, width - origin.x),
      Math.max(origin.y, height - origin.y),
    );
    canvas.style.clipPath = `circle(${(progress * reach * 1.02).toFixed(1)}px at ${origin.x}px ${origin.y}px)`;
    return;
  }
  fitCanvas(canvas, width, height);
  if (progress <= 0) {
    scene.clear();
    return;
  }
  const ratio = canvas.width / width;
  const { gl } = scene;
  gl.uniform2f(scene.uniform('u_resolution'), canvas.width, canvas.height);
  gl.uniform2f(scene.uniform('u_origin'), origin.x * ratio, canvas.height - origin.y * ratio);
  gl.uniform1f(scene.uniform('u_progress'), progress);
  gl.uniform1f(scene.uniform('u_time'), time / 1000);
  scene.draw();
}

export function useMenuMorph(open: boolean, reducedMotion: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originRef = useRef<HTMLButtonElement>(null);
  const sceneRef = useRef<FullscreenScene | null>(null);
  const progress = useRef(0);
  const [phase, setPhase] = useState<MorphPhase>('closed');
  const [lastOpen, setLastOpen] = useState(open);

  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) setPhase(reducedMotion ? 'open' : 'opening');
    else if (phase !== 'closed') setPhase(reducedMotion ? 'closed' : 'closing');
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = createFullscreenScene(canvas, MENU_MORPH_SHADER);
    canvas.dataset.renderer = scene ? 'webgl' : 'css';
    if (!scene) return;
    scene.gl.uniform3fv(scene.uniform('u_brand'), readColorToken('--color-brand'));
    scene.gl.uniform3fv(scene.uniform('u_lead'), readColorToken('--color-accent'));
    sceneRef.current = scene;
    let lost = false;
    const handleLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      sceneRef.current = null;
      canvas.dataset.renderer = 'css';
    };
    canvas.addEventListener('webglcontextlost', handleLost);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost);
      sceneRef.current = null;
      if (!lost) scene.dispose();
    };
  }, []);

  useEffect(() => {
    if (phase === 'open' || phase === 'closed') {
      progress.current = phase === 'open' ? 1 : 0;
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const opening = phase === 'opening';
    let origin = opening ? null : measureOrigin(originRef.current);
    let frame = 0;
    let lastTime = 0;
    let waited = 0;

    const tick = (time: number) => {
      const delta = lastTime ? Math.min(time - lastTime, MOTION.maxFrameDelta) : 0;
      lastTime = time;
      origin ??= measureOrigin(originRef.current);
      if (opening) {
        progress.current = Math.min(1, progress.current + delta / MENU_MORPH.openDuration);
      } else if ((waited += delta) > MENU_MORPH.closeDelay) {
        progress.current = Math.max(0, progress.current - delta / MENU_MORPH.closeDuration);
      }
      paint(canvas, sceneRef.current, easeInOutCubic(progress.current), origin, time);
      if (opening ? progress.current >= 1 : progress.current <= 0) {
        setPhase(opening ? 'open' : 'closed');
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    if (origin) paint(canvas, sceneRef.current, easeInOutCubic(progress.current), origin, 0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const settle = useCallback(() => setPhase('closed'), []);

  return { phase, rendered: phase !== 'closed', canvasRef, originRef, settle };
}
