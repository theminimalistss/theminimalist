import { useCallback, useState } from 'react';
import { flushSync } from 'react-dom';

export type WorksView = 'spatial' | 'gallery';

/** Switches presentations inside a view transition so the page crossfades and the title glides. */
export function useWorksView(reducedMotion: boolean) {
  const [chosen, setChosen] = useState<WorksView | null>(null);
  const view: WorksView = chosen ?? (reducedMotion ? 'gallery' : 'spatial');

  const change = useCallback(
    (next: WorksView) => {
      if (next === view) return;
      const swap = () => flushSync(() => setChosen(next));
      if (reducedMotion || typeof document.startViewTransition !== 'function') {
        swap();
        return;
      }
      const root = document.documentElement;
      root.dataset.transition = 'works-view';
      const transition = document.startViewTransition(swap);
      void transition.finished.finally(() => {
        if (root.dataset.transition === 'works-view') delete root.dataset.transition;
      });
    },
    [view, reducedMotion],
  );

  return { view, change };
}
