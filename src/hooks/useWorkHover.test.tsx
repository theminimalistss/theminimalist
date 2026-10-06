import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useWorkHover } from '@/hooks/useWorkHover';

describe('work hover', () => {
  afterEach(() => vi.useRealTimers());
  it('keeps the preview open while crossing the gap from the point to the card', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useWorkHover());
    act(() => result.current.reveal(2));
    act(() => result.current.leave());
    act(() => vi.advanceTimersByTime(100));
    act(() => result.current.hold());
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.active).toBe(true);
    act(() => result.current.dismiss());
    expect(result.current.active).toBe(false);
    expect(result.current.index).toBe(2);
  });
  it('cancels delayed dismissal when another point is selected', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useWorkHover());
    act(() => result.current.reveal(0));
    act(() => result.current.leave());
    act(() => result.current.reveal(1));
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.active).toBe(true);
    expect(result.current.index).toBe(1);
    act(() => result.current.leave());
    act(() => vi.advanceTimersByTime(250));
    expect(result.current.active).toBe(false);
  });
});
