import { useSyncExternalStore } from 'react';

let entered = false;
const listeners = new Set<() => void>();

/** Called once the loader starts revealing the page; later navigations are already entered. */
export function markAppEntered() {
  if (entered) return;
  entered = true;
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function useAppEntered() {
  return useSyncExternalStore(
    subscribe,
    () => entered,
    () => false,
  );
}
