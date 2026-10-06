import { useEffect, useState } from 'react';
import { getCollectionWorks, getHeroWorks } from '@/services/works.service';
import type { Work } from '@/types/work';

type WorksState =
  { status: 'loading' } | { status: 'ready'; works: Work[] } | { status: 'error'; message: string };

function useWorks(load: typeof getHeroWorks) {
  const [state, setState] = useState<WorksState>({ status: 'loading' });
  const [request, setRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    void load(undefined, controller.signal).then(
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
  }, [load, request]);

  function retry() {
    setState({ status: 'loading' });
    setRequest((current) => current + 1);
  }

  return { ...state, retry };
}

export function useHeroWorks() {
  return useWorks(getHeroWorks);
}

export function useCollectionWorks() {
  return useWorks(getCollectionWorks);
}

export type HeroWorks = ReturnType<typeof useHeroWorks>;
