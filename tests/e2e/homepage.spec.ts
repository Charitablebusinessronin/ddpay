import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Payload/)
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check that main content is visible
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })
})
