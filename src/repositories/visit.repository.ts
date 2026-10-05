export type VisitRepository = {
  hasSeenIntro(): boolean;
  markIntroSeen(): void;
};

const INTRO_KEY = 'the-minimalist:intro-seen';

export const sessionVisitRepository: VisitRepository = {
  hasSeenIntro() {
    try {
      return window.sessionStorage.getItem(INTRO_KEY) === '1';
    } catch {
      return false;
    }
  },
  markIntroSeen() {
    try {
      window.sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      // Storage can be blocked (private mode, policies); the full intro simply plays again.
    }
  },
};
