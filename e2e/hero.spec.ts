import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openPage(page: Page, path = '/') {
  await page.goto(path);
  await expect(page.locator('.page-loader')).toHaveCount(0, { timeout: 10_000 });
}

async function settle(page: Page) {
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (animation) =>
          animation.playState !== 'running' ||
          animation.effect?.getComputedTiming().endTime === Infinity,
      ),
  );
}

test('loads local media, moves continuously, and responds to pause', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await openPage(page);
  await expect(page.getByRole('heading', { name: /Selected.*works/s })).toBeVisible();
  const item = page.locator('[data-spiral-item]').first();
  const initial = await item.getAttribute('style');
  await expect.poll(() => item.getAttribute('style')).not.toBe(initial);
  await expect
    .poll(() =>
      page
        .locator('video')
        .evaluateAll((videos) =>
          videos.some(
            (video) => video instanceof HTMLVideoElement && !video.paused && video.currentTime > 0,
          ),
        ),
    )
    .toBe(true);
  await page.getByRole('button', { name: 'Pause motion' }).click();
  const frozen = await item.getAttribute('style');
  await page.waitForTimeout(250);
  expect(await item.getAttribute('style')).toBe(frozen);
  expect(
    await page
      .locator('video')
      .evaluateAll((videos) =>
        videos.every(
          (video) =>
            video instanceof HTMLVideoElement &&
            video.muted &&
            video.playsInline &&
            video.loop &&
            video.paused,
        ),
      ),
  ).toBe(true);
  expect(
    await page
      .locator('img')
      .evaluateAll((images) =>
        images.every(
          (image) =>
            image instanceof HTMLImageElement && (!image.complete || image.naturalWidth > 0),
        ),
      ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test('gallery, project preview, menu, and dismissal work', async ({ page }) => {
  await openPage(page);
  await page.getByRole('button', { name: 'Gallery', exact: true }).click();
  await expect(
    page.getByRole('list', { name: 'Selected design studies' }).getByRole('listitem'),
  ).toHaveCount(6);
  const project = page.getByRole('button', { name: /Explore Forma/ });
  await project.click();
  const dialog = page.getByRole('dialog', { name: /Forma/ });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/Not commissioned client work/)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(project).toBeFocused();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Collection views' })).toBeVisible();
  await page.getByRole('button', { name: /Explore in motion/ }).click();
  await expect(page.locator('.spiral-stage')).toBeVisible();
});

test('keyboard reaches controls and brings focused works into view', async ({
  page,
  isMobile,
  browserName,
}) => {
  test.skip(
    isMobile,
    'Mobile WebKit models touch input; desktop browsers cover the keyboard journey.',
  );
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await openPage(page);
  await page.keyboard.press(tab);
  await expect(page.getByRole('link', { name: 'Skip to selected works' })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press(tab);
  await expect(page.getByRole('button', { name: 'Spiral', exact: true })).toBeFocused();
  await page.keyboard.press(tab);
  await page.keyboard.press(tab);
  await expect(page.getByRole('button', { name: /Explore Forma/ })).toBeFocused();
  await page.keyboard.press(tab);
  const still = page.getByRole('button', { name: /Explore Still/ });
  await expect(still).toBeFocused();
  await expect(still).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: /Still/ })).toBeVisible();
});

test('reduced motion shows every work with paused video and no overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPage(page);
  await expect(page.locator('.work-gallery li')).toHaveCount(6);
  await expect(page.locator('.spiral-stage')).toHaveCount(0);
  expect(
    await page
      .locator('video')
      .evaluateAll((videos) =>
        videos.every(
          (video) => video instanceof HTMLVideoElement && video.paused && !video.autoplay,
        ),
      ),
  ).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: /Explore Wild Ground/ }).click();
  await expect(page.getByRole('dialog', { name: /Wild Ground/ })).toBeVisible();
});

