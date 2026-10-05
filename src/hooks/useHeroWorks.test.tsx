import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getHeroWorks } from '@/services/works.service';
import { useHeroWorks } from '@/hooks/useHeroWorks';
import { imageWork } from '@/tests/fixtures';

vi.mock('@/services/works.service', () => ({ getHeroWorks: vi.fn() }));
const service = vi.mocked(getHeroWorks);

describe('useHeroWorks', () => {
  beforeEach(() => {
    service.mockReset();
  });

  it('moves from loading to ready', async () => {
    service.mockResolvedValue([imageWork]);
    const { result } = renderHook(useHeroWorks);
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('ready'));
    if (result.current.status === 'ready') expect(result.current.works).toEqual([imageWork]);
  });

  it('exposes a useful error and supports retry', async () => {
    service.mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce([imageWork]);
    const { result } = renderHook(useHeroWorks);
    await waitFor(() => expect(result.current.status).toBe('error'));
    act(() => result.current.retry());
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('ready'));
  });

  it('aborts work on unmount', () => {
    service.mockImplementation(() => new Promise(() => {}));
    const { unmount } = renderHook(useHeroWorks);
    const signal = service.mock.calls[0]?.[1];
    unmount();
    expect(signal?.aborted).toBe(true);
  });
});
