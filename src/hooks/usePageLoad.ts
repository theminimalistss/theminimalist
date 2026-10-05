import { useEffect, useState } from 'react';
import { soundEngine } from '@/audio/soundEngine';
import { MAIN_CONTENT_ID } from '@/hooks/useRouteFocus';

type Options = { minimum: number; maximum: number };

function settled(target: EventTarget, events: string[]) {
  return new Promise<void>((resolve) => {
    const done = () => resolve();
    for (const event of events) target.addEventListener(event, done, { once: true });
  });
}

function inView(element: Element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.width > 0 &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth
  );
}

function visibleMedia() {
  const main = document.getElementById(MAIN_CONTENT_ID);
  if (!main) return [];
  const images = Array.from(main.querySelectorAll('img'))
    .filter((image) => !image.complete && inView(image))
    .map((image) => settled(image, ['load', 'error']));
  const videos = Array.from(main.querySelectorAll('video'))
    .filter((video) => !video.paused && video.readyState < 3 && inView(video))
    .map((video) => settled(video, ['canplay', 'error']));
  return [...images, ...videos];
}

export function usePageLoad({ minimum, maximum }: Options) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let active = true;
    let total = 0;
    let completed = 0;
    const timers: number[] = [];
    const wait = (duration: number) =>
      new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, duration)));
    const track = (tasks: Promise<unknown>[]) => {
      total += tasks.length;
      return Promise.all(
        tasks.map((task) =>
          task.then(() => {
            completed += 1;
            if (active) setProgress((current) => Math.max(current, completed / total));
          }),
        ),
      );
    };

    const loaded =
      document.readyState === 'complete' ? Promise.resolve() : settled(window, ['load']);
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const sounds = soundEngine.isEnabled() ? soundEngine.prefetch() : [];
    const essentials = track([loaded, fonts, ...sounds]);
    const media = loaded
      .then(() => new Promise((resolve) => requestAnimationFrame(resolve)))
      .then(() => track(visibleMedia()));

    void Promise.race([Promise.all([essentials, media, wait(minimum)]), wait(maximum)]).then(() => {
      if (!active) return;
      setProgress(1);
      setReady(true);
    });

    return () => {
      active = false;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [minimum, maximum]);

  return { ready, progress };
}
