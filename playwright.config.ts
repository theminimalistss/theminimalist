import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.E2E_PORT ?? 4173);
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error('E2E_PORT must be a port between 1024 and 65535.');
}
const buildDirectory = `.cache/e2e/${port}`;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  outputDir: `test-results/${port}`,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never', outputFolder: `playwright-report/${port}` }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 960 } },
    },
    ...(process.env.CI || process.env.E2E_FIREFOX
      ? [
          {
            name: 'desktop-firefox',
            use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 960 } },
          },
        ]
      : []),
    {
      name: 'desktop-webkit',
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 960 } },
    },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: `npm run build -- --outDir ${buildDirectory} && npm run preview -- --outDir ${buildDirectory} --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: false,
    env: { VITE_SITE_URL: '', VITE_CONTACT_ENDPOINT: '' },
    timeout: 120_000,
  },
});
