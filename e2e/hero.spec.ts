import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('loads local media, moves continuously, and responds to pause', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
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
  await page.goto('/');
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
  await page.goto('/');
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
  await page.goto('/');
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
  await page.goto('/');
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
  await page.goto('/');
  await page.getByRole('button', { name: 'Pause motion' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  for (const view of ['Spiral', 'Gallery']) {
    await page.getByRole('button', { name: view, exact: true }).click();
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});

test('unknown routes offer a working return to the collection', async ({ page }) => {
  await page.goto('/not-a-page');
  await expect(page.getByRole('heading', { name: /Nothing here/ })).toBeVisible();
  await page.getByRole('link', { name: /Back to the collection/ }).click();
  await expect(page.getByRole('heading', { name: /Selected.*works/s })).toBeVisible();
});
