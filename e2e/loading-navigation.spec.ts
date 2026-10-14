import { expect, test } from '@playwright/test';
import { LOADER } from '../src/constants/motion';
import { openPage } from './helpers';

const AUDIO =
  /\/(?:hover|click|navigate|menu-open|menu-close|switch|detent|sound-on)[^/]*\.(?:webm|mp3)(?:\?|$)/u;

test('loader progress waits for the final audio even beyond the visual timeout', async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let waiting = false;
  await page.route(/\/detent[^/]*\.(?:webm|mp3)(?:\?|$)/u, async (route) => {
    waiting = true;
    await gate;
    await route.continue();
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => waiting).toBe(true);
  await page.waitForTimeout(LOADER.maximumDuration + 200);
  const loader = page.locator('.page-loader');
  await expect(loader).toBeVisible();
  await expect(loader).not.toHaveAttribute('data-exiting', '');
  await expect(page.locator('.app-shell')).toHaveAttribute('inert', '');
  expect(Number(await loader.getByRole('progressbar').getAttribute('aria-valuenow'))).toBeLessThan(
    100,
  );
  release();
  await expect(loader).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator('.app-shell')).not.toHaveAttribute('inert', '');
});

test('failed audio stays behind the loader and can be retried', async ({ page }) => {
  await page.route(AUDIO, (route) => route.fulfill({ status: 503, body: '' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const retry = page.getByRole('button', { name: 'Retry audio', exact: true });
  await expect(retry).toBeVisible();
  await expect(page.locator('.page-loader')).not.toHaveAttribute('data-exiting', '');
  await expect(page.locator('.app-shell')).toHaveAttribute('inert', '');
  await page.unroute(AUDIO);
  await retry.click();
  await expect(page.locator('.page-loader')).toHaveCount(0, { timeout: 15_000 });
});

test('cold page navigation keeps the current page until its module is ready', async ({
  page,
  isMobile,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'connection', { value: { saveData: true } }),
  );
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openPage(page, '/products');
  await page.waitForTimeout(700);
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let waiting = false;
  await page.route(/\/AboutPage-[^/]+\.js(?:\?|$)/u, async (route) => {
    waiting = true;
    await gate;
    await route.continue();
  });
  // The footer provides the same native route link on desktop and mobile.
  const link = page
    .getByRole('navigation', { name: 'Footer', exact: true })
    .getByRole('link', { name: 'About', exact: true });
  await link.click();
  await expect.poll(() => waiting).toBe(true);
  await expect(page).toHaveURL(/\/products$/u);
  await expect(page.locator('.products-overview')).toBeAttached();
  await expect(page.locator('.page-status')).toHaveCount(0);
  release();
  await expect(page).toHaveURL(/\/about$/u);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('The Minimalist');
  await expect(page.locator('#main-content')).toBeFocused();
  const pose = await page.evaluate(() => ({
    headerY: document.querySelector('.site-header')!.getBoundingClientRect().y,
    shell: getComputedStyle(document.querySelector('.app-shell')!).transform,
    route: getComputedStyle(document.querySelector('.route-view')!).opacity,
    scroll: scrollY,
  }));
  expect(Math.abs(pose.headerY)).toBeLessThan(1);
  expect(pose.shell).toBe('none');
  expect(pose.route).toBe('1');
  expect(pose.scroll).toBe(0);
  if (!isMobile)
    await expect(page.getByRole('navigation', { name: 'Primary', exact: true })).toBeVisible();
});

test('first entry keeps fixed header geometry steady while the loader reveals', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const state = window as unknown as { entryHeaderShift: number; routeSnapshots: number };
    state.entryHeaderShift = 0;
    state.routeSnapshots = 0;
    const start = document.startViewTransition?.bind(document);
    if (start)
      document.startViewTransition = (...args) => {
        state.routeSnapshots++;
        return start(...args);
      };
    const started = performance.now();
    const measure = () => {
      const header = document.querySelector('.site-header');
      if (header)
        state.entryHeaderShift = Math.max(
          state.entryHeaderShift,
          Math.abs(header.getBoundingClientRect().y),
        );
      if (performance.now() - started < 8_000) requestAnimationFrame(measure);
    };
    requestAnimationFrame(measure);
  });
  await openPage(page, '/contact');
  await page.waitForTimeout(500);
  expect(
    await page.evaluate(() => (window as unknown as { entryHeaderShift: number }).entryHeaderShift),
  ).toBeLessThan(1);
  await page
    .getByRole('navigation', { name: 'Footer', exact: true })
    .getByRole('link', { name: 'Website templates', exact: true })
    .click();
  await expect(page).toHaveURL(/\/products\/templates$/u);
  expect(
    await page.evaluate(() => (window as unknown as { routeSnapshots: number }).routeSnapshots),
  ).toBe(0);
});

test('initial page mounting cannot be bypassed by the visual timeout', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let waiting = false;
  await page.route(/\/AboutPage-[^/]+\.js(?:\?|$)/u, async (route) => {
    waiting = true;
    await gate;
    await route.continue();
  });
  await page.goto('/about', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => waiting).toBe(true);
  await page.waitForTimeout(LOADER.maximumDuration + 200);
  await expect(page.locator('.page-loader')).toBeVisible();
  expect(Number(await page.getByRole('progressbar').getAttribute('aria-valuenow'))).toBeLessThan(
    100,
  );
  release();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('The Minimalist');
  await expect(page.locator('.page-loader')).toHaveCount(0, { timeout: 15_000 });
});
