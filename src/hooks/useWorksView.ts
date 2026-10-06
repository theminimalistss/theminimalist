import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { soundEngine } from '@/audio/soundEngine';
import type { Work } from '@/types/work';
import { clamp01, easeInOutCubic } from '@/utils/easing';
import type { PreviewPlacement } from '@/utils/particlePreview';
import { createParticleScene } from '@/utils/particleScene';
import { getNodePositions } from '@/utils/tesseract';

export type WorksView = 'spatial' | 'gallery';

type Point = { x: number; y: number };
type Flight = { work: Work; slot: number; point: Point; box: PreviewPlacement; delay: number };

const FLIGHT = { duration: 1250, stagger: 70, settle: 380, columns: 72 };

const posterOf = (work: Work) =>
  work.mediaType === 'image' ? work.image.webpSmall : work.poster.webpSmall;

function readPoints(works: readonly Work[]) {
  const points = new Map<string, Point>();
  document.querySelectorAll<HTMLElement>('[data-work-node]').forEach((node, index) => {
    const work = works[index];
    const rect = node.getBoundingClientRect();
    if (work) points.set(work.id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  });
  return points;
}

function predictPoints(works: readonly Work[]) {
  const points = new Map<string, Point>();
  const viewport = document.querySelector('.tesseract-viewport')?.getBoundingClientRect();
  if (!viewport) return points;
  getNodePositions(works.length, viewport.width, viewport.height).forEach((point, index) => {
    const work = works[index];
    if (work) points.set(work.id, { x: viewport.left + point.x, y: viewport.top + point.y });
  });
  return points;
}

function readBoxes() {
  const boxes = new Map<string, PreviewPlacement>();
  document.querySelectorAll<HTMLElement>('.work-gallery [data-work-id]').forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (card.dataset.workId && rect.bottom > 0 && rect.top < window.innerHeight)
      boxes.set(card.dataset.workId, {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
  });
  return boxes;
}

export function useWorksView(reducedMotion: boolean, works: readonly Work[]) {
  const [chosen, setChosen] = useState<WorksView | null>(null);
  const [leaving, setLeaving] = useState(false);
  const finishLeaving = useCallback(() => setLeaving(false), []);
  const view: WorksView = chosen ?? (reducedMotion ? 'gallery' : 'spatial');
  const layerRef = useRef<HTMLCanvasElement>(null);
  const posters = useRef(new Map<string, HTMLImageElement>());
  const cancelRef = useRef(() => {});

  useEffect(() => {
    for (const work of works) {
      if (posters.current.has(work.id)) continue;
      const image = new Image();
      image.decoding = 'async';
      image.src = posterOf(work);
      posters.current.set(work.id, image);
    }
  }, [works]);

  useEffect(() => () => cancelRef.current(), []);

  const fly = useCallback((flights: Flight[], toGallery: boolean) => {
    const root = document.documentElement;
    const layer = layerRef.current;
    const scene = layer && flights.length ? createParticleScene(layer, FLIGHT.columns) : null;
    if (!layer || !scene) {
      delete root.dataset.worksMorph;
      return;
    }
    flights.forEach((flight) => {
      const poster = posters.current.get(flight.work.id);
      if (poster) scene.upload(poster, flight.slot);
    });
    layer.dataset.active = '';
    soundEngine.shimmer();
    soundEngine.fling(0.7);
    let frame = 0;
    let start = 0;
    let settle = 0;
    let disposed = false;
    const release = () => {
      if (disposed) return;
      disposed = true;
      scene.clear();
      scene.dispose();
    };
    const reveal = () => {
      cancelAnimationFrame(frame);
      delete root.dataset.worksMorph;
      delete layer.dataset.active;
    };
    const finish = () => {
      reveal();
      settle = window.setTimeout(release, FLIGHT.settle);
    };
    cancelRef.current = () => {
      reveal();
      window.clearTimeout(settle);
      release();
      cancelRef.current = () => {};
    };
    const tick = (time: number) => {
      start ||= time;
      const screen = { width: window.innerWidth, height: window.innerHeight };
      let landed = true;
      flights.forEach((flight, index) => {
        const amount = clamp01((time - start - flight.delay) / FLIGHT.duration);
        if (amount < 1) landed = false;
        const eased = easeInOutCubic(amount);
        scene.draw({ ...flight.point, ...screen }, flight.box, toGallery ? eased : 1 - eased, {
          slot: flight.slot,
          clear: index === 0,
        });
      });
      if (landed) {
        finish();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  }, []);

  const change = useCallback(
    (next: WorksView) => {
      if (next === view) return;
      cancelRef.current();
      setLeaving(false);
      const swap = () => flushSync(() => setChosen(next));
      if (reducedMotion || typeof document.startViewTransition !== 'function') {
        swap();
        return;
      }
      const root = document.documentElement;
      const toGallery = next === 'gallery';
      const loaded = (work: Work) => !!posters.current.get(work.id)?.naturalWidth;
      const pointsBefore = toGallery ? readPoints(works) : null;
      const boxesBefore = toGallery ? null : readBoxes();
      root.dataset.transition = 'works-view';
      const transition = document.startViewTransition(() => {
        root.dataset.worksMorph = next;
        if (toGallery) flushSync(() => setLeaving(true));
        swap();
        if (!toGallery) window.scrollTo(0, 0);
        const points = pointsBefore ?? predictPoints(works);
        const boxes = boxesBefore ?? readBoxes();
        const flights = works.flatMap((work, slot) => {
          const point = points.get(work.id);
          const box = boxes.get(work.id);
          if (!point || !box || !loaded(work)) return [];
          return [{ work, slot, point, box, delay: slot * FLIGHT.stagger }];
        });
        fly(flights, toGallery);
      });
      void transition.finished.finally(() => {
        if (root.dataset.transition === 'works-view') delete root.dataset.transition;
      });
    },
    [view, reducedMotion, works, fly],
  );

  return { view, change, layerRef, leaving, finishLeaving };
}
