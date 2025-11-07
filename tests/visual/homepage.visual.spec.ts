import { test, expect } from '@playwright/test'

/**
 * Visual regression tests for UnitePDF
 *
 * These tests capture screenshots and compare them against baseline images
 * to detect unintended visual changes.
 *
 * Run: pnpm test:visual
 * Update baselines: pnpm test:visual:update
 * View report: pnpm test:report
 */

test.describe('UnitePDF Application States', () => {
  test('empty state - no files uploaded', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Capture the empty state
    await expect(page).toHaveScreenshot('app-empty-state.png', {
      fullPage: true,
    })
  })

  test('responsive - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('app-mobile.png', {
      fullPage: true,
    })
  })

  test('responsive - desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('app-desktop.png', {
      fullPage: true,
    })
  })
})

test.describe('Theme Support', () => {
  test('dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('app-dark-mode.png', {
      fullPage: true,
    })
  })

  test('light mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('app-light-mode.png', {
      fullPage: true,
    })
  })
})
