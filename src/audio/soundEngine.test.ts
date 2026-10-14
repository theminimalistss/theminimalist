import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAmbient } from '@/audio/ambient';
import { AMBIENT } from '@/constants/sounds';

vi.mock('@/audio/ambient', () => ({
  createAmbient: vi.fn(() => ({ stop: vi.fn() })),
  createImpulse: vi.fn(),
}));

const decoded = vi.fn();
const liveContext = vi.fn();
class Decoder {
  decodeAudioData(
    data: ArrayBuffer,
    success: (buffer: AudioBuffer) => void,
    failure: (error: Error) => void,
  ) {
    decoded(data);
    if (new Uint8Array(data)[0] === 0) failure(new Error('Unsupported format'));
    else success({} as AudioBuffer);
  }
}

beforeEach(() => {
  vi.resetModules();
  decoded.mockClear();
  liveContext.mockClear();
  vi.mocked(createAmbient).mockClear();
  vi.stubGlobal('AudioContext', liveContext);
  vi.stubGlobal('OfflineAudioContext', Decoder);
  vi.spyOn(HTMLMediaElement.prototype, 'canPlayType').mockReturnValue('probably');
});
afterEach(() => vi.unstubAllGlobals());

function response(byte = 1) {
  return { ok: true, arrayBuffer: async () => new Uint8Array([byte]).buffer };
}

describe('audio preparation', () => {
  it('shares downloads and decodes before entry without creating a playback context', async () => {
    const fetcher = vi.fn(async () => response());
    vi.stubGlobal('fetch', fetcher);
    const { soundEngine } = await import('@/audio/soundEngine');
    const first = soundEngine.prefetch();
    const second = soundEngine.prefetch();
    expect(first).toHaveLength(8);
    expect(second).toEqual(first);
    await Promise.all(first);
    await Promise.all(soundEngine.prefetch());
    expect(fetcher).toHaveBeenCalledTimes(8);
    expect(decoded).toHaveBeenCalledTimes(8);
    expect(liveContext).not.toHaveBeenCalled();
  });

  it('falls back to MP3 when downloaded WebM cannot be decoded', async () => {
    const fetcher = vi.fn(async (url: string) => response(url.endsWith('.webm') ? 0 : 1));
    vi.stubGlobal('fetch', fetcher);
    const { soundEngine } = await import('@/audio/soundEngine');
    await Promise.all(soundEngine.prefetch());
    expect(fetcher).toHaveBeenCalledTimes(16);
    expect(decoded).toHaveBeenCalledTimes(16);
    expect(fetcher.mock.calls.filter(([url]) => url.endsWith('.mp3'))).toHaveLength(8);
  });

  it('reports failure and retries only the missing sample', async () => {
    let fail = true;
    const fetcher = vi.fn(async (url: string) => {
      if (fail && url.includes('detent')) throw new Error('Offline');
      return response();
    });
    vi.stubGlobal('fetch', fetcher);
    const { soundEngine } = await import('@/audio/soundEngine');
    const results = await Promise.allSettled(soundEngine.prefetch());
    expect(results.filter((result) => result.status === 'rejected')).toHaveLength(1);
    fail = false;
    await Promise.all(soundEngine.prefetch());
    expect(fetcher.mock.calls.filter(([url]) => url.includes('detent'))).toHaveLength(3);
    expect(fetcher).toHaveBeenCalledTimes(10);
    expect(decoded).toHaveBeenCalledTimes(8);
  });

  it('keeps one default ambient playing when Works and other pages change feedback scenes', async () => {
    class PlaybackContext {
      state = 'running';
      currentTime = 0;
      sampleRate = 100;
      destination = {};
      resume = vi.fn(async () => undefined);
      createBuffer() {
        return { getChannelData: () => new Float32Array(100) };
      }
      createGain() {
        return { gain: { value: 0, setTargetAtTime: vi.fn() }, connect: vi.fn() };
      }
    }
    vi.stubGlobal('AudioContext', PlaybackContext);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => response()),
    );
    const { soundEngine } = await import('@/audio/soundEngine');
    await Promise.all(soundEngine.prefetch());
    soundEngine.unlock();
    soundEngine.setScene('works');
    soundEngine.setScene('home');
    soundEngine.setScene('works');
    expect(createAmbient).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createAmbient).mock.calls[0]?.[3]).toEqual(AMBIENT);
  });
});
