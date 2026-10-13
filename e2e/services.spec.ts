import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage, revealAll } from './helpers';

test('direct route HTML links the Works and Services styles before JavaScript', async ({
  request,
}) => {
  for (const path of ['/works/', '/services/']) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    const stylesheet = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/u)?.[1];
    expect(stylesheet).toBeTruthy();
    const css = await request.get(stylesheet!);
    expect(css.headers()['content-type']).toContain('text/css');
    const body = await css.text();
    expect(body).toContain('.works-intro');
    expect(body).toContain('.service-process-annotation');
  }
});

test('the process loops, supports direct selection, and pauses out of view', async ({
  page,
  isMobile,
}) => {
  test.slow();
  await openPage(page, '/services');
  const process = page.locator('.service-process');
  const panel = process.locator('.service-process-panel');
  await process.scrollIntoViewIfNeeded();
  await expect(process.getByRole('tab')).toHaveCount(0);
  await expect(process.locator('header, footer')).toHaveCount(0);
  expect(
    await process.locator('.service-process-panel').evaluate((panel) => {
      const area = panel.getBoundingClientRect();
      return Array.from(panel.querySelectorAll('.service-process-annotation')).every(
        (annotation) => {
          const box = annotation.getBoundingClientRect();
          return (
            box.top >= area.top &&
            box.bottom <= area.bottom &&
            box.left >= area.left &&
            box.right <= area.right
          );
        },
      );
    }),
  ).toBe(true);
  await expect(page.locator('.service-drawing')).toHaveAttribute('data-renderer', 'webgl');
  await expect(process).toHaveAttribute('data-running', '');
  const stage = () => process.locator('.service-process-label h3').textContent();
  const initial = await stage();
  await expect.poll(stage, { timeout: 7000 }).not.toBe(initial);
  if (!isMobile) {
    await panel.hover();
    await expect(process).not.toHaveAttribute('data-running', '');
    const held = await stage();
    await page.waitForTimeout(5500);
    expect(await stage()).toBe(held);
    await page.mouse.move(0, 0);
  }
  await panel.focus();
  await page.keyboard.press('Home');
  await expect(process.locator('.service-process-panel')).toContainText(
    'Your goals, your audience, and what you already have.',
  );
  await expect(process).not.toHaveAttribute('data-running', '');
  await page.keyboard.press('ArrowRight');
  await expect(panel).toBeFocused();
  await expect(process.locator('.service-process-panel')).toContainText('Directions and options');
  await page.keyboard.press('End');
  await expect(panel).toBeFocused();
  await expect(process.locator('.service-process-panel')).toContainText(
    'Files, handover, and support',
  );
  await panel.evaluate((element: HTMLElement) => element.blur());
  await page.mouse.move(0, 0);
  await expect(process).toHaveAttribute('data-running', '');
  await expect.poll(stage, { timeout: 7000 }).toContain('Listen');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(process).not.toHaveAttribute('data-running', '');
  const held = await stage();
  await page.waitForTimeout(5500);
  expect(await stage()).toBe(held);
});

test('service images and links follow the introduction and process', async ({ page }) => {
  await openPage(page, '/services');
  await revealAll(page);
  const links = page.getByRole('navigation', { name: 'Services', exact: true }).getByRole('link');
  await expect(links).toHaveCount(3);
  const pictures = page.locator('.service-directory img');
  await expect(pictures).toHaveCount(3);
  await expect
    .poll(() =>
      pictures.evaluateAll((images) =>
        images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
      ),
    )
    .toBe(true);
  for (const [name, path] of [
    ['Software development', '/services/software'],
    ['Website development', '/services/websites'],
    ['Branding identity', '/services/branding'],
  ] as const) {
    await links.filter({ hasText: name }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await page.goBack();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await revealAll(page);
  await page.locator('.service-process-panel').focus();
  const violations = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(violations.violations).toEqual([]);
});

test('reduced motion and unavailable WebGL retain every process stage', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPage(page, '/services');
  const process = page.locator('.service-process');
  await expect(process).not.toHaveAttribute('data-running', '');
  await expect(page.locator('.service-drawing')).not.toHaveAttribute('data-renderer', 'webgl');
  await expect(process.getByRole('button', { name: /the process/ })).toHaveCount(0);
  await process.locator('.service-process-panel').focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(process.locator('.service-process-panel')).toContainText('Careful craft');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      options?: unknown,
    ) {
      if (type === 'webgl' || type === 'experimental-webgl') return null;
      return getContext.call(this, type as '2d', options as CanvasRenderingContext2DSettings);
    } as typeof getContext;
  });
  await page.reload();
  await expect(page.locator('.page-loader')).toHaveCount(0);
  await expect(page.locator('.service-drawing')).not.toHaveAttribute('data-renderer', 'webgl');
  await process.locator('.service-process-panel').focus();
  await page.keyboard.press('End');
  await expect(process.locator('.service-process-panel')).toContainText('Files, handover');
});

test('a lost process context keeps the selected stage readable and illustrated', async ({
  page,
}) => {
  await openPage(page, '/services');
  const drawing = page.locator('.service-drawing');
  await drawing.scrollIntoViewIfNeeded();
  await expect(drawing).toHaveAttribute('data-renderer', 'webgl');
  await page.locator('.service-process-panel').focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  const lost = await drawing.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
    const extension = canvas.getContext('webgl')?.getExtension('WEBGL_lose_context');
    extension?.loseContext();
    return !!extension;
  });
  test.skip(!lost, 'The browser cannot simulate context loss.');
  await expect(drawing).not.toHaveAttribute('data-renderer', 'webgl');
  await expect(drawing.locator('.service-drawing-fallback')).toHaveCSS('opacity', '1');
  await page.keyboard.press('End');
  await expect(page.locator('.service-process-panel')).toContainText('Files, handover');
});
