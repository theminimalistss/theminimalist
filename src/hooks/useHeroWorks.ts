import { useEffect, useState } from 'react';
import { getHeroWorks } from '@/services/works.service';
import type { Work } from '@/types/work';

type WorksState =
  { status: 'loading' } | { status: 'ready'; works: Work[] } | { status: 'error'; message: string };

export function useHeroWorks() {
  const [state, setState] = useState<WorksState>({ status: 'loading' });
  const [request, setRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    void getHeroWorks(undefined, controller.signal).then(
      (works) => {
        if (!controller.signal.aborted) setState({ status: 'ready', works });
      },
      () => {
        if (!controller.signal.aborted) {
          setState({
            status: 'error',
            message: 'Our collection couldn’t be loaded. Please try again.',
          });
        }
      },
    );
    return () => controller.abort();
  }, [request]);

  function retry() {
    setState({ status: 'loading' });
    setRequest((current) => current + 1);
  }

  return { ...state, retry };
}

export type HeroWorks = ReturnType<typeof useHeroWorks>;
