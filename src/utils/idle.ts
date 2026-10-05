export function scheduleIdle(callback: () => void, timeout = 2_000) {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, timeout / 2);
  return () => window.clearTimeout(id);
}
