import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage, settle } from './helpers';

function clearFrame(page: Page) {
  return page.evaluate(() => {
    const intro = document.querySelector('.testimonials-intro')!.getBoundingClientRect();
    const box = [...document.querySelectorAll('.testimonial-space [data-frame]')]
      .map((element) => element.getBoundingClientRect())
      .filter(
        (rect) =>
          rect.top > 140 &&
          rect.bottom < innerHeight - 40 &&
          rect.left > 0 &&
          rect.right < innerWidth &&
          (rect.left > intro.right || rect.right < intro.left || rect.bottom < intro.top),
      )
      .sort((a, b) => b.width - a.width)[0];
    return box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : null;
  });
}

test('testimonial frames fall through depth, hold on hover, and open in full', async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await openPage(page, '/testimonials');
  const list = page.getByRole('list', { name: 'Client testimonials' });
  await expect(list.getByRole('listitem')).toHaveCount(13);
  const frame = list.getByRole('button', { name: 'Read Demi Rodrigo, Sevenstreet Bakery' });
  const y = async () => (await frame.boundingBox())?.y ?? 0;
  const before = await y();
  await expect.poll(y).not.toBe(before);
  if (!isMobile) {
    let target = await clearFrame(page);
    await expect.poll(async () => (target = await clearFrame(page))).not.toBeNull();
    if (!target) return;
    await page.mouse.move(target.x, target.y, { steps: 4 });
    const focused = page.locator('.testimonial-space [data-focused]');
    await expect(focused).toHaveCount(1);
    const held = async () => (await focused.boundingBox())?.y ?? 0;
    await page.waitForTimeout(1_200);
    const settled = await held();
    await page.waitForTimeout(400);
    expect(Math.abs((await held()) - settled)).toBeLessThan(1);
    await page.mouse.move(5, 5);
  }
  await frame.evaluate((element) => (element as HTMLElement).click());
  const dialog = page.getByRole('dialog', { name: 'Demi Rodrigo' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('just what I was looking for.');
  await expect(dialog).toContainText('Sevenstreet Bakery');
  await dialog.getByRole('button', { name: 'Next testimonial' }).click();
  await expect(page.getByRole('dialog', { name: 'Rinoa Nguyen DG' })).toContainText(
    '100/10 satisfied customer po!',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('far frames are hoverable and clickable, and focus lands fully on screen', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Hover is for fine pointers.');
  await openPage(page, '/testimonials');
  await page.getByRole('button', { name: /Pause the testimonials/ }).click();
  await settle(page);
  await expect
    .poll(() =>
      page
        .locator('.testimonial-space [data-float]')
        .evaluateAll((floats) =>
          floats.every((float) =>
            float.getAnimations().every((animation) => animation.playbackRate === 0),
          ),
        ),
    )
    .toBe(true);
  const point = await page.evaluate(() => {
    const floats = [...document.querySelectorAll<HTMLElement>('.testimonial-space [data-float]')];
    const far = floats
      .filter((float) => Number(float.dataset.z) < -600)
      .map((float) => float.querySelector<HTMLElement>('[data-frame]'))
      .find((frame) => {
        if (!frame) return false;
        const box = frame.getBoundingClientRect();
        const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
        return (
          box.top > 140 &&
          box.bottom < innerHeight - 40 &&
          box.left > 0 &&
          box.right < innerWidth &&
          hit?.closest('[data-frame]') === frame
        );
      });
    if (!far) return null;
    const box = far.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2, id: far.dataset.workId! };
  });
  test.skip(!point, 'No unobscured far frame is fully in view at this size.');
  if (!point) return;
  await page.mouse.move(point.x, point.y, { steps: 3 });
  const focused = page.locator('.testimonial-frame[data-focused]');
  await expect(focused).toHaveCount(1);
  await expect(focused).toHaveAttribute('data-work-id', point.id);
  await settle(page);
  const box = await focused.boundingBox();
  const view = page.viewportSize();
  if (!box || !view) throw new Error('Missing focus box');
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(view.width);
  expect(box.y + box.height).toBeLessThanOrEqual(view.height);
  await focused.click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('video frames play while they are on screen', async ({ page }) => {
  await openPage(page, '/testimonials');
  await expect
    .poll(
      () =>
        page.locator('.testimonial-space video').evaluateAll((videos) =>
          videos.every((video) => {
            const box = video.getBoundingClientRect();
            const shown = box.bottom > 0 && box.top < innerHeight;
            return shown === !(video as HTMLVideoElement).paused;
          }),
        ),
      { timeout: 4_000 },
    )
    .toBe(true);
  expect(await page.locator('.testimonial-space video').count()).toBe(4);
});

test('testimonials can pause and are accessible', async ({ page }) => {
  await openPage(page, '/testimonials');
  await page.getByRole('button', { name: /Pause the testimonials/ }).click();
  await expect(page.getByRole('button', { name: /Play the testimonials/ })).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .exclude('.testimonial-echoes')
    .analyze();
  expect(result.violations).toEqual([]);
});

test('switching to the gallery flies every frame into a grid, and back again', async ({ page }) => {
  await openPage(page, '/testimonials');
  const hero = page.locator('.testimonials-hero');
  const frames = page.locator('.testimonial-space [data-frame]');
  const flying = () =>
    frames.evaluateAll(
      (elements) => elements.filter((element) => element.getAnimations().length).length,
    );
  await page.getByRole('button', { name: 'Gallery', exact: true }).click();
  await expect(hero).toHaveAttribute('data-still', '');
  expect(await flying()).toBe(13);
  await expect.poll(flying, { timeout: 4_000 }).toBe(0);
  const tops = await frames.evaluateAll((elements) =>
    elements.map((element) => Math.round(element.getBoundingClientRect().top)),
  );
  expect(new Set(tops).size).toBeLessThan(13);
  await expect
    .poll(() =>
      page
        .locator('.testimonial-space video')
        .evaluateAll((videos) =>
          videos.some(
            (video) =>
              video instanceof HTMLVideoElement &&
              !video.paused &&
              video.getBoundingClientRect().top < window.innerHeight,
          ),
        ),
    )
    .toBe(true);
  const arn = page.getByRole('button', { name: 'Read Arn Mitra, Gibby Snaps' });
  if (test.info().project.name.startsWith('desktop')) {
    const resting = await arn.boundingBox();
    await arn.hover();
    await expect(arn).toHaveAttribute('data-focused', '');
    await expect
      .poll(async () => (await arn.boundingBox())?.width ?? 0)
      .toBeGreaterThan((resting?.width ?? 0) * 1.2);
  }
  await arn.click();
  await expect(page.getByRole('dialog', { name: 'Arn Mitra' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Spatial', exact: true }).click();
  await expect(hero).not.toHaveAttribute('data-still', '');
  await expect
    .poll(() =>
      page
        .locator('.testimonial-space [data-float]')
        .evaluateAll((floats) => floats.filter((float) => float.getAnimations().length).length),
    )
    .toBe(13);
});

test('reduced motion lays testimonials out as a still grid', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPage(page, '/testimonials');
  await expect(page.getByRole('button', { name: /the testimonials/ })).toHaveCount(0);
  const frame = page.getByRole('button', { name: 'Read Arn Mitra, Gibby Snaps' });
  const y = await frame.evaluate((element) => element.getBoundingClientRect().y);
  await page.waitForTimeout(400);
  expect(await frame.evaluate((element) => element.getBoundingClientRect().y)).toBe(y);
  await frame.click();
  await expect(page.getByRole('dialog', { name: 'Arn Mitra' })).toBeVisible();
});
