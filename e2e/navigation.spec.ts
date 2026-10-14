import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPage, revealAll } from './helpers';

const FOOTER_PAGES: readonly (readonly [string, RegExp, string?])[] = [
  ['About', /The Minimalist/],
  ['Founders', /Two founders/],
  ['Testimonials', /Kind words/],
  ['Works', /Selected works/],
  ['All services', /Software, websites/, 'Services'],
  ['Software development', /Software development/],
  ['Website development', /Website development/],
  ['Branding identity', /Branding identity/],
  ['Software solutions', /Software solutions/],
  ['Website templates', /Website templates/],
  ['Hardware products', /Hardware products/],
  ['Contact', /Let’s talk/],
  ['Request a quote', /Let’s talk/, 'Contact'],
  ['Book an appointment', /Let’s talk/, 'Contact'],
];

test('the footer sitemap reaches every page', async ({ page }) => {
  test.slow();
  await openPage(page, '/about');
  const footer = page.getByRole('navigation', { name: 'Footer' });
  for (const [label, heading, title = label] of FOOTER_PAGES) {
    await footer.getByRole('link', { name: label, exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page).toHaveTitle(new RegExp(`^${title}.* — The Minimalist$`));
  }
});

test('the studio overview leads to Founders, Testimonials, and Works', async ({ page }) => {
  await openPage(page, '/about');
  const intro = page.locator('.page-intro');
  await expect(intro.getByRole('heading', { level: 1 })).toHaveText(
    'The Minimalist Design Studio.',
  );
  await expect(intro.locator('.page-lead')).toHaveText(
    'We shape identities and digital experiences with clarity, character, and care. Less, but with feeling. Our full studio story is being written; here is where we begin.',
  );
  const destinations = page.getByRole('navigation', { name: 'Studio destinations' });
  await expect(destinations.getByRole('link')).toHaveCount(3);
  for (const link of await destinations.getByRole('link').all()) {
    await expect(link).toBeInViewport({ ratio: 1 });
  }
  await revealAll(page);
  await destinations.scrollIntoViewIfNeeded();
  await expect(destinations.locator('.studio-founder')).toHaveCount(2);
  await expect(destinations.locator('.studio-study')).toHaveCount(2);
  await expect(
    destinations.getByRole('link', { name: 'Works', exact: true }),
  ).toHaveAccessibleDescription('Independent concept studies from the studio.');
  await expect
    .poll(() =>
      destinations
        .locator('img')
        .evaluateAll((images) =>
          images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
        ),
    )
    .toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => innerWidth),
  );
  for (const [label, path, heading] of [
    ['Founders', '/founders', /Two founders/],
    ['Testimonials', '/testimonials', /Kind words/],
    ['Works', '/works', /Selected works/],
  ] as const) {
    const link = destinations.getByRole('link', { name: label, exact: true });
    await expect(link).toHaveAttribute('href', path);
    await link.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await page.goBack();
    await expect(page).toHaveURL(/\/about$/);
  }
});

