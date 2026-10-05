import {
  localPreferencesRepository,
  type PreferencesRepository,
} from '@/repositories/preferences.repository';

export function isSoundEnabled(repository: PreferencesRepository = localPreferencesRepository) {
  return repository.getSound() !== 'off';
}

export function saveSoundEnabled(
  enabled: boolean,
  repository: PreferencesRepository = localPreferencesRepository,
) {
  repository.setSound(enabled ? 'on' : 'off');
}
