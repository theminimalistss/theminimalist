import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePageReady } from '@/hooks/usePageReady';

describe('page readiness', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('waits for the minimum intro once the document has loaded', async () => {
    const { result } = renderHook(() => usePageReady(1_000, 5_000));
    expect(result.current).toBe(false);
    await act(() => vi.advanceTimersByTimeAsync(999));
    expect(result.current).toBe(false);
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(result.current).toBe(true);
  });

  it('never holds the page beyond the maximum wait', async () => {
    vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
    const { result } = renderHook(() => usePageReady(1_000, 3_000));
    await act(() => vi.advanceTimersByTimeAsync(2_000));
    expect(result.current).toBe(false);
    await act(() => vi.advanceTimersByTimeAsync(1_000));
    expect(result.current).toBe(true);
  });
});
