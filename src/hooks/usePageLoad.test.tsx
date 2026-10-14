import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { soundEngine } from '@/audio/soundEngine';
import { usePageLoad } from '@/hooks/usePageLoad';

vi.mock('@/audio/soundEngine', () => ({ soundEngine: { prefetch: vi.fn(() => []) } }));

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe('page load', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(soundEngine.prefetch).mockReturnValue([]);
    const main = document.createElement('main');
    main.id = 'main-content';
    document.body.append(main);
  });
  afterEach(() => {
    document.getElementById('main-content')?.remove();
    delete (document as { fonts?: FontFaceSet }).fonts;
    vi.useRealTimers();
  });

  it('waits for content and the minimum intro, reporting progress', async () => {
    const { result } = renderHook(() => usePageLoad({ minimum: 1_000, maximum: 5_000 }));
    expect(result.current.ready).toBe(false);
    await act(() => vi.advanceTimersByTimeAsync(999));
    expect(result.current.ready).toBe(false);
    expect(result.current.progress).toBeLessThan(1);
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(result.current.ready).toBe(true);
    expect(result.current.progress).toBe(1);
  });

  it('bounds visual readiness without bypassing pending audio', async () => {
    const audio = deferred();
    vi.mocked(soundEngine.prefetch).mockReturnValue([audio.promise]);
    const fonts = deferred();
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: fonts.promise },
    });
    const { result } = renderHook(() => usePageLoad({ minimum: 1_000, maximum: 3_000 }));
    await act(() => vi.advanceTimersByTimeAsync(5_000));
    expect(result.current.ready).toBe(false);
    expect(result.current.progress).toBeCloseTo(5 / 6);
    await act(async () => audio.resolve());
    expect(result.current.ready).toBe(true);
    expect(result.current.progress).toBe(1);
  });

  it('includes every audio task and never reports full progress early', async () => {
    const first = deferred();
    const second = deferred();
    vi.mocked(soundEngine.prefetch).mockReturnValue([first.promise, second.promise]);
    const { result } = renderHook(() => usePageLoad({ minimum: 500, maximum: 3_000 }));
    await act(() => vi.advanceTimersByTimeAsync(1_000));
    const before = result.current.progress;
    await act(async () => first.resolve());
    expect(result.current.progress).toBeGreaterThan(before);
    expect(result.current.progress).toBeLessThan(1);
    expect(result.current.ready).toBe(false);
    await act(async () => second.resolve());
    expect(result.current.ready).toBe(true);
  });

  it('keeps failed audio behind the loader and retries it', async () => {
    vi.mocked(soundEngine.prefetch).mockReturnValueOnce([Promise.reject(new Error('Offline'))]);
    const { result } = renderHook(() => usePageLoad({ minimum: 500, maximum: 3_000 }));
    await act(() => vi.advanceTimersByTimeAsync(1_000));
    expect(result.current.audioError).toBe(true);
    expect(result.current.ready).toBe(false);
    expect(result.current.progress).toBeLessThan(1);
    act(() => result.current.retryAudio());
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(result.current.audioError).toBe(false);
    expect(result.current.ready).toBe(true);
  });

  it('waits for a lazy route to mount before completing visual readiness', async () => {
    document.getElementById('main-content')?.remove();
    const { result } = renderHook(() => usePageLoad({ minimum: 500, maximum: 3_000 }));
    await act(() => vi.advanceTimersByTimeAsync(4_000));
    expect(result.current.ready).toBe(false);
    expect(result.current.progress).toBeLessThan(1);
    await act(async () => {
      const main = document.createElement('main');
      main.id = 'main-content';
      document.body.append(main);
    });
    await act(() => vi.advanceTimersByTimeAsync(20));
    expect(result.current.ready).toBe(true);
  });
});
