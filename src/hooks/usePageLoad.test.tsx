import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePageLoad } from '@/hooks/usePageLoad';

describe('page load', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('waits for content and the minimum intro, reporting progress', async () => {
    const { result } = renderHook(() => usePageLoad({ minimum: 1_000, maximum: 5_000 }));
    expect(result.current.ready).toBe(false);
    await act(() => vi.advanceTimersByTimeAsync(999));
    expect(result.current.ready).toBe(false);
    expect(result.current.progress).toBe(1);
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(result.current.ready).toBe(true);
  });

  it('never holds the page beyond the maximum wait', async () => {
    vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
    const { result } = renderHook(() => usePageLoad({ minimum: 1_000, maximum: 3_000 }));
    await act(() => vi.advanceTimersByTimeAsync(2_000));
    expect(result.current.ready).toBe(false);
    expect(result.current.progress).toBeLessThan(1);
    await act(() => vi.advanceTimersByTimeAsync(1_000));
    expect(result.current.ready).toBe(true);
    expect(result.current.progress).toBe(1);
  });
});
