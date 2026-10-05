import { useCallback, useEffect, useRef, useState } from 'react';
import { MEDIA_FLIGHT } from '@/constants/motion';

export type FlightPhase = 'idle' | 'opening' | 'open' | 'closing';

type Box = { top: number; left: number; width: number; height: number };

const toKeyframe = ({ top, left, width, height }: Box): Keyframe => ({
  top: `${top}px`,
  left: `${left}px`,
  width: `${width}px`,
  height: `${height}px`,
});

function findSource(id: string) {
  return document.querySelector<HTMLElement>(`[data-work-id="${CSS.escape(id)}"]`);
}

function settleImage(container: HTMLElement) {
  const image = container.querySelector('img');
  if (!image || image.complete) return Promise.resolve();
  return Promise.race([
    image.decode().catch(() => undefined),
    new Promise((resolve) => window.setTimeout(resolve, MEDIA_FLIGHT.imageWait)),
  ]);
}

export function useMediaFlight(workId: string | null, animated: boolean, onClosed: () => void) {
  const ghostRef = useRef<HTMLImageElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closedRef = useRef(onClosed);
  const [phase, setPhase] = useState<FlightPhase>('idle');
  const [lastId, setLastId] = useState(workId);

  if (workId !== lastId) {
    setLastId(workId);
    setPhase(workId ? (animated ? 'opening' : 'open') : 'idle');
  }

  useEffect(() => {
    closedRef.current = onClosed;
  });

  useEffect(() => {
    if (!workId || (phase !== 'opening' && phase !== 'closing')) return;
    const source = findSource(workId);
    const ghost = ghostRef.current;
    const target = targetRef.current;
    const panel = panelRef.current;
    const opening = phase === 'opening';
    let active = true;

    if (!source || !ghost || !target || !panel || !ghost.animate) {
      const frame = requestAnimationFrame(() => (opening ? setPhase('open') : closedRef.current()));
      return () => cancelAnimationFrame(frame);
    }

    const inFlight = ghost.getAnimations().some((animation) => animation.playState === 'running');
    const start = opening
      ? source.getBoundingClientRect()
      : (inFlight ? ghost : target).getBoundingClientRect();
    const end = opening ? target.getBoundingClientRect() : source.getBoundingClientRect();
    ghost.getAnimations().forEach((animation) => animation.cancel());
    panel.getAnimations().forEach((animation) => animation.cancel());
    ghost.src = source.querySelector('img')?.currentSrc ?? '';
    source.dataset.dialogSource = '';

    const timing = { duration: MEDIA_FLIGHT.duration, easing: MEDIA_FLIGHT.easing };
    const flight = ghost.animate([toKeyframe(start), toKeyframe(end)], { ...timing, fill: 'both' });
    const panelKeyframes = [
      { opacity: 0, transform: 'translateY(24px)' },
      { opacity: 1, transform: 'none' },
    ];
    panel.animate(opening ? panelKeyframes : [...panelKeyframes].reverse(), {
      duration: opening ? MEDIA_FLIGHT.panelIn : MEDIA_FLIGHT.panelOut,
      delay: opening ? MEDIA_FLIGHT.panelDelay : 0,
      easing: MEDIA_FLIGHT.easing,
      fill: opening ? 'backwards' : 'forwards',
    });

    void flight.finished.then(
      async () => {
        if (!active) return;
        if (opening) {
          await settleImage(target);
          if (active) setPhase('open');
          return;
        }
        delete source.dataset.dialogSource;
        closedRef.current();
      },
      () => undefined,
    );

    return () => {
      active = false;
    };
  }, [workId, phase]);

  useEffect(() => {
    if (workId) return;
    document.querySelectorAll<HTMLElement>('[data-dialog-source]').forEach((element) => {
      delete element.dataset.dialogSource;
    });
  }, [workId]);

  const requestClose = useCallback(() => {
    if (animated) setPhase('closing');
    else closedRef.current();
  }, [animated]);

  return { phase, ghostRef, targetRef, panelRef, requestClose };
}
