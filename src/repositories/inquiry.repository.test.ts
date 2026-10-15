import { afterEach, describe, expect, it, vi } from 'vitest';
import { createInquiryRepository } from '@/repositories/inquiry.repository';
import { emptyInquiry } from '@/services/inquiry.service';

afterEach(() => vi.unstubAllGlobals());

describe('inquiry repository', () => {
  it('is unavailable without an endpoint', () => {
    expect(createInquiryRepository(' ').available).toBe(false);
  });

  it('posts JSON and returns the status with any JSON body', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response('{"ok":true}', { status: 202 }))
      .mockResolvedValueOnce(new Response('<html>', { status: 500 }));
    vi.stubGlobal('fetch', fetch);
    const repository = createInquiryRepository('https://api.example.com');
    const payload = { ...emptyInquiry(), website: '' };
    await expect(repository.send(payload)).resolves.toEqual({ status: 202, body: { ok: true } });
    await expect(repository.send(payload)).resolves.toEqual({ status: 500, body: null });
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.example.com');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual(payload);
  });
});
