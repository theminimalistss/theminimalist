import { useEffect, useRef } from 'react';
import { soundEngine } from '@/audio/soundEngine';
import { scheduleIdle } from '@/utils/idle';

const INTERACTIVE = 'a[href], button:not(:disabled), [role="button"], summary';

function interactive(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  const element = target.closest(INTERACTIVE);
  return element && !element.closest('[data-sound="off"]') ? element : null;
}

export function useInteractionSounds(pathname: string, menuOpen: boolean) {
  const previousPath = useRef(pathname);
  const previousMenu = useRef(menuOpen);

  useEffect(() => {
    let hovered: Element | null = null;
    const unlock = () => soundEngine.unlock();
    const over = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const element = interactive(event.target);
      if (element === hovered) return;
      hovered = element;
      if (element) soundEngine.play('hover');
    };
    const down = (event: PointerEvent) => {
      unlock();
      if (event.button === 0 && interactive(event.target)) soundEngine.play('click');
    };
    const key = (event: KeyboardEvent) => {
      unlock();
      if ((event.key === 'Enter' || event.key === ' ') && interactive(event.target)) {
        soundEngine.play('click');
      }
    };
    const visibility = () => soundEngine.setVisible(document.visibilityState === 'visible');
    const cancelIdle = scheduleIdle(() => void soundEngine.prefetch(), 5_000);
    document.addEventListener('visibilitychange', visibility);
    document.addEventListener('click', unlock, { capture: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('pointerdown', down, { passive: true, capture: true });
    document.addEventListener('keydown', key, { capture: true });
    return () => {
      cancelIdle();
      document.removeEventListener('visibilitychange', visibility);
      document.removeEventListener('click', unlock, { capture: true });
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerdown', down, { capture: true });
      document.removeEventListener('keydown', key, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (previousMenu.current === menuOpen) return;
    previousMenu.current = menuOpen;
    soundEngine.play(menuOpen ? 'menu-open' : 'menu-close');
  }, [menuOpen]);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    soundEngine.play('navigate');
  }, [pathname]);
}