test('responds to a reduced-motion preference change at runtime', async ({ page }) => {
  await openPage(page);
  await expect(page.locator('.spiral-stage')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.work-gallery li')).toHaveCount(6);
  expect(
    await page
      .locator('video')
      .evaluateAll((videos) =>
        videos.every((video) => video instanceof HTMLVideoElement && video.paused),
      ),
  ).toBe(true);
});

test('viewport remains contained and active views pass accessibility checks', async ({ page }) => {
  await openPage(page);
  await page.getByRole('button', { name: 'Pause motion' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  for (const view of ['Spiral', 'Gallery']) {
    await page.getByRole('button', { name: view, exact: true }).click();
    await settle(page);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});

test('unknown routes offer a working return to the collection', async ({ page }) => {
  await openPage(page, '/not-a-page');
  await expect(page.getByRole('heading', { name: /Nothing here/ })).toBeVisible();
  await page.getByRole('link', { name: /Back to the collection/ }).click();
  await expect(page.getByRole('heading', { name: /Selected.*works/s })).toBeVisible();
});

test('shows the studio loader until the page is ready, then reveals the hero', async ({ page }) => {
  await page.goto('/');
  const loader = page.locator('.page-loader');
  await expect(loader).toBeVisible();
  await expect(loader).toHaveAttribute('role', 'status');
  await expect(page.locator('#boot-splash')).toHaveCount(0);
  await expect(page.locator('.app-shell')).toHaveAttribute('inert', '');
  await expect(loader).toHaveCount(0, { timeout: 10_000 });
  await expect(page.locator('.app-shell')).not.toHaveAttribute('inert', '');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Collection views' })).toBeVisible();
});

test('menu morphs open and closed, then restores focus', async ({ page }) => {
  await openPage(page);
  const trigger = page.getByRole('button', { name: 'Menu', exact: true });
  await trigger.click();
  const menu = page.locator('#studio-menu');
  await expect(menu).toHaveAttribute('data-phase', 'opening');
  await expect(menu).toHaveAttribute('data-phase', 'open');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('data-phase', 'closing');
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute('data-phase', 'closed');
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await menu.getByRole('button', { name: 'Close' }).click();
  await expect(menu).not.toBeVisible();
});

test('mouse wheel speeds the spiral and steers its direction', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Mobile WebKit has no mouse wheel.');
  await openPage(page);
  const item = page.locator('[data-spiral-item]').first();
  const offset = async () =>
    Number((await item.getAttribute('style'))?.match(/translate3d\([^,]+,\s*([-\d.]+)px/)?.[1]);
  const drift = async (duration: number) => {
    const start = await offset();
    await page.waitForTimeout(duration);
    return (await offset()) - start;
  };
  await page.mouse.move(80, 480);
  const idle = await drift(400);
  expect(idle).toBeLessThan(0);
  await page.mouse.wheel(0, -600);
  const reversed = await drift(250);
  expect(reversed).toBeGreaterThan(Math.abs(idle) * 3);
  await page.waitForTimeout(1_500);
  expect(await drift(300)).toBeGreaterThan(0);
  await page.mouse.wheel(0, 600);
  expect(await drift(250)).toBeLessThan(0);
});

test('switching views flies each card between the spiral and the gallery', async ({ page }) => {
  await openPage(page);
  const flying = (selector: string) =>
    page
      .locator(selector)
      .evaluateAll((cards) => cards.filter((card) => card.getAnimations().length > 0).length);

  await page.getByRole('button', { name: 'Gallery', exact: true }).click();
  expect(await flying('.work-gallery [data-work-id]')).toBe(6);
  await settle(page);
  expect(await flying('.work-gallery [data-work-id]')).toBe(0);

  await page.getByRole('button', { name: 'Spiral', exact: true }).click();
  const hero = page.locator('.hero');
  await expect(hero).toHaveAttribute('data-morphing', '');
  expect(await flying('[data-spiral-item]')).toBeGreaterThan(0);
  await settle(page);
  await expect(hero).not.toHaveAttribute('data-morphing', '');
  const item = page.locator('[data-spiral-item]').first();
  const settled = await item.getAttribute('style');
  await expect.poll(() => item.getAttribute('style')).not.toBe(settled);
});
