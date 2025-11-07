import { test, expect } from '@playwright/test';

test.describe('Duplex Mode Calculations', () => {
  test('Test Scenario 1: Mixed Odd and Even Pages', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:5173/');

    // Upload first PDF: 3-pages.pdf (odd)
    const fileChooserPromise1 = page.waitForEvent('filechooser');
    await page.getByTestId('dropzone').click();
    const fileChooser1 = await fileChooserPromise1;
    await fileChooser1.setFiles('tests/fixtures/3-pages.pdf');

    // Verify 3 pages are loaded
    await expect(page.getByText('3 pages')).toBeVisible();
    await expect(page.getByText('Total pages:').locator('..').getByText('3')).toBeVisible();

    // Upload second PDF: 2-pages.pdf (even)
    const fileChooserPromise2 = page.waitForEvent('filechooser');
    await page.getByText('+ Add more PDFs').click();
    const fileChooser2 = await fileChooserPromise2;
    await fileChooser2.setFiles('tests/fixtures/2-pages.pdf');

    // Verify 5 pages total
    await expect(page.getByText('2 pages')).toBeVisible();
    await expect(page.getByText('Total pages:').locator('..').getByText('5')).toBeVisible();

    // Upload third PDF: 5-pages.pdf (odd)
    const fileChooserPromise3 = page.waitForEvent('filechooser');
    await page.getByText('+ Add more PDFs').click();
    const fileChooser3 = await fileChooserPromise3;
    await fileChooser3.setFiles('tests/fixtures/5-pages.pdf');

    // Verify 10 pages total (3 + 2 + 5)
    await expect(page.getByText('5 pages')).toBeVisible();
    await expect(page.getByText('Total pages:').locator('..').getByText('10')).toBeVisible();

    // Enable duplex mode
    await page.getByRole('switch', { name: 'Enable duplex printing mode' }).click();

    // Verify 11 pages total with duplex (3+1 blank + 2 + 5 no blank = 11)
    await expect(page.getByText('Total pages:').locator('..').getByText('11')).toBeVisible();
    await expect(page.getByText('✓ Enabled')).toBeVisible();

    // Disable duplex mode
    await page.getByRole('switch', { name: 'Enable duplex printing mode' }).click();

    // Verify back to 10 pages
    await expect(page.getByText('Total pages:').locator('..').getByText('10')).toBeVisible();
    await expect(page.getByText('✗ Disabled')).toBeVisible();

    // Enable duplex mode again
    await page.getByRole('switch', { name: 'Enable duplex printing mode' }).click();

    // Verify 11 pages again
    await expect(page.getByText('Total pages:').locator('..').getByText('11')).toBeVisible();
    await expect(page.getByText('✓ Enabled')).toBeVisible();
  });

  test('Test Scenario 2: All Odd Pages', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:5173/');

    // Upload first PDF: 1-page.pdf (odd)
    const fileChooserPromise1 = page.waitForEvent('filechooser');
    await page.getByTestId('dropzone').click();
    const fileChooser1 = await fileChooserPromise1;
    await fileChooser1.setFiles('tests/fixtures/1-page.pdf');

    // Verify 1 page is loaded
    await expect(page.getByText('1 page')).toBeVisible();
    await expect(page.getByText('Total pages:').locator('..').getByText('1')).toBeVisible();

    // Upload second PDF: 3-pages.pdf (odd)
    const fileChooserPromise2 = page.waitForEvent('filechooser');
    await page.getByText('+ Add more PDFs').click();
    const fileChooser2 = await fileChooserPromise2;
    await fileChooser2.setFiles('/Users/yasithranusha/Developer/proj-pdf/tests/fixtures/3-pages.pdf');

    // Verify 4 pages total
    await expect(page.getByText('3 pages')).toBeVisible();
    await expect(page.getByText('Total pages:').locator('..').getByText('4')).toBeVisible();

    // Upload third PDF: 5-pages.pdf (odd)
    const fileChooserPromise3 = page.waitForEvent('filechooser');
    await page.getByText('+ Add more PDFs').click();
    const fileChooser3 = await fileChooserPromise3;
    await fileChooser3.setFiles('tests/fixtures/5-pages.pdf');

    // Verify 9 pages total (1 + 3 + 5)
    await expect(page.getByText('5 pages')).toBeVisible();
    await expect(page.getByText('Total pages:').locator('..').getByText('9')).toBeVisible();

    // Enable duplex mode
    await page.getByRole('switch', { name: 'Enable duplex printing mode' }).click();

    // Verify 11 pages total with duplex (1+1 blank + 3+1 blank + 5 no blank = 11)
    await expect(page.getByText('Total pages:').locator('..').getByText('11')).toBeVisible();
    await expect(page.getByText('✓ Enabled')).toBeVisible();
  });

  test('Test Scenario 3: All Even Pages', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:5173/');

    // Upload first PDF: 2-pages.pdf (even)
    const fileChooserPromise1 = page.waitForEvent('filechooser');
    await page.getByTestId('dropzone').click();
    const fileChooser1 = await fileChooserPromise1;
    await fileChooser1.setFiles('/Users/yasithranusha/Developer/proj-pdf/tests/fixtures/2-pages.pdf');

    // Verify 2 pages are loaded
    await expect(page.getByText('2 pages')).toBeVisible();
    await expect(page.getByText('Total pages:').locator('..').getByText('2')).toBeVisible();

    // Upload second PDF: 10-pages.pdf (even)
    const fileChooserPromise2 = page.waitForEvent('filechooser');
    await page.getByText('+ Add more PDFs').click();
    const fileChooser2 = await fileChooserPromise2;
    await fileChooser2.setFiles('tests/fixtures/10-pages.pdf');

    // Verify 12 pages total (2 + 10)
    await expect(page.getByText('10 pages')).toBeVisible();
    await expect(page.getByText('Total pages:').locator('..').getByText('12')).toBeVisible();

    // Enable duplex mode
    await page.getByRole('switch', { name: 'Enable duplex printing mode' }).click();

    // Verify still 12 pages (no blank pages added for even PDFs)
    await expect(page.getByText('Total pages:').locator('..').getByText('12')).toBeVisible();
    await expect(page.getByText('✓ Enabled')).toBeVisible();

    // Disable duplex mode
    await page.getByRole('switch', { name: 'Enable duplex printing mode' }).click();

    // Verify still 12 pages
    await expect(page.getByText('Total pages:').locator('..').getByText('12')).toBeVisible();
    await expect(page.getByText('✗ Disabled')).toBeVisible();
  });
});
