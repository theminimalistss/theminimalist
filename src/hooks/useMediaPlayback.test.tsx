import { act, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMediaPlayback } from '@/hooks/useMediaPlayback';

let notify: (visible: boolean) => void;
const disconnect = vi.fn();

function Harness({ enabled }: { enabled: boolean }) {
  const { videoRef, unavailable } = useMediaPlayback(enabled);
  return (
    <>
      <video ref={videoRef} />
      <span>{unavailable ? 'Poster fallback' : 'Media ready'}</span>
    </>
  );
}

describe('media lifecycle', () => {
  beforeEach(() => {
    disconnect.mockClear();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          notify = (visible: boolean) =>
            callback(
              [
                {
                  isIntersecting: visible,
                  intersectionRatio: visible ? 1 : 0,
                } as IntersectionObserverEntry,
              ],
              this as unknown as IntersectionObserver,
            );
        }
        observe() {}
        disconnect = disconnect;
      },
    );
  });

  it('plays only visible enabled video, pauses on exit, and cleans up', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    const { unmount } = render(<Harness enabled />);
    expect(play).not.toHaveBeenCalled();
    act(() => notify(true));
    await waitFor(() => expect(play).toHaveBeenCalledOnce());
    act(() => notify(false));
    expect(pause).toHaveBeenCalled();
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it('never autoplays when motion is disabled', () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    render(<Harness enabled={false} />);
    act(() => notify(true));
    expect(play).not.toHaveBeenCalled();
  });

  it('falls back to the poster when autoplay is denied', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(
      new DOMException('Denied', 'NotAllowedError'),
    );
    const { getByText } = render(<Harness enabled />);
    act(() => notify(true));
    await waitFor(() => expect(getByText('Poster fallback')).toBeInTheDocument());
  });
});
