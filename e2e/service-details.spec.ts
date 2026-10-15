import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage, revealAll } from './helpers';

test('software explores web, mobile, desktop, APIs, and embedded systems', async ({ page }) => {
  await openPage(page, '/services/software');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Software development');
  const explorer = page.getByRole('figure', { name: 'Software platforms illustration' });
  const controls = explorer.getByRole('group', { name: 'Software platforms' });
  await expect(controls.getByRole('button')).toHaveCount(5);
  for (const [name, text] of [
    ['Web', 'Customer portals'],
    ['Mobile', 'iOS & Android'],
    ['Desktop', 'Desktop applications'],
    ['API', 'Custom APIs'],
    ['Embedded', 'Device firmware'],
  ]) {
    const button = controls.getByRole('button', { name, exact: true });
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(explorer.getByRole('status')).toContainText(text!);
    await expect(explorer.locator('.sd-platform-drawing')).toBeVisible();
    await expect(explorer.locator('path.sd-trace')).toHaveCount(1);
  }
  const links = page.getByRole('navigation', { name: 'Explore other services' });
  await expect(links.getByRole('link')).toHaveCount(2);
  await links.getByRole('link', { name: 'Website development' }).click();
  await expect(page).toHaveURL(/\/services\/websites$/u);
});

test('website preview changes screen size without changing content or blocking inquiry links', async ({
  page,
}) => {
  await openPage(page, '/services/websites');
  const preview = page.getByRole('figure', { name: 'Responsive website illustration' });
  const browser = preview.locator('.sd-browser');
  await preview.scrollIntoViewIfNeeded();
  const desktop = await browser.evaluate((element) => element.getBoundingClientRect().width);
  await preview.getByRole('button', { name: 'Mobile', exact: true }).click();
  await expect(preview.getByRole('status')).toHaveText('Mobile layout preview');
  await expect
    .poll(() => browser.evaluate((element) => element.getBoundingClientRect().width))
    .toBeLessThan(desktop);
  await expect(preview.getByRole('img')).toBeVisible();
  expect(
    await preview.getByRole('img').evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBeGreaterThan(0);
  await preview.getByRole('button', { name: 'Desktop', exact: true }).click();
  await expect
    .poll(() => browser.evaluate((element) => element.getBoundingClientRect().width))
    .toBeGreaterThan(desktop - 1);
  const quote = page
    .locator('.sd-actions')
    .getByRole('link', { name: 'Request a quote', exact: true });
  await quote.click();
  await expect(page).toHaveURL(/\/contact\?inquiry=quote$/u);
  await expect(page.getByRole('radio', { name: /Request a quote/u })).toBeChecked();
});

test('brand deliverables animate into aligned shared panels and remain keyboard accessible', async ({
  page,
}) => {
  await openPage(page, '/services/branding');
  await expect(page.getByRole('figure', { name: 'Illustrative brand identity' })).toContainText(
    'not a commissioned brand',
  );
  const group = page.getByRole('group', { name: 'Brand deliverables' });
  await expect(group.getByRole('button')).toHaveCount(6);
  const packaging = group.getByRole('button', { name: 'Packaging & details', exact: true });
  await packaging.focus();
  await page.keyboard.press('Enter');
  await expect(packaging).toHaveAttribute('aria-expanded', 'true');
  const panel = page.locator(`[id="${await packaging.getAttribute('aria-controls')}"]`);
  await expect(panel.getByText('Labels and hang tags', { exact: true })).toBeVisible();
  await expect
    .poll(() =>
      panel.evaluate((element) =>
        element.getAnimations().some((animation) => animation.playState === 'running'),
      ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      panel.evaluate((element) =>
        element.getAnimations().some((animation) => animation.playState === 'running'),
      ),
    )
    .toBe(false);
  const row = packaging.locator('..');
  const boxes = await row.locator('.sd-brand-choice').evaluateAll((buttons) =>
    buttons.map((button) => {
      const box = button.getBoundingClientRect();
      return { top: box.top, height: box.height };
    }),
  );
  expect(boxes[0]!.top).toBeCloseTo(boxes[1]!.top, 1);
  expect(boxes[0]!.height).toBeCloseTo(boxes[1]!.height, 1);
  await page.keyboard.press('Space');
  await expect(packaging).toHaveAttribute('aria-expanded', 'false');
  await expect
    .poll(() => panel.evaluate((element) => element.getBoundingClientRect().height))
    .toBeLessThan(1);
  await group.getByRole('button', { name: 'Print & add-ons', exact: true }).click();
  await expect(
    group
      .getByRole('region', { name: 'Print & add-ons', exact: true })
      .getByText('Business cards and stationery', { exact: true }),
  ).toBeVisible();
  // Interrupt an opening with another row, then close it; no stale heights remain.
  await group
    .getByRole('button', { name: 'Colour & typography', exact: true })
    .evaluate((button: HTMLElement) => button.click());
  await group
    .getByRole('button', { name: 'Logo & marks', exact: true })
    .evaluate((button: HTMLElement) => button.click());
  await expect(group.locator('[aria-expanded="true"]')).toHaveCount(1);
  await expect(group.getByRole('region', { name: 'Logo & marks', exact: true })).toContainText(
    'Primary & secondary logos',
  );
  await group.getByRole('button', { name: 'Logo & marks', exact: true }).click();
  await expect
    .poll(() =>
      group
        .locator('.sd-brand-drawer')
        .evaluateAll((panels) => panels.every((panel) => panel.getBoundingClientRect().height < 1)),
    )
    .toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('each service is accessible, responsive, and usable without animation', async ({ page }) => {
  test.slow();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of ['software', 'websites', 'branding']) {
    await openPage(page, `/services/${route}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await revealAll(page);
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(
      page
        .getByRole('navigation', { name: 'Services', exact: true })
        .locator('[aria-current="page"]'),
    ).toHaveCount(1);
  }
  await expect(page.getByRole('button', { name: /illustrations/u })).toHaveCount(0);
  expect(
    await page
      .locator('.service-detail')
      .evaluate(
        (root) =>
          root
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === 'running').length,
      ),
  ).toBe(0);
  expect(errors).toEqual([]);
});

for (const [route, selector] of [
  ['software', '.sd-art-drift'],
  ['websites', '.sd-browser'],
  ['branding', '.sd-brand-tag'],
] as const) {
  test(`${route} illustrations animate, pause, and stop offscreen or in a hidden tab`, async ({
    page,
  }) => {
    await openPage(page, `/services/${route}`);
    const root = page.locator('.service-detail');
    const target = root.locator(selector);
    const scene = target.locator('xpath=ancestor::*[@data-service-scene][1]');
    await scene.scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute('data-scene-active', '');
    await expect(target).toHaveCSS('animation-play-state', 'running');
    const transform = () => target.evaluate((element) => getComputedStyle(element).transform);
    const before = await transform();
    await expect.poll(transform).not.toBe(before);
    await page.getByRole('button', { name: 'Pause illustrations' }).click();
    await expect(root).toHaveAttribute('data-motion', 'paused');
    await expect(target).toHaveCSS('animation-play-state', 'paused');
    const held = await transform();
    await page.waitForTimeout(150);
    expect(await transform()).toBe(held);
    await page.getByRole('button', { name: 'Play illustrations' }).click();
    await scene.scrollIntoViewIfNeeded();
    await expect(target).toHaveCSS('animation-play-state', 'running');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(root).toHaveAttribute('data-motion', 'paused');
    await expect(target).toHaveCSS('animation-play-state', 'paused');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: false });
      document.dispatchEvent(new Event('visibilitychange'));
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await expect(scene).not.toHaveAttribute('data-scene-active', '');
    await expect(target).toHaveCSS('animation-play-state', 'paused');
  });
}
