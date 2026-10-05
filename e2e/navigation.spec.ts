import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openPage(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('.page-loader')).toHaveCount(0, { timeout: 10_000 });
}

const FOOTER_PAGES = [
  ['About', /An independent design studio/],
  ['Founders', /The people/],
  ['Testimonials', /Kind words/],
  ['Works', /Selected works/],
  ['Software solutions', /Software solutions/],
  ['Website templates', /Website templates/],
  ['Hardware products', /Hardware products/],
  ['Contact', /Let’s talk/],
  ['General inquiry', /General inquiry/],
  ['Request a quote', /Request a quote/],
  ['Book an appointment', /Book an appointment/],
] as const;

test('the footer sitemap reaches every page', async ({ page }) => {
  await openPage(page, '/about');
  const footer = page.getByRole('navigation', { name: 'Footer' });
  for (const [label, heading] of FOOTER_PAGES) {
    await footer.getByRole('link', { name: label, exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page).toHaveTitle(/— The Minimalist$/);
  }
});

test('the menu navigates, closes, and moves focus to the new page', async ({ page }) => {
  await openPage(page, '/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const menu = page.getByRole('navigation', { name: 'Site' });
  await menu.getByRole('link', { name: /Products/ }).click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(page.locator('#studio-menu')).not.toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Made by the studio/);
  await expect(page.locator('#main-content')).toBeFocused();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(menu.getByRole('link', { name: /Products/ })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await menu.getByRole('link', { name: 'Founders' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/The people/);
});

test('header, breadcrumbs, and section tabs show where you are', async ({ page, isMobile }) => {
  await openPage(page, '/products/software');
  if (!isMobile) {
    const primary = page.getByRole('navigation', { name: 'Primary' });
    await expect(primary.getByRole('link', { name: 'Products' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  }
  const tabs = page.getByRole('navigation', { name: 'Product categories' });
  await tabs.getByRole('link', { name: 'Website templates' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Website templates/);
  await expect(tabs.getByRole('link', { name: 'Website templates' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link').click();
  await expect(page).toHaveURL(/\/products$/);
});

test('new pages pass accessibility checks', async ({ page }) => {
  for (const path of [
    '/about',
    '/founders',
    '/products/hardware',
    '/contact',
    '/inquiries/quote',
  ]) {
    await openPage(page, path);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations, path).toEqual([]);
  }
});
