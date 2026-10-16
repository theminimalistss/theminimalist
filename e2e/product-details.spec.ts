import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage, revealAll } from './helpers';

test('software workspace explores organisation, connections, and insight with keyboard controls', async ({
  page,
}) => {
  await openPage(page, '/products/software');
  const study = page.getByRole('figure', { name: 'Software workspace study' });
  const group = study.getByRole('group', { name: 'Explore software concepts' });
  await expect(group.getByRole('button')).toHaveCount(3);
  for (const [label, drawing, caption] of [
    ['Connect', '.pd-connection-map', 'one clear conversation'],
    ['Understand', '.pd-insight', 'useful view of your work'],
    ['Organise', '.pd-task-board', 'a shared home'],
  ]) {
    const button = group.getByRole('button', { name: label, exact: true });
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(study.locator(drawing!)).toBeVisible();
    await expect(study.getByRole('status')).toContainText(caption!);
  }
  await expect(study).toContainText('Illustrative interface');
  await expect(page.locator('.pd-intro')).toContainText('Coming soon');
});

test('template studies change the illustration while the provisional collection remains filterable', async ({
  page,
}) => {
  await openPage(page, '/products/templates');
  const study = page.getByRole('figure', { name: 'Template layout study' });
  const initial = await study.locator('.template-layout').innerHTML();
  await study.getByRole('button', { name: 'Journal', exact: true }).click();
  await expect(study.getByRole('status')).toContainText('stories worth staying with');
  expect(await study.locator('.template-layout').innerHTML()).not.toBe(initial);
  await study.getByRole('button', { name: 'Shop', exact: true }).click();
  await expect(study.getByRole('status')).toContainText('small product collection');
  await expect(study).toContainText('not yet published');
  await page.getByRole('link', { name: 'Explore the collection', exact: true }).click();
  const grid = page.getByRole('list', { name: 'Website templates' });
  await page.getByRole('button', { name: 'Online shop', exact: true }).click();
  await expect(grid.locator(':scope > li')).toHaveCount(1);
  await expect(grid.getByRole('heading', { name: 'Mercer' })).toBeVisible();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(grid.locator(':scope > li')).toHaveCount(6);
});

test('hardware assembles smoothly and explores each layer without shifting its controls', async ({
  page,
}) => {
  await openPage(page, '/products/hardware');
  const study = page.getByRole('figure', { name: 'Hardware object study' });
  const shell = study.locator('.pd-object-shell');
  await study.getByRole('button', { name: 'Assembled', exact: true }).click();
  await expect(study.getByRole('button', { name: 'Assembled', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(shell).toHaveCSS('transform', 'none');
  await study.getByRole('button', { name: 'Exploded', exact: true }).click();
  await expect
    .poll(() => shell.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe('none');
  for (const [label, part, caption] of [
    ['Electronics', 'core', 'Purpose at the centre.'],
    ['Foundation', 'base', 'Considered underneath.'],
    ['Enclosure', 'shell', 'The first impression.'],
  ]) {
    const button = study.getByRole('button', { name: label, exact: true });
    await button.focus();
    await page.keyboard.press('Space');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(study.getByRole('status')).toContainText(caption!);
    await expect(study.locator(`[data-object-part="${part}"]`)).toHaveCSS('opacity', '1');
  }
  // Interrupt a transition; the last input must win.
  await study
    .getByRole('button', { name: 'Assembled', exact: true })
    .evaluate((button: HTMLElement) => button.click());
  await study
    .getByRole('button', { name: 'Exploded', exact: true })
    .evaluate((button: HTMLElement) => button.click());
  await study
    .getByRole('button', { name: 'Assembled', exact: true })
    .evaluate((button: HTMLElement) => button.click());
  await expect(shell).toHaveCSS('transform', 'none');
  await expect(study).toContainText('not a product specification');
});

test('product compositions are accessible, contained, and usable with reduced motion', async ({
  page,
}) => {
  test.slow();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const key of ['software', 'templates', 'hardware']) {
    await openPage(page, `/products/${key}`);
    await revealAll(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('button', { name: /illustrations/ })).toHaveCount(0);
    expect(
      (
        await new AxeBuilder({ page })
          .include('.product-detail')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(
      await page
        .locator('.product-detail')
        .evaluate(
          (root) =>
            root
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === 'running').length,
        ),
    ).toBe(0);
  }
  expect(errors).toEqual([]);
});

for (const [key, selector] of [
  ['software', '.pd-task'],
  ['templates', '.pd-template-paper'],
  ['hardware', '.pd-object-drift'],
] as const) {
  test(`${key} product artwork moves, pauses, and suspends when hidden or offscreen`, async ({
    page,
  }) => {
    await openPage(page, `/products/${key}`);
    const root = page.locator('.product-detail');
    const target = root.locator(selector).first();
    const scene = target.locator('xpath=ancestor::*[@data-product-scene][1]');
    await scene.scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute('data-scene-active', '');
    await expect(target).toHaveCSS('animation-play-state', 'running');
    const transform = () => target.evaluate((element) => getComputedStyle(element).transform);
    const before = await transform();
    await expect.poll(transform).not.toBe(before);
    await page.getByRole('button', { name: 'Pause illustrations', exact: true }).click();
    await expect(root).toHaveAttribute('data-motion', 'paused');
    await expect(target).toHaveCSS('animation-play-state', 'paused');
    const held = await transform();
    await page.waitForTimeout(150);
    expect(await transform()).toBe(held);
    await page.getByRole('button', { name: 'Play illustrations', exact: true }).click();
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
      scrollTo(0, document.documentElement.scrollHeight);
    });
    await expect(scene).not.toHaveAttribute('data-scene-active', '');
    await expect(target).toHaveCSS('animation-play-state', 'paused');
  });
}

test('product portals, section tabs, and inquiry links keep their destinations', async ({
  page,
}) => {
  await openPage(page, '/products/software');
  const tabs = page.getByRole('navigation', { name: 'Product categories', exact: true });
  await tabs.getByRole('link', { name: 'Website templates', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Website templates');
  const other = page.getByRole('navigation', { name: 'Explore other products' });
  await expect(other.getByRole('link')).toHaveCount(2);
  await other.getByRole('link', { name: 'Hardware products' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Hardware products');
  await expect(
    page.getByRole('link', { name: 'Explore connected systems', exact: true }),
  ).toHaveAttribute('href', '/services/software');
  await page.getByRole('link', { name: 'Ask about the collection', exact: true }).click();
  await expect(page).toHaveURL(/\/contact\?inquiry=general$/);
  await expect(page.getByRole('radio', { name: /Say hello/ })).toBeChecked();
});
