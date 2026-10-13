import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage } from './helpers';

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
    await frame.hover({ force: true });
    await expect(frame).toHaveAttribute('data-focused', '');
    await page.waitForTimeout(1_200);
    const held = await y();
    await page.waitForTimeout(400);
    expect(Math.abs((await y()) - held)).toBeLessThan(1);
  }
  if (isMobile) await frame.evaluate((element) => (element as HTMLElement).click());
  else await frame.click({ force: true });
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
  const point = await page.evaluate(() => {
    const floats = [...document.querySelectorAll<HTMLElement>('.testimonial-space [data-float]')];
    const far = floats
      .filter((float) => Number(float.dataset.z) < -600)
      .map((float) => float.getBoundingClientRect())
      .find(
        (box) =>
          box.top > 140 && box.bottom < innerHeight - 40 && box.left > 0 && box.right < innerWidth,
      );
    return far ? { x: far.left + far.width / 2, y: far.top + far.height / 2 } : null;
  });
  test.skip(!point, 'No far frame is fully in view at this size.');
  if (!point) return;
  await page.mouse.move(point.x, point.y, { steps: 3 });
  const focused = page.locator('.testimonial-frame[data-focused]');
  await expect(focused).toHaveCount(1);
  await page.waitForTimeout(1_000);
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
