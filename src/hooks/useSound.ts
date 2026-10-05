import { useCallback, useSyncExternalStore } from 'react';
import { soundEngine } from '@/audio/soundEngine';
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

  return { enabled, supported: soundEngine.supported, toggle, play: soundEngine.play };
}
