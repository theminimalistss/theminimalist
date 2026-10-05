import { sessionVisitRepository, type VisitRepository } from '@/repositories/visit.repository';

export type IntroMode = 'full' | 'brief';

export function getIntroMode(repository: VisitRepository = sessionVisitRepository): IntroMode {
  return repository.hasSeenIntro() ? 'brief' : 'full';
}

export function completeIntro(repository: VisitRepository = sessionVisitRepository) {
  repository.markIntroSeen();
}
