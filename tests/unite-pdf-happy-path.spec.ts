// spec: Complete Happy Path Flow
// seed: Start from home page at http://localhost:5173/

import { test, expect } from '@playwright/test';

test.describe('Complete Happy Path Flow', () => {
  test('Unite PDF happy path', async ({ page }) => {
    // 1. Navigate to http://localhost:5173/
    await page.goto('http://localhost:5173/');

    // 2. Verify the page title contains "Merge PDF for Duplex Printing"
    await expect(page.getByRole('heading', { name: 'Merge PDF for Duplex Printing' })).toBeVisible();

    // 3. Verify the upload area is visible with text "Upload PDF Files"
    await expect(page.getByTestId('dropzone').getByText('Upload PDF Files')).toBeVisible();

    // 4. Upload the first PDF file: tests/fixtures/3-pages.pdf
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/3-pages.pdf');

    // 5. Wait for the PDF preview to load
    await expect(page.getByText('3 pages')).toBeVisible();

    // 6. Verify the uploaded PDF card shows "3-pages.pdf" and "3 pages"
    await expect(page.getByText('3-pages.pdf')).toBeVisible();
    await expect(page.getByText('3 pages')).toBeVisible();

    // 7. Click "Add more PDFs" button
    await page.getByText('+ Add more PDFs').click();

    // 8. Upload the second PDF file: tests/fixtures/5-pages.pdf
    await fileInput.setInputFiles('tests/fixtures/5-pages.pdf');

    // 9. Wait for the second PDF preview to load
    await expect(page.getByText('5 pages')).toBeVisible();

    // 10. Verify the second PDF card shows "5-pages.pdf" and "5 pages"
    await expect(page.getByText('5-pages.pdf')).toBeVisible();
    await expect(page.getByText('5 pages')).toBeVisible();

    // 11. Click "Add more PDFs" button
    await page.getByText('+ Add more PDFs').click();

    // 12. Upload the third PDF file: tests/fixtures/2-pages.pdf
    await fileInput.setInputFiles('tests/fixtures/2-pages.pdf');

    // 13. Wait for the third PDF preview to load
    await expect(page.getByText('2 pages')).toBeVisible();

    // 14. Verify the third PDF card shows "2-pages.pdf" and "2 pages"
    await expect(page.getByText('2-pages.pdf')).toBeVisible();
    await expect(page.getByText('2 pages')).toBeVisible();

    // 15. Verify the summary shows "Total PDFs: 3"
    await expect(page.getByText('Total PDFs:').locator('..').getByText('3')).toBeVisible();

    // 16. Verify the summary shows "Total pages: 10"
    await expect(page.getByText('Total pages:').locator('..').getByText('10')).toBeVisible();

    // 17. Verify "Duplex mode" is shown as disabled
    await expect(page.getByText('Duplex mode:').locator('..').getByText('✗ Disabled')).toBeVisible();

    // 18. Click the duplex mode toggle to enable it
    await page.getByRole('switch', { name: 'Enable duplex printing mode' }).click();

    // 19. Verify the summary shows "Total pages: 12" (10 + 2 blank pages)
    await expect(page.getByText('Total pages:').locator('..').getByText('12')).toBeVisible();

    // 20. Verify "Duplex mode" is shown as enabled
    await expect(page.getByText('Duplex mode:').locator('..').getByText('✓ Enabled')).toBeVisible();

    // 21. Click the "Continue" button to start merging PDFs
    await page.getByRole('button', { name: /Continue/ }).click();

    // 22. Wait for the merge to complete - "Download Merged PDF" button appears
    await expect(page.getByRole('button', { name: 'Download Merged PDF' })).toBeVisible({ timeout: 30000 });

    // 23. Click the "Download Merged PDF" button
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download Merged PDF' }).click();

    // 24. Wait for the download to complete
    await downloadPromise;
  });
});
