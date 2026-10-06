import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { soundEngine } from '@/audio/soundEngine';
import type { SoundScene } from '@/constants/sounds';
import { isSoundEnabled, saveSoundEnabled } from '@/services/sound.service';

soundEngine.setEnabled(isSoundEnabled());

export function useSound() {
  const enabled = useSyncExternalStore(soundEngine.subscribe, soundEngine.isEnabled, () => false);

  const toggle = useCallback(() => {
    const next = !soundEngine.isEnabled();
    saveSoundEnabled(next);
    soundEngine.setEnabled(next);
    if (!next) return;
    soundEngine.unlock();
    soundEngine.play('sound-on');
  }, []);

  return {
    enabled,
    supported: soundEngine.supported,
    toggle,
    play: soundEngine.play,
    note: soundEngine.note,
  };
}

/** Switches the ambient bed and feedback palette while a page is mounted. */
export function useSoundScene(scene: SoundScene) {
  useEffect(() => {
    soundEngine.setScene(scene);
    return () => soundEngine.setScene('home');
  }, [scene]);
}
