import { expect, test } from '@playwright/test';
import { openPage } from './helpers';

test('legacy inquiry URLs have deployable HTML shells with Contact metadata', async ({
  request,
}) => {
  for (const path of ['/inquiries', '/inquiries/quote', '/inquiries/appointment']) {
    const response = await request.get(`${path}/index.html`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('<title>Contact — The Minimalist</title>');
    expect(html).toContain('id="root"');
    expect(html).toContain('type="module"');
  }
});

test('one contact page handles hello, quotes, and meetings without sub-pages', async ({ page }) => {
  await openPage(page, '/contact');
  const form = page.getByRole('form', { name: 'What can we help with?' });
  await expect(form.getByRole('radio', { name: /Say hello/ })).toBeChecked();
  await expect(form.getByLabel('Service')).toHaveCount(0);

  await form.getByText('Request a quote', { exact: true }).click();
  await expect(form.getByLabel('Service')).toBeVisible();
  await form.getByRole('button', { name: /Send message/ }).click();
  await expect(form.getByText('Please add your name.')).toBeVisible();
  await expect(form.getByText('Please choose a service.')).toBeVisible();
  await expect(form.getByLabel('Name')).toBeFocused();

  await form.getByLabel('Name').fill('Ana Cruz');
  await form.getByLabel('Email').fill('ana@example.com');
  await form.getByLabel('Service').selectOption('Branding identity');
  await form.getByLabel('Your message').fill('We are opening a café and need a brand.');
  await form.getByRole('button', { name: /Send message/ }).click();
  await expect(form.getByRole('status')).toContainText('Your email app should open');
  await expect(form.locator('.inquiry-error')).toHaveCount(0);

  await form.getByText('Book a meeting', { exact: true }).click();
  await expect(form.getByLabel('Preferred date')).toBeVisible();
  await expect(form.getByRole('radio', { name: 'Online', exact: true })).toBeVisible();
});

test('old inquiry links open the contact page with the right option chosen', async ({ page }) => {
  for (const [path, label] of [
    ['/inquiries/quote', /Request a quote/],
    ['/inquiries/appointment', /Book a meeting/],
    ['/inquiries', /Say hello/],
  ] as const) {
    await openPage(page, path);
    await expect(page).toHaveURL(/\/contact\?inquiry=/u);
    await expect(page.getByRole('radio', { name: label })).toBeChecked();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const mode of ['missing', 'denied', 'allowed'] as const) {
  test(`message copying handles a ${mode} clipboard`, async ({ page }) => {
    await page.addInitScript((mode) => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value:
          mode === 'missing'
            ? undefined
            : {
                writeText: async (text: string) => {
                  if (mode === 'denied') throw new Error('Permission denied');
                  sessionStorage.setItem('copied-inquiry-test', text);
                },
              },
      });
    }, mode);
    await openPage(page, '/contact');
    const form = page.getByRole('form', { name: 'What can we help with?' });
    await form.getByLabel('Name', { exact: true }).fill('Ana Cruz');
    await form.getByLabel('Email', { exact: true }).fill('ana@example.com');
    await form.getByLabel('Your message').fill('We would like a website for our studio.');
    await form.getByRole('button', { name: 'Send message', exact: true }).click();
    await form.getByRole('button', { name: 'Didn’t open? Copy the message' }).click();
    if (mode === 'allowed') {
      await expect(form.getByRole('status')).toContainText('Copied.');
      expect(await page.evaluate(() => sessionStorage.getItem('copied-inquiry-test'))).toContain(
        'Ana Cruz',
      );
    } else {
      await expect(form.getByRole('status')).toContainText('Automatic copying is unavailable');
      await expect(form.getByLabel('Message to copy')).toHaveValue(/Hello from Ana Cruz/u);
      await expect(form.getByLabel('Message to copy')).toHaveValue(/We would like a website/u);
      const direct = page.locator('.contact-details');
      await direct.getByRole('button', { name: 'Copy', exact: true }).click();
      await expect(direct.getByRole('status')).toContainText('copy it manually');
    }
  });
}

