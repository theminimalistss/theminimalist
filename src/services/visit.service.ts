import { sessionVisitRepository, type VisitRepository } from '@/repositories/visit.repository';

export type IntroMode = 'full' | 'brief';

const CAMPAIGN_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'fbclid',
  'gclid',
  'gbraid',
  'wbraid',
  'msclkid',
  'ttclid',
  'twclid',
  'li_fat_id',
  'igshid',
  'rdt_cid',
];

export function isCampaignVisit(search: string) {
  const params = new URLSearchParams(search);
  return CAMPAIGN_PARAMS.some((key) => params.has(key));
}

export function getIntroMode(
  repository: VisitRepository = sessionVisitRepository,
  search = window.location.search,
): IntroMode {
  return repository.hasSeenIntro() || isCampaignVisit(search) ? 'brief' : 'full';
}

export function completeIntro(repository: VisitRepository = sessionVisitRepository) {
  repository.markIntroSeen();
}
