import { describe, expect, it, vi } from 'vitest';
import { getProductDetail, ProductContentError } from './productDetails.service';
import { productDetailsRepository } from '@/repositories/productDetails.repository';
import { PRODUCT_KEYS } from '@/types/content';
import {
  HARDWARE_PARTS,
  PRODUCT_LAYOUTS,
  SOFTWARE_VIEWS,
  type ProductDetailsRepository,
} from '@/types/product';

const repository = (value: unknown): ProductDetailsRepository => ({
  getProduct: async () => value,
});

describe('product detail content boundary', () => {
  it('loads distinct complete compositions with every supported illustration choice', async () => {
    const [software, templates, hardware] = await Promise.all(
      PRODUCT_KEYS.map((key) => getProductDetail(key)),
    );
    expect(software?.key).toBe('software');
    expect(templates?.key).toBe('templates');
    expect(hardware?.key).toBe('hardware');
    if (
      software?.key !== 'software' ||
      templates?.key !== 'templates' ||
      hardware?.key !== 'hardware'
    )
      throw new Error('Unexpected products');
    expect(software.views.map((item) => item.id)).toEqual(SOFTWARE_VIEWS);
    expect(templates.views.map((item) => item.id)).toEqual(PRODUCT_LAYOUTS);
    expect(hardware.parts.map((item) => item.id)).toEqual(HARDWARE_PARTS);
    expect(new Set([software.lead, templates.lead, hardware.lead]).size).toBe(3);
    expect(software.notice).toMatch(/in development/);
    expect(templates.notice).toMatch(/not yet published/);
    expect(hardware.notice).toMatch(/not a product specification/);
  });

  it('isolates repository snapshots from caller mutations', async () => {
    const first = await getProductDetail('hardware');
    if (first.key !== 'hardware') throw new Error('Unexpected product');
    first.parts[0]!.label = 'Mutated';
    const second = await getProductDetail('hardware');
    expect(second.key === 'hardware' && second.parts[0]!.label).toBe('Enclosure');
  });

  it('rejects malformed content and mismatched routes', async () => {
    for (const data of [
      null,
      [],
      {},
      { ...(await getProductDetail('software')), key: 'hardware' },
    ]) {
      await expect(getProductDetail('software', repository(data))).rejects.toBeInstanceOf(
        ProductContentError,
      );
    }
  });

  it('rejects blank text and incomplete supporting notes', async () => {
    const data = await getProductDetail('software');
    for (const change of [
      { notice: ' ' },
      { steps: [] },
      { steps: data.steps.slice(1) },
      { section: { title: 'Title', text: ' ' } },
    ]) {
      await expect(
        getProductDetail('software', repository({ ...data, ...change })),
      ).rejects.toBeInstanceOf(ProductContentError);
    }
  });

  it('rejects missing, duplicate, and unknown illustration choices in every composition', async () => {
    for (const key of PRODUCT_KEYS) {
      const data = await getProductDetail(key);
      const field = data.key === 'hardware' ? 'parts' : 'views';
      const options = data.key === 'hardware' ? data.parts : data.views;
      for (const invalid of [
        options.slice(1),
        [options[0], options[0], options[2]],
        [{ ...options[0], id: 'unknown' }, ...options.slice(1)],
      ]) {
        await expect(
          getProductDetail(key, repository({ ...data, [field]: invalid })),
        ).rejects.toBeInstanceOf(ProductContentError);
      }
    }
  });

  it('requires complete captions, examples, and material notes', async () => {
    const software = await getProductDetail('software');
    const hardware = await getProductDetail('hardware');
    if (software.key !== 'software' || hardware.key !== 'hardware')
      throw new Error('Unexpected products');
    await expect(
      getProductDetail(
        'software',
        repository({ ...software, views: software.views.map((item) => ({ ...item, items: [] })) }),
      ),
    ).rejects.toThrow(/empty/);
    await expect(
      getProductDetail(
        'software',
        repository({
          ...software,
          views: software.views.map((item) => ({ ...item, items: item.items.slice(1) })),
        }),
      ),
    ).rejects.toThrow(/three example/);
    await expect(
      getProductDetail(
        'hardware',
        repository({
          ...hardware,
          parts: hardware.parts.map((item) => ({ ...item, material: ' ' })),
        }),
      ),
    ).rejects.toThrow(/required/);
  });

  it('forwards cancellation and refuses data resolved after cancellation', async () => {
    const controller = new AbortController();
    const getProduct = vi.fn(productDetailsRepository.getProduct);
    await getProductDetail('templates', { getProduct }, controller.signal);
    expect(getProduct).toHaveBeenCalledWith('templates', controller.signal);
    controller.abort();
    await expect(getProductDetail('templates', undefined, controller.signal)).rejects.toMatchObject(
      { name: 'AbortError' },
    );
    await expect(
      getProductDetail(
        'templates',
        repository(await getProductDetail('templates')),
        controller.signal,
      ),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('propagates repository failures for callers to handle', async () => {
    await expect(
      getProductDetail('software', {
        getProduct: async () => {
          throw new Error('Unavailable');
        },
      }),
    ).rejects.toThrow('Unavailable');
  });
});
