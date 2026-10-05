import { useEffect, useState } from 'react';

export function usePageReady(minimumDuration: number, maximumDuration: number) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timers: number[] = [];
    const wait = (duration: number) =>
      new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, duration)));
    const loaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener('load', () => resolve(), {
              once: true,
              signal: controller.signal,
            }),
          );
    const fonts = document.fonts?.ready ?? Promise.resolve();

    void Promise.race([
      Promise.all([loaded, fonts, wait(minimumDuration)]),
      wait(maximumDuration),
    ]).then(() => {
      if (!controller.signal.aborted) setReady(true);
    });

    return () => {
      controller.abort();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [minimumDuration, maximumDuration]);

  return ready;
}
