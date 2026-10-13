import { useEffect, useRef } from 'react';
import { useAppEntered } from '@/hooks/useAppEntered';
import { SERVICE_PROCESS_MOTION } from '@/constants/motion';
import { createServiceScene } from '@/utils/serviceScene';

type Controller = { show: (stage: number, animate: boolean) => void };
type Phase = 'out' | 'in' | 'idle';

export function useServiceDrawing(active: number, animate: boolean, reducedMotion: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const entered = useAppEntered();
  const controller = useRef<Controller | null>(null);
  const latest = useRef({ active, animate });
  useEffect(() => {
    latest.current = { active, animate };
  }, [active, animate]);
  useEffect(() => {
    const root = ref.current,
      canvas = root?.querySelector('canvas');
    if (!root || !canvas || !entered || reducedMotion) return;
    const scene = createServiceScene(canvas);
    if (!scene) return;
    const { trace, untrace, fps, idleFps, settle, release } = SERVICE_PROCESS_MOTION;
    let frame = 0,
      previous = 0,
      clock = 0,
      lost = false,
      running = false;
    let current = latest.current.active,
      target = current,
      phase: Phase = 'in',
      progress = 0;
    const motion = { seconds: 0, amount: 0 };
    const reveal = () => (phase === 'in' ? progress : phase === 'out' ? 1 - progress : 1);
    const render = () => scene.draw(current, reveal(), clock, motion);
    const advance = (delta: number) => {
      if (phase === 'idle' && target !== current) {
        phase = 'out';
        progress = 0;
      }
      if (phase === 'idle') {
        motion.seconds += delta / 1000;
        motion.amount += (1 - motion.amount) * (1 - Math.exp(-delta / settle));
        return;
      }
      if (phase === 'out') motion.amount *= Math.exp(-delta / release);
      progress = Math.min(1, progress + delta / (phase === 'out' ? untrace : trace));
      if (progress < 1) return;
      if (phase === 'out') {
        current = target;
        phase = 'in';
        progress = 0;
        motion.seconds = 0;
        motion.amount = 0;
      } else phase = 'idle';
    };
    const tick = (time: number) => {
      frame = 0;
      if (!running || lost) return;
      const rate = phase === 'idle' ? idleFps : fps;
      if (previous && time - previous < 1000 / rate) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const delta = previous ? Math.min(100, time - previous) : 1000 / rate;
      previous = time;
      clock += delta;
      advance(delta);
      render();
      frame = requestAnimationFrame(tick);
    };
    const show = (stage: number, enabled: boolean) => {
      if (lost) return;
      if (stage !== target) {
        if (phase === 'in' && stage !== current) {
          phase = 'out';
          progress = 1 - progress;
        } else if (phase === 'out' && stage === current) {
          phase = 'in';
          progress = 1 - progress;
        }
        target = stage;
      }
      running = enabled;
      if (!enabled) {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
        render();
        return;
      }
      if (!frame) {
        previous = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    root.dataset.renderer = 'webgl';
    render();
    const lostContext = (event: Event) => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      delete root.dataset.renderer;
    };
    canvas.addEventListener('webglcontextlost', lostContext);
    const resize = new ResizeObserver(() => {
      if (!lost) render();
    });
    resize.observe(root);
    controller.current = { show };
    show(latest.current.active, latest.current.animate);
    return () => {
      controller.current = null;
      resize.disconnect();
      cancelAnimationFrame(frame);
      canvas.removeEventListener('webglcontextlost', lostContext);
      delete root.dataset.renderer;
      if (!lost) scene.dispose();
    };
  }, [entered, reducedMotion]);
  useEffect(
    () => controller.current?.show(active, animate),
    [active, animate, entered, reducedMotion],
  );
  return ref;
}
