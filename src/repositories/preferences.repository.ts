export type SoundSetting = 'on' | 'off';

export type PreferencesRepository = {
  getSound(): SoundSetting | null;
  setSound(setting: SoundSetting): void;
};

const SOUND_KEY = 'the-minimalist:sound';

export const localPreferencesRepository: PreferencesRepository = {
  getSound() {
    try {
      const value = window.localStorage.getItem(SOUND_KEY);
      return value === 'on' || value === 'off' ? value : null;
    } catch {
      return null;
    }
  },
  setSound(setting) {
    try {
      window.localStorage.setItem(SOUND_KEY, setting);
    } catch {
      // Storage can be blocked; the choice then lasts for this page view only.
    }
  },
};
