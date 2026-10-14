import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage } from './helpers';

const openIndex = (page: import('@playwright/test').Page) =>
  page
    .locator('.product-panel')
    .evaluateAll((panels) => panels.findIndex((panel) => panel.hasAttribute('data-open')));

test('product panels open on hover or focus and lead to each category', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Hover and keyboard are for fine pointers.');
  await openPage(page, '/products');
  const panels = page.getByRole('list', { name: 'Product categories' });
  const links = panels.getByRole('link');
  await expect(links).toHaveCount(3);
  expect(await openIndex(page)).toBe(0);
  const first = await links.nth(0).boundingBox();
  await links.nth(2).hover();
  await expect.poll(() => openIndex(page)).toBe(2);
  await expect
    .poll(async () => (await links.nth(2).boundingBox())?.width ?? 0)
    .toBeGreaterThan((first?.width ?? 0) * 0.9);
  await links.nth(1).focus();
  await expect.poll(() => openIndex(page)).toBe(1);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/products\/templates$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('on touch, the first tap opens a panel and the second follows it', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Touch behaviour.');
  await openPage(page, '/products');
  const links = page.getByRole('list', { name: 'Product categories' }).getByRole('link');
  await links.nth(2).scrollIntoViewIfNeeded();
  await links.nth(2).tap();
  await expect.poll(() => openIndex(page)).toBe(2);
  await expect(page).toHaveURL(/\/products$/);
  await links.nth(2).tap();
  await expect(page).toHaveURL(/\/products\/hardware$/);
});

test('the products page passes accessibility checks', async ({ page }) => {
  await openPage(page, '/products');
  await page.waitForTimeout(900);
  const results = await new AxeBuilder({ page }).include('.products-overview').analyze();
  expect(results.violations).toEqual([]);
});

test('templates list as a filterable grid while software and hardware are coming soon', async ({
  page,
}) => {
  await openPage(page, '/products/templates');
  await expect(page.locator('.page-intro .eyebrow')).toHaveText('Products · Available');
  const grid = page.getByRole('list', { name: 'Website templates' });
  const cards = grid.locator(':scope > li');
  const total = await cards.count();
  expect(total).toBeGreaterThan(3);
  await page.getByRole('button', { name: 'Online shop' }).click();
  await expect(cards).toHaveCount(1);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(cards).toHaveCount(total);
  for (const path of ['/products/software', '/products/hardware']) {
    await openPage(page, path);
    await expect(page.locator('.page-intro .eyebrow')).toHaveText('Products · Coming soon');
    await expect(page.getByRole('list', { name: 'Website templates' })).toHaveCount(0);
  }
});
