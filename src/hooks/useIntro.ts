import { useState } from 'react';
import { completeIntro, getIntroMode } from '@/services/visit.service';

export function useIntro() {
  const [mode] = useState(() => getIntroMode());
  return { mode, complete: completeIntro };
}
