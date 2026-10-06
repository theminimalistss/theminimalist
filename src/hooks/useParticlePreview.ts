import { useEffect, useRef, useState, type RefObject } from 'react';
import { soundEngine } from '@/audio/soundEngine';
import type { Work } from '@/types/work';
import { createParticleScene } from '@/utils/particleScene';
import {
  getFocusPlacement,
  getPreviewPlacement,
  type PreviewAnchor,
} from '@/utils/particlePreview';

type PreviewPhase = 'loading' | 'assembling' | 'dispersing' | 'ready' | 'fallback' | 'hidden';

type Shown = { work: Work; index: number };

type Options = {
  work: Work;
  index: number;
  active: boolean;
  /** Use the fixed slot beside the sculpture instead of a card next to the point. */
  docked: boolean;
  suspended: boolean;
  reducedMotion: boolean;
  anchorsRef: RefObject<PreviewAnchor[]>;
};

const ASSEMBLE = 1050;
const DISPERSE = 480;

const posterOf = (work: Work) =>
  work.mediaType === 'image' ? work.image.webpSmall : work.poster.webpSmall;

/**
 * Builds the shown study from particles. When the requested study changes, the current
 * one flows back into its own point before the next assembles from its point.
 */
export function useParticlePreview({
  work,
  index,
  active,
  docked,
  suspended,
  reducedMotion,
  anchorsRef,
}: Options) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<Shown>({ work, index });
  const [phase, setPhase] = useState<PreviewPhase>('loading');
  const desired = useRef({ work, index, active, docked, suspended });
  const shownRef = useRef<Shown>(shown);
  const wakeRef = useRef(() => {});

  useEffect(() => {
    desired.current = { work, index, active, docked, suspended };
    wakeRef.current();
  }, [work, index, active, docked, suspended]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;
    const scene = reducedMotion ? null : createParticleScene(canvas);
    let frame = 0;
    let last = 0;
    let progress = 0;
    let unavailable = !scene;
    let disposed = false;
    let visible = true;
    let loadedSource = '';
    let image: HTMLImageElement | null = null;
    let current = shownRef.current;
    let reported: PreviewPhase | null = null;
    const report = (next: PreviewPhase) => {
      if (next === reported) return;
      if (next === 'assembling') soundEngine.shimmer();
      reported = next;
      setPhase(next);
    };
    const show = (next: Shown) => {
      current = next;
      shownRef.current = next;
      setShown(next);
    };
    const load = (target: Work) => {
      const source = posterOf(target);
      if (!scene || source === loadedSource || image?.dataset.source === source) return;
      const next = new Image();
      next.dataset.source = source;
      next.onload = () => {
        if (disposed || image !== next) return;
        loadedSource = source;
        if (!unavailable) scene.upload(next);
        wake();
      };
      next.onerror = () => {
        if (disposed || image !== next) return;
        unavailable = true;
        wake();
      };
      image = next;
      next.src = source;
    };
    const position = () => {
      const anchor = anchorsRef.current?.[current.index];
      if (!anchor) return null;
      const slot = desired.current.docked ? getFocusPlacement(anchor) : null;
      const rect = slot ?? getPreviewPlacement(anchor);
      card.style.left = `${rect.left}px`;
      card.style.top = `${rect.top}px`;
      card.style.width = `${rect.width}px`;
      return { anchor, rect };
    };
    const paint = () => {
      const placement = position();
      if (scene && !unavailable && placement && loadedSource === posterOf(current.work))
        scene.draw(placement.anchor, placement.rect, progress);
    };
    const tick = (time: number) => {
      frame = 0;
      const want = desired.current;
      if (disposed || !visible || want.suspended || document.hidden) return;
      const swapping = want.work.id !== current.work.id;
      if (unavailable) {
        if (swapping) show({ work: want.work, index: want.index });
        position();
        report(want.active ? 'fallback' : 'hidden');
        return;
      }
      const target = !swapping && want.active ? 1 : 0;
      if (target === 1 && loadedSource !== posterOf(current.work)) {
        load(current.work);
        position();
        report('loading');
        return;
      }
      const delta = last ? Math.min(50, time - last) : 16;
      last = time;
      progress = target
        ? Math.min(1, progress + delta / ASSEMBLE)
        : Math.max(0, progress - delta / DISPERSE);
      paint();
      if (progress === 0 && swapping) {
        show({ work: want.work, index: want.index });
        load(want.work);
        report('loading');
        last = 0;
        frame = requestAnimationFrame(tick);
        return;
      }
      if (progress === target) {
        report(target ? 'ready' : 'hidden');
        last = 0;
        return;
      }
      report(target ? 'assembling' : 'dispersing');
      frame = requestAnimationFrame(tick);
    };
    function wake() {
      if (disposed || frame) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    }
    wakeRef.current = wake;
    const resize = new ResizeObserver(paint);
    resize.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      wake();
    });
    observer.observe(canvas);
    const lost = (event: Event) => {
      event.preventDefault();
      unavailable = true;
      wake();
    };
    canvas.addEventListener('webglcontextlost', lost);
    document.addEventListener('visibilitychange', wake);
    wake();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      if (image) image.onload = image.onerror = null;
      resize.disconnect();
      observer.disconnect();
      scene?.dispose();
      canvas.removeEventListener('webglcontextlost', lost);
      document.removeEventListener('visibilitychange', wake);
      wakeRef.current = () => {};
    };
  }, [reducedMotion, anchorsRef]);

  return {
    canvasRef,
    cardRef,
    shown,
    phase,
    assembled: phase === 'ready' || phase === 'fallback',
  };
}
