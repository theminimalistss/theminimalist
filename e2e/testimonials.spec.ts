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
  await frame.click({ force: true });
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
