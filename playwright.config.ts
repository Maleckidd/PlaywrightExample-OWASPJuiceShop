import { defineConfig, devices } from '@playwright/test';

/**
 * OWASP Juice Shop - Playwright Configuration
 * Retries: 2, Headless: true, Viewport: 1280x720
 */

const baseURL = process.env.JUICE_SHOP_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000,
  expect: { timeout: 5000 },
  reporter: [
    ['html'],
    ['list'],
    process.env.CI ? ['github'] : null,
  ].filter(Boolean) as any,

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
    viewport: { width: 1280, height: 720 },
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
