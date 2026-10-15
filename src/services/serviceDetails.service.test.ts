import { describe, expect, it, vi } from 'vitest';
import { getServiceDetail, ServiceContentError } from './serviceDetails.service';
import { serviceDetailsRepository } from '@/repositories/serviceDetails.repository';
import { SERVICE_KEYS, SOFTWARE_PLATFORMS, type ServiceDetailsRepository } from '@/types/service';

describe('service detail content boundary', () => {
  it('loads distinct, complete service narratives and a local responsive illustration', async () => {
    const details = await Promise.all(SERVICE_KEYS.map((key) => getServiceDetail(key)));
    expect(details.map((item) => item.key)).toEqual(SERVICE_KEYS);
    expect(new Set(details.map((item) => item.lead)).size).toBe(3);
    expect(details.map((item) => item.process.steps.length)).toEqual([4, 4, 3]);
    expect(details.map((item) => item.capabilities.items.length)).toEqual([3, 3, 6]);
    const software = details.find((item) => item.key === 'software');
    expect(software?.preview.platforms.map((item) => item.id)).toEqual(SOFTWARE_PLATFORMS);
    const website = details.find((item) => item.key === 'websites');
    expect(website?.preview.image.src).toMatch(/^\/.*\.avif$/u);
  });

  it('returns isolated content snapshots', async () => {
    const first = await getServiceDetail('software');
    first.capabilities.items[0]!.title = 'Changed';
    expect((await getServiceDetail('software')).capabilities.items[0]!.title).toBe('Products');
  });

  it('rejects malformed or empty content at the boundary', async () => {
    for (const data of [null, [], {}, { title: ' ' }]) {
      const repository: ServiceDetailsRepository = { getService: async () => data };
      await expect(getServiceDetail('software', repository)).rejects.toBeInstanceOf(
        ServiceContentError,
      );
    }
  });

  it('rejects empty capabilities instead of rendering an incomplete page', async () => {
    const data = await getServiceDetail('software');
    const repository: ServiceDetailsRepository = {
      getService: async () => ({ ...data, capabilities: { ...data.capabilities, items: [] } }),
    };
    await expect(getServiceDetail('software', repository)).rejects.toThrow(/empty/u);
  });

  it('rejects duplicate software platform identities', async () => {
    const data = await getServiceDetail('software');
    if (data.key !== 'software') throw new Error('Wrong fixture');
    const repository: ServiceDetailsRepository = {
      getService: async () => ({
        ...data,
        preview: {
          ...data.preview,
          platforms: [data.preview.platforms[0], data.preview.platforms[0]],
        },
      }),
    };
    await expect(getServiceDetail('software', repository)).rejects.toThrow(/unique/u);
  });

  it('requires every software platform and rejects unknown platform identifiers', async () => {
    const data = await getServiceDetail('software');
    if (data.key !== 'software') throw new Error('Wrong fixture');
    for (const platforms of [
      data.preview.platforms.slice(1),
      [...data.preview.platforms.slice(1), { ...data.preview.platforms[0]!, id: 'television' }],
    ]) {
      const repository: ServiceDetailsRepository = {
        getService: async () => ({ ...data, preview: { ...data.preview, platforms } }),
      };
      await expect(getServiceDetail('software', repository)).rejects.toBeInstanceOf(
        ServiceContentError,
      );
    }
  });

  it('rejects hotlinked or unoptimised illustration sources', async () => {
    const data = await getServiceDetail('websites');
    if (data.key !== 'websites') throw new Error('Wrong fixture');
    for (const src of [
      'https://example.com/image.avif',
      '//example.com/image.avif',
      '/image.png',
      '/../image.avif',
    ]) {
      const repository: ServiceDetailsRepository = {
        getService: async () => ({
          ...data,
          preview: { ...data.preview, image: { ...data.preview.image, src } },
        }),
      };
      await expect(getServiceDetail('websites', repository)).rejects.toThrow(/local optimised/u);
    }
  });

  it('forwards cancellation and repository failures', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(getServiceDetail('software', undefined, controller.signal)).rejects.toMatchObject({
      name: 'AbortError',
    });
    const getService = vi.fn(serviceDetailsRepository.getService);
    const signal = new AbortController().signal;
    await getServiceDetail('branding', { getService }, signal);
    expect(getService).toHaveBeenCalledWith('branding', signal);
    await expect(
      getServiceDetail('software', {
        getService: async () => {
          throw new Error('Offline');
        },
      }),
    ).rejects.toThrow('Offline');
  });
});
