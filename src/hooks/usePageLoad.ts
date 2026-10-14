import { useCallback, useEffect, useState } from 'react';
import { soundEngine } from '@/audio/soundEngine';
import { MAIN_CONTENT_ID } from '@/hooks/useRouteFocus';

type Options = { minimum: number; maximum: number };

function settled(target: EventTarget, events: string[], cleanup: (() => void)[]) {
  return new Promise<void>((resolve) => {
    const cancel = () => events.forEach((event) => target.removeEventListener(event, done));
    const done = () => {
      cancel();
      resolve();
    };
    cleanup.push(cancel);
    for (const event of events) target.addEventListener(event, done, { once: true });
  });
}

function mainMounted(cleanup: (() => void)[]) {
  if (document.getElementById(MAIN_CONTENT_ID)) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.getElementById(MAIN_CONTENT_ID)) return;
      observer.disconnect();
      resolve();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    cleanup.push(() => observer.disconnect());
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

function visibleMedia(cleanup: (() => void)[]) {
  const main = document.getElementById(MAIN_CONTENT_ID);
  if (!main) return [];
  return Array.from(main.querySelectorAll('img'))
    .filter((image) => !image.complete && inView(image))
    .map((image) => settled(image, ['load', 'error'], cleanup));
}

export function usePageLoad({ minimum, maximum }: Options) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const retryAudio = useCallback(() => {
    setAudioError(false);
    setProgress(0);
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    let active = true;
    const timers: number[] = [];
    const cleanup: (() => void)[] = [];
    const wait = (duration: number) =>
      new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, duration)));
    const audio = soundEngine.prefetch();
    const completed = new Set<number>();
    const visualCount = 5;
    const total = visualCount + audio.length;
    const complete = (index: number) => {
      completed.add(index);
      if (active) setProgress(completed.size / total);
    };
    const loaded =
      document.readyState !== 'loading'
        ? Promise.resolve()
        : settled(document, ['DOMContentLoaded'], cleanup);
    const content = loaded
      .then(() => (active ? mainMounted(cleanup) : undefined))
      .then(
        () =>
          new Promise<void>((resolve) => {
            if (!active) {
              resolve();
              return;
            }
            const frame = requestAnimationFrame(() => resolve());
            cleanup.push(() => cancelAnimationFrame(frame));
          }),
      );
    const fonts = content.then(() => document.fonts?.ready);
    const media = content.then(() => (active ? Promise.all(visibleMedia(cleanup)) : undefined));
    const visualTasks = [loaded, content, fonts, media, wait(minimum)];
    const visuals = Promise.race([
      Promise.all(
        visualTasks.map((task, index) => task.catch(() => undefined).then(() => complete(index))),
      ),
      wait(maximum),
    ]).then(() => {
      // Fonts/images may time out; the initial route itself must exist before entry.
      for (let index = 0; index < visualCount; index++) if (index !== 1) complete(index);
    });
    const sounds = Promise.all(
      audio.map((task, index) => task.then(() => complete(visualCount + index))),
    );
    void Promise.all([visuals, sounds, content]).then(
      () => {
        if (active) setReady(true);
      },
      () => {
        if (active) setAudioError(true);
      },
    );
    return () => {
      active = false;
      timers.forEach((timer) => window.clearTimeout(timer));
      cleanup.forEach((cancel) => cancel());
    };
  }, [minimum, maximum, attempt]);

  return { ready, progress, audioError, retryAudio };
}
