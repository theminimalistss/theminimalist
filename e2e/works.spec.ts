import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage, settle } from './helpers';

/** The sculpture traces itself in; its points become available once drawn. */
async function openWorks(page: Page) {
  await openPage(page, '/works');
  await expect(page.locator('.tesseract-viewport')).toHaveAttribute('data-traced', '');
}

test('the full viewport sculpture assembles a preview on hover or tap, then opens the study', async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await openPage(page, '/works');
  const viewport = page.locator('.tesseract-viewport');
  await expect(viewport).not.toHaveAttribute('data-traced', '');
  await expect(page.locator('[data-work-node]').first()).toHaveCSS('opacity', '0');
  await expect(viewport).toHaveAttribute('data-traced', '');
  await expect(page.locator('.tesseract-stage')).toHaveAttribute('data-scene-status', 'ready');
  const dimensions = await page.locator('.work-explorer').boundingBox();
  expect(dimensions?.width).toBe(page.viewportSize()?.width);
  expect(dimensions?.height).toBeGreaterThanOrEqual(page.viewportSize()?.height ?? 0);
  const preview = page.locator('.particle-preview');
  const point = page.getByRole('button', { name: 'Select Still', exact: true });
  if (isMobile) await point.tap({ force: true });
  else await point.hover({ force: true });
  await expect(preview).toHaveAttribute('data-active', '');
  await expect(preview.getByRole('heading', { level: 2 })).toHaveText(/Still/, { timeout: 10000 });
  await expect(preview).toHaveAttribute('data-phase', 'ready', { timeout: 10000 });
  await expect(page.locator('.work-explorer video')).toHaveCount(1);
  await preview.getByRole('button', { name: 'Explore Still', exact: true }).click({ force: true });
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('Independent concept study');
  await page.getByRole('button', { name: 'Close project' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Gallery', exact: true }).click();
  await expect(page.locator('.work-gallery>li')).toHaveCount(6);
  await expect(page.locator('.tesseract-canvas')).toHaveCount(0);
  await page.getByRole('button', { name: 'Spatial', exact: true }).click();
  await expect(page.locator('.tesseract-stage')).toHaveAttribute('data-scene-status', 'ready');
  expect(errors).toEqual([]);
});

test('the study nearest the viewer shows itself, and the stepper brings the next forward', async ({
  page,
  isMobile,
}) => {
  await openWorks(page);
  const stepper = page.getByRole('group', { name: 'Study in focus' });
  const preview = page.locator('.particle-preview');
  await expect(stepper).toContainText('01 / 06');
  await expect(stepper).toContainText('Forma');
  if (isMobile) {
    await expect(preview).not.toHaveAttribute('data-active', '');
  } else {
    await expect(preview).toHaveAttribute('data-docked', '');
    await expect(preview).toHaveAttribute('data-phase', 'ready', { timeout: 10000 });
    await expect(preview.getByRole('heading', { level: 2 })).toHaveText(/Forma/);
  }
  await page.getByRole('button', { name: 'Next study: Still' }).click();
  await expect(stepper).toContainText('02 / 06');
  await expect(page.locator('[data-work-node][data-front]')).toHaveAttribute(
    'aria-label',
    'Select Still',
  );
  if (!isMobile)
    await expect(preview.getByRole('heading', { level: 2 })).toHaveText(/Still/, {
      timeout: 10000,
    });
  await page.getByRole('button', { name: /^Open Still, study 2 of 6$/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('hovering a point eases the sculpture to a stop, then it turns again', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Hover is for fine pointers.');
  await openWorks(page);
  // Still turns with the sculpture; Solenne sits on the axis of rotation.
  const node = page.locator('[data-work-node]').nth(1);
  await page.getByRole('button', { name: 'Select Solenne', exact: true }).hover({ force: true });
  await page.waitForTimeout(1300);
  const held = await node.getAttribute('style');
  await page.waitForTimeout(300);
  expect(await node.getAttribute('style')).toBe(held);
  await page.mouse.move(4, 420);
  await expect.poll(() => node.getAttribute('style'), { timeout: 4000 }).not.toBe(held);
});

test('rotation responds to keyboard and drag, pauses, and resets', async ({ page, isMobile }) => {
  await openWorks(page);
  await page.getByRole('button', { name: 'Pause sculpture motion' }).click();
  const node = page.locator('[data-work-node]').first();
  const orbit = page.getByRole('button', { name: 'Rotate the collection' });
  const settled = async () => {
    let previous = await node.getAttribute('style');
    for (;;) {
      await page.waitForTimeout(250);
      const current = await node.getAttribute('style');
      if (current === previous) return current;
      previous = current;
    }
  };
  await orbit.focus();
  const before = await settled();
  await orbit.press('ArrowRight');
  await expect.poll(() => node.getAttribute('style')).not.toBe(before);
  await orbit.press('Home');
  const reset = await settled();
  if (!isMobile) {
    const box = await orbit.boundingBox();
    if (!box) throw new Error('Missing orbit control');
    const x = box.x + box.width * 0.15,
      y = box.y + box.height * 0.55;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 100, y + 40, { steps: 8 });
    await page.mouse.up();
    expect(await node.getAttribute('style')).not.toBe(reset);
  }
  await page.getByRole('button', { name: 'Reset view' }).click();
  expect(await settled()).toBe(reset);
});

test('reduced motion defaults to the gallery and shows previews without particles', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPage(page, '/works');
  await expect(page.locator('.work-gallery>li')).toHaveCount(6);
  await expect(page.locator('.tesseract-canvas')).toHaveCount(0);
  expect(
    await page
      .locator('video')
      .evaluateAll((videos) => videos.every((video) => (video as HTMLVideoElement).paused)),
  ).toBe(true);
  await page.getByRole('button', { name: 'Spatial', exact: true }).click();
  await expect(page.locator('.tesseract-stage')).toHaveAttribute('data-scene-status', 'ready');
  const node = page.locator('[data-work-node]').first();
  const before = await node.getAttribute('style');
  await page.waitForTimeout(200);
  expect(await node.getAttribute('style')).toBe(before);
  await page.getByRole('button', { name: 'Select Arc', exact: true }).focus();
  await expect(page.locator('.particle-preview')).toHaveAttribute('data-phase', 'fallback');
  await expect(page.locator('.particle-copy')).toContainText('Arc');
});

test('WebGL unavailability keeps every study accessible', async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type, ...args) {
      if (type === 'webgl' || type === 'webgl2') return null;
      return Reflect.apply(getContext, this, [type, ...args]);
    } as typeof getContext;
  });
  await openWorks(page);
  await expect(page.locator('.tesseract-stage')).toHaveAttribute(
    'data-scene-status',
    'unavailable',
  );
  await page.getByRole('button', { name: 'Select Arc', exact: true }).click();
  await expect(page.locator('.particle-preview')).toHaveAttribute('data-phase', 'fallback');
  await page.getByRole('button', { name: 'Explore Arc', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('the sculpture and an assembled preview are accessible and error-free', async ({ page }) => {
  await openWorks(page);
  await page.getByRole('button', { name: 'Pause sculpture motion' }).click();
  await page.getByRole('button', { name: 'Select Forma', exact: true }).focus();
  await expect(page.locator('.particle-preview')).toHaveAttribute('data-phase', 'ready', {
    timeout: 10000,
  });
  await settle(page);
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const selector of ['.tesseract-canvas', '.particle-canvas']) {
    expect(
      await page
        .locator(selector)
        .evaluate((element) => (element as HTMLCanvasElement).getContext('webgl')?.getError()),
    ).toBe(0);
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Select Forma', exact: true })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});

test('the sculpture recovers from a lost WebGL context', async ({ page }) => {
  await openWorks(page);
  const stage = page.locator('.tesseract-stage');
  await expect(stage).toHaveAttribute('data-scene-status', 'ready');
  const supported = await page.locator('.tesseract-canvas').evaluate((element) => {
    const canvas = element as HTMLCanvasElement;
    const extension = canvas.getContext('webgl')?.getExtension('WEBGL_lose_context');
    if (!extension) return false;
    canvas.addEventListener(
      'webglcontextlost',
      () => {
        setTimeout(() => extension.restoreContext(), 750);
      },
      { once: true },
    );
    extension.loseContext();
    return true;
  });
  test.skip(!supported, 'Context loss extension is unavailable in this browser.');
  await expect(stage).toHaveAttribute('data-scene-status', 'unavailable');
  await expect(stage).toHaveAttribute('data-scene-status', 'ready');
  await page.getByRole('button', { name: 'Select Arc', exact: true }).focus();
  await expect(page.locator('.particle-preview')).toHaveAttribute('data-phase', 'ready', {
    timeout: 10000,
  });
});
