import { expect, test } from '@playwright/test';

const PAGES = [
  ['/', 'The Minimalist — Design Studio', 'home'],
  ['/about', 'About — The Minimalist', 'about'],
  ['/products/software', 'Software solutions — The Minimalist', 'software'],
  ['/inquiries/quote', 'Request a quote — The Minimalist', 'quote'],
] as const;

const content = (html: string, key: string) =>
  html.match(new RegExp(`(?:property|name)="${key}" content="([^"]*)"`))?.[1];

test.describe('link previews without JavaScript', () => {
  test.skip(({ isMobile }) => isMobile, 'Server responses are the same for every device.');

  for (const [path, title, image] of PAGES) {
    test(`serves share tags for ${path}`, async ({ request }) => {
      const response = await request.get(path, {
        headers: { 'User-Agent': 'facebookexternalhit/1.1' },
      });
      expect(response.status()).toBe(200);
      const html = await response.text();
      expect(html).toContain(`<title>${title}</title>`);
      expect(content(html, 'og:title')).toBe(title);
      expect(content(html, 'twitter:card')).toBe('summary_large_image');
      expect(content(html, 'og:image')).toMatch(new RegExp(`/social/${image}\\.png\\?v=`));
      const imageUrl = content(html, 'og:image') ?? '';
      const imageResponse = await request.get(imageUrl);
      expect(imageResponse.headers()['content-type']).toContain('image/png');
    });
  }

  test('campaign links still load and keep their parameters', async ({ page }) => {
    await page.goto('/works?utm_source=instagram&utm_medium=paid&fbclid=abc');
    await expect(page.locator('.page-loader')).toHaveCount(0, { timeout: 10_000 });
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Selected works/);
    expect(page.url()).toContain('utm_source=instagram');
  });
});
