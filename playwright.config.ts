import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for UnitePDF
 * Includes visual regression testing setup
 *
 * Run tests: pnpm exec playwright test
 * Update snapshots: pnpm exec playwright test --update-snapshots
 * Show report: pnpm exec playwright show-report
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html'],
    ['list'],
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:5173',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure visual regression testing
  expect: {
    toHaveScreenshot: {
      // Maximum number of pixels that can differ
      maxDiffPixels: 100,

      // Threshold for pixel difference (0-1)
      threshold: 0.2,

      // Disable animations for consistent screenshots
      animations: 'disabled',

      // Hide cursor/caret
      caret: 'hide',

      // Screenshot style
      scale: 'css',
    },
  },

  // Update snapshots with: pnpm exec playwright test --update-snapshots
  updateSnapshots: 'missing',

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Test against mobile viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },

    // Test against tablet viewports
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
