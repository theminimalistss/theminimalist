import { expect, type Page } from '@playwright/test';

export async function openPage(page: Page, path = '/') {
  await page.goto(path);
  await expect(page.locator('.page-loader')).toHaveCount(0, { timeout: 10_000 });
}

export async function settle(page: Page) {
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

export async function revealAll(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 60)));
    }
    window.scrollTo(0, 0);
  });
  await settle(page);
}