test('rapid form changes settle and reduced motion stops the envelope', async ({ page }) => {
  await openPage(page, '/contact?inquiry=quote');
  const form = page.getByRole('form', { name: 'What can we help with?' });
  // Programmatic activation intentionally interrupts the in-flight resize.
  await form
    .getByRole('radio', { name: /Book a meeting/u })
    .evaluate((element: HTMLInputElement) => element.click());
  await page.waitForTimeout(120);
  await form
    .getByRole('radio', { name: /Say hello/u })
    .evaluate((element: HTMLInputElement) => element.click());
  await page.waitForTimeout(120);
  await form
    .getByRole('radio', { name: /Request a quote/u })
    .evaluate((element: HTMLInputElement) => element.click());
  await expect(form.getByLabel('Service')).toBeVisible();
  await expect
    .poll(() =>
      form.evaluate(
        (element) =>
          element.getAnimations().filter((animation) => animation.playState === 'running').length,
      ),
    )
    .toBe(0);
  expect(await form.evaluate((element) => element.scrollHeight <= element.clientHeight + 1)).toBe(
    true,
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(form).toHaveAttribute('data-motion', 'paused');
  await form.getByText('Book a meeting', { exact: true }).click();
  await expect(form.getByLabel('Preferred date')).toBeVisible();
  await expect(form.locator('.inquiry-intent[data-selected]')).toContainText('Book a meeting');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('collapsed social links stay out of keyboard navigation without inert support', async ({
  page,
}) => {
  await page.addInitScript(() => {
    delete (HTMLElement.prototype as { inert?: boolean }).inert;
  });
  await openPage(page, '/contact');
  const more = page.locator('.contact-more');
  await expect(more).toHaveAttribute('aria-hidden', 'true');
  for (const link of await more.locator('a').all())
    await expect(link).toHaveAttribute('tabindex', '-1');
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await expect(more).toHaveAttribute('aria-hidden', 'false');
  await expect(more.getByRole('link').first()).not.toHaveAttribute('tabindex', '-1');
  await page.getByRole('button', { name: 'Less', exact: true }).click();
  await expect(more.locator('a').first()).toHaveAttribute('tabindex', '-1');
});

test('inquiry labels open the envelope and animate a persistent stamp without requiring focus', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openPage(page, '/contact');
  const form = page.locator('.inquiry-form');
  const svg = form.locator('.envelope');
  const stamp = svg.locator('[data-envelope-stamp]');
  await svg.scrollIntoViewIfNeeded();
  await expect(form).toHaveAttribute('data-motion', 'running');
  await stamp.evaluate((element) => element.setAttribute('data-test-identity', 'original'));
  for (const label of ['Request a quote', 'Book a meeting', 'Say hello']) {
    await form.getByText(label, { exact: true }).click();
    await expect(form).toHaveAttribute('data-engaged', '');
    await expect(svg).toHaveAttribute('data-changing', '');
    await expect(stamp).toHaveAttribute('data-test-identity', 'original');
    const first = await stamp.getAttribute('transform');
    expect(first).not.toBeNull();
    await expect.poll(() => stamp.getAttribute('transform')).not.toBe(first);
    await expect
      .poll(() =>
        svg
          .locator('.envelope-flap--open')
          .evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m22),
      )
      .toBeGreaterThan(0.99);
    await expect(svg).not.toHaveAttribute('data-changing', '');
    await expect(stamp).not.toHaveAttribute('transform');
  }
});

test('reduced motion leaves the selected envelope symbol visible without a tween', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPage(page, '/contact');
  const form = page.locator('.inquiry-form');
  await form.getByText('Book a meeting', { exact: true }).click();
  await expect(form).toHaveAttribute('data-engaged', '');
  await expect(form.locator('.envelope')).not.toHaveAttribute('data-changing', '');
  await expect(form.locator('[data-envelope-stamp]')).not.toHaveAttribute('transform');
  await expect(form.getByLabel('Preferred date')).toBeVisible();
  await expect
    .poll(() =>
      form
        .locator('.envelope-flap--open')
        .evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m22),
    )
    .toBeGreaterThan(0.99);
});