test('the studio sprig waves, responds to the pointer, and respects reduced motion', async ({
  page,
  isMobile,
}) => {
  await openPage(page, '/about');
  const sprig = page.locator('.studio-manifesto-mark');
  const stem = sprig.locator('[data-sprig-stem]');
  await sprig.scrollIntoViewIfNeeded();
  await expect(sprig).toHaveAttribute('data-waving', '');
  const initial = await stem.evaluate((element) => getComputedStyle(element).transform);
  await expect
    .poll(() => stem.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(initial);
  if (!isMobile) {
    await sprig.hover({ position: { x: 40, y: 60 } });
    await expect(sprig).toHaveAttribute('data-doodling', '');
    await expect
      .poll(() => sprig.locator('svg').evaluate((element) => element.style.filter))
      .toContain('url(');
    await page.mouse.move(0, 0);
    await expect(sprig).not.toHaveAttribute('data-doodling', '');
    await expect
      .poll(() => sprig.locator('svg').evaluate((element) => element.style.filter))
      .toBe('');
  } else {
    await sprig.tap();
    await expect(sprig).toHaveAttribute('data-doodling', '');
    await expect
      .poll(() => sprig.locator('svg').evaluate((element) => element.style.filter))
      .toContain('url(');
    await expect
      .poll(() => sprig.locator('svg').evaluate((element) => element.style.filter))
      .toBe('');
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(sprig).not.toHaveAttribute('data-waving', '');
  expect(
    await stem.evaluate((element) =>
      element.getAnimations().every((animation) => animation.playState === 'paused'),
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await sprig.scrollIntoViewIfNeeded();
  await expect(sprig).not.toHaveAttribute('data-waving', '');
  await expect(stem).toHaveCSS('transform', 'none');
  await expect(sprig.locator('svg')).toHaveCSS('filter', 'none');
});

test('optional audio and video downloads do not block the opening screen', async ({ page }) => {
  await page.route(/\.(?:mp3|mp4|webm)(?:\?|$)/u, () => {});
  await page.goto('/?utm_source=deployment-check', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.page-loader')).toHaveCount(0, { timeout: 6_000 });
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeVisible();
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Two founders/);
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
  test.slow(); // Loads and audits five pages in turn.
  for (const path of [
    '/about',
    '/founders',
    '/services',
    '/services/branding',
    '/products/hardware',
    '/contact',
    '/contact?inquiry=appointment',
  ]) {
    await openPage(page, path);
    await revealAll(page);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations, path).toEqual([]);
  }
});

test('the logo doodles on hover, pops on click, and sways with scrolling', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Hover and wheel are for desktop pointers.');
  await openPage(page, '/about');
  const logo = page.locator('.studio-logo');
  const mark = page.locator('.studio-mark');
  await logo.hover();
  await expect
    .poll(() => mark.evaluate((element) => (element as SVGElement).style.filter))
    .toContain('url(');
  await page.evaluate(() =>
    document
      .querySelector('.studio-logo')
      ?.addEventListener('click', (event) => event.preventDefault(), { once: true }),
  );
  await logo.click();
  expect(
    await page
      .locator('.studio-logo-pop path')
      .evaluateAll((strokes) => strokes.filter((stroke) => stroke.getAnimations().length).length),
  ).toBe(5);
  await page.mouse.move(640, 600);
  await page.mouse.wheel(0, 700);
  await expect
    .poll(() =>
      page
        .locator('.studio-logo-mark')
        .evaluate((element) =>
          Math.abs(Number((element as HTMLElement).style.getPropertyValue('--logo-sway') || 0)),
        ),
    )
    .toBeGreaterThan(0.1);
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

test('founder portraits swap with their scrolling names and playback can pause', async ({
  page,
}) => {
  test.setTimeout(45_000);
  await openPage(page, '/founders');
  const showcase = page.getByRole('region', { name: 'Founding partners' });
  for (const [name, role, linkedin] of [
    [
      'Daisy Nuique',
      'Product / Visual Designer',
      'https://www.linkedin.com/in/daisy-grace-nuique/',
    ],
    ['Rex Pinili', 'Software Engineer', 'https://www.linkedin.com/in/rex-james-pinili-260135116/'],
  ] as const) {
    const button = showcase.getByRole('button', { name, exact: true });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(showcase.getByRole('heading', { level: 2 })).toHaveText(name);
    await expect(showcase.getByText(role, { exact: true })).toBeVisible();
    const image = showcase.getByRole('img', { name: `Portrait of ${name}` });
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
    await expect(showcase.getByRole('img')).toHaveCount(1);
    const link = showcase.getByRole('link', { name: `${name} on LinkedIn (opens in a new tab)` });
    await expect(link).toHaveAttribute('href', linkedin);
    await expect(link).toHaveAttribute('target', '_blank');
  }
  await page.mouse.move(0, 0);
  const track = showcase.locator('.founder-scene[data-active] [data-name-track]');
  const initial = await track.evaluate((element) => getComputedStyle(element).transform);
  await expect
    .poll(() => track.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(initial);
  await showcase.getByRole('button', { name: 'Pause founder slideshow' }).click();
  await expect(showcase).not.toHaveAttribute('data-playing', '');
  const position = () => track.evaluate((element) => getComputedStyle(element).transform);
  await expect
    .poll(async () => {
      const before = await position();
      await page.waitForTimeout(200);
      return before === (await position());
    })
    .toBe(true);
  const pausedPosition = await position();
  await page.waitForTimeout(7_300);
  await expect(showcase.getByRole('heading', { level: 2 })).toHaveText('Rex Pinili');
  expect(await track.evaluate((element) => getComputedStyle(element).transform)).toBe(
    pausedPosition,
  );
  await showcase.getByRole('button', { name: 'Play founder slideshow' }).click();
  await expect(showcase.getByRole('heading', { level: 2 })).toHaveText('Daisy Nuique', {
    timeout: 9_000,
  });
});

test('founders slide with the arrows or a swipe, and the next founder is named', async ({
  page,
  isMobile,
}) => {
  await openPage(page, '/founders');
  const showcase = page.getByRole('region', { name: 'Founding partners' });
  const heading = showcase.getByRole('heading', { level: 2 });
  await showcase.getByRole('button', { name: 'Pause founder slideshow' }).click();
  await expect(showcase.locator('[data-step="next"] .founder-step-label')).toHaveText(
    'NextRex Pinili',
  );
  await showcase.locator('.founder-scene[data-active] .founder-portrait-shell').hover();
  const leaving = showcase.locator('.founder-scene[data-leaving]');
  await showcase.getByRole('button', { name: 'Next founder: Rex Pinili' }).click();
  await expect(heading).toHaveText('Rex Pinili');
  await expect(leaving).toHaveCount(1);
  await expect(leaving).toHaveCount(0, { timeout: 6_000 });
  await showcase.getByRole('button', { name: 'Previous founder: Daisy Nuique' }).click();
  await expect(heading).toHaveText('Daisy Nuique');
  await expect(leaving).toHaveCount(0, { timeout: 6_000 });
  if (!isMobile) {
    const box = await showcase
      .locator('.founder-scene[data-active] .founder-portrait-shell')
      .boundingBox();
    if (!box) throw new Error('Missing portrait');
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width - 40, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width - 200, y, { steps: 6 });
    await page.mouse.up();
    await expect(heading).toHaveText('Rex Pinili');
  }
});

test('founder selection is keyboard accessible and reduced motion disables autoplay', async ({
  page,
  browserName,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPage(page, '/founders');
  const showcase = page.getByRole('region', { name: 'Founding partners' });
  await expect(showcase).not.toHaveAttribute('data-playing', '');
  await expect(showcase.getByRole('button', { name: /founder slideshow/ })).toHaveCount(0);
  const rex = showcase.getByRole('button', { name: 'Rex Pinili', exact: true });
  await rex.focus();
  await page.keyboard.press('Enter');
  await expect(showcase.getByRole('heading', { level: 2 })).toHaveText('Rex Pinili');
  await expect(showcase.getByRole('link')).toHaveCount(1);
  if (!isMobile) {
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Shift+Tab' : 'Shift+Tab');
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Shift+Tab' : 'Shift+Tab');
    await expect(showcase.getByRole('link')).toBeFocused();
  }
  await expect
    .poll(() => showcase.evaluate((element) => element.getAnimations({ subtree: true }).length))
    .toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await rex.focus();
  await expect(showcase).toHaveAttribute('data-playing', '');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(showcase).not.toHaveAttribute('data-playing', '');
  await expect
    .poll(() => showcase.evaluate((element) => element.getAnimations({ subtree: true }).length))
    .toBe(0);
});

test('founder portrait gains spatial depth on hover and settles on leave', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Pointer depth is reserved for a fine mouse pointer.');
  await openPage(page, '/founders');
  const showcase = page.getByRole('region', { name: 'Founding partners' });
  const shell = showcase.locator('.founder-scene[data-active] .founder-portrait-shell');
  const portrait = shell.locator('.founder-portrait');
  const resting = await portrait.evaluate((element) => getComputedStyle(element).transform);
  await shell.hover({ position: { x: 40, y: 40 } });
  await expect(shell).toHaveAttribute('data-depth', '');
  await expect(showcase).not.toHaveAttribute('data-playing', '');
  await expect
    .poll(() => portrait.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(resting);
  await expect
    .poll(() =>
      shell.evaluate((element) => parseFloat(element.style.getPropertyValue('--portrait-ry'))),
    )
    .toBeLessThan(-1);
  await page.mouse.move(0, 0);
  await expect(shell).not.toHaveAttribute('data-depth', '');
  await expect(showcase).toHaveAttribute('data-playing', '');
  await expect
    .poll(() => portrait.evaluate((element) => getComputedStyle(element).transform))
    .toBe(resting);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await shell.hover({ position: { x: 40, y: 40 } });
  await expect(shell).not.toHaveAttribute('data-depth', '');
  await expect(portrait).toHaveCSS('transform', 'none');
});

test('contact shows main social channels and reveals the rest under More', async ({ page }) => {
  await openPage(page, '/contact');
  const main = page.getByRole('list', { name: 'Main social channels' });
  for (const [label, url] of [
    ['Facebook', 'https://www.facebook.com/SimplyDaissy'],
    ['Instagram', 'https://www.instagram.com/theminimalistdesignstudio_'],
    ['LinkedIn', 'https://www.linkedin.com/company/the-minimalists-studio'],
  ] as const) {
    const link = main.getByRole('link', { name: new RegExp(label) });
    await expect(link).toHaveAttribute('href', url);
    await expect(link).toHaveAttribute('target', '_blank');
  }
  const more = page.getByRole('button', { name: 'More' });
  const tiktok = page.getByRole('link', { name: /TikTok/ });
  await expect(more).toHaveAttribute('aria-expanded', 'false');
  await expect(tiktok).not.toBeVisible();
  await more.click();
  await expect(page.getByRole('button', { name: 'Less' })).toHaveAttribute('aria-expanded', 'true');
  await expect(tiktok).toBeVisible();
  await expect(tiktok).toHaveAttribute('href', 'https://www.tiktok.com/@theminimalistdesign');
  await expect(page.getByRole('link', { name: /Behance/ })).toHaveAttribute(
    'href',
    'https://www.behance.net/theminimalistdesigns',
  );
  await expect(
    page.locator('.contact-details').getByRole('link', { name: 'theminimalistss@gmail.com' }),
  ).toHaveAttribute('href', 'mailto:theminimalistss@gmail.com');
  await expect(page.getByText('7:00 AM – 11:00 AM')).toBeVisible();
  await expect(page.locator('.contact-details dt')).toHaveText(['Email', 'Hours', 'Replies']);
});
