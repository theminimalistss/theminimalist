import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage, revealAll } from './helpers';

const FOOTER_PAGES = [
  ['About', /The Minimalist/],
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
    await expect(page).toHaveTitle(new RegExp(`^${label}.* — The Minimalist$`));
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
    await revealAll(page);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations, path).toEqual([]);
  }
});

test('menu rows open a preview panel and a cursor cue on hover', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Hover previews are for fine pointers.');
  await openPage(page, '/about');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const menu = page.locator('#studio-menu');
  await expect(menu).toHaveAttribute('data-phase', 'open');
  const row = page.locator('.menu-row').filter({ hasText: 'Products' }).first();
  const box = await row.boundingBox();
  if (!box) throw new Error('Menu row is not visible.');
  await page.mouse.move(box.x + box.width * 0.7, box.y + 24);
  await expect(page.locator('.menu-cue')).toHaveAttribute('data-visible', '');
  await expect(page.locator('.menu-cue')).toHaveText('Browse products');
  await expect
    .poll(() => row.locator('.menu-preview').evaluate((preview) => preview.clientHeight))
    .toBeGreaterThan(60);
  await page.mouse.move(box.x - 200, box.y - 200);
  await expect(page.locator('.menu-cue')).not.toHaveAttribute('data-visible', '');
});

test('content reveals as it scrolls into view', async ({ page }) => {
  await openPage(page, '/about');
  const footerNav = page.getByRole('navigation', { name: 'Footer' });
  await expect(footerNav).not.toHaveAttribute('data-revealed', '');
  await footerNav.scrollIntoViewIfNeeded();
  await expect(footerNav).toHaveAttribute('data-revealed', '');
  await expect(page.locator('.page-intro')).toHaveAttribute('data-revealed', '');
});

test('a floating button leads to the contact page from anywhere', async ({ page }) => {
  await openPage(page, '/about');
  const fab = page.getByRole('link', { name: /Let’s talk/ });
  await expect(fab).toBeVisible();
  await fab.click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Let’s talk/);
  await expect(page.locator('.contact-fab')).toHaveCount(0);
});

test('the founders page introduces both partners equally', async ({ page }) => {
  await openPage(page, '/founders');
  const cards = page.locator('.profile-cards > li');
  await expect(cards).toHaveCount(2);
  for (const [name, role] of [
    ['Daisy Nuique', 'Product / Visual Designer'],
    ['Rex Pinili', 'Software Engineer'],
  ]) {
    const card = cards.filter({ hasText: name });
    await expect(card.getByRole('heading', { name })).toBeVisible();
    await expect(card).toContainText('Founding partner');
    await expect(card).toContainText(role);
    await expect(card.getByRole('img', { name: `Portrait of ${name}` })).toBeVisible();
  }
});
