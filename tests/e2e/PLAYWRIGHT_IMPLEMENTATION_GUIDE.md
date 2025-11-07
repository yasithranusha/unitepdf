# Playwright Implementation Guide for UnitePDF E2E Tests

## Project Structure

```
tests/
├── e2e/
│   ├── TESTPLAN.md                        # Comprehensive test plan
│   ├── TEST_SCENARIOS.md                  # Quick reference scenarios
│   ├── PLAYWRIGHT_IMPLEMENTATION_GUIDE.md # This file
│   ├── unite-pdf-happy-path.spec.ts      # Main E2E test
│   ├── upload-functionality.spec.ts       # Upload tests
│   ├── duplex-mode.spec.ts               # Duplex calculation tests
│   ├── reordering.spec.ts                # Drag-drop tests
│   ├── summary.spec.ts                   # Summary display tests
│   ├── merge-process.spec.ts             # Merge and download tests
│   ├── file-removal.spec.ts              # File removal tests
│   └── edge-cases.spec.ts                # Edge cases
├── fixtures/
│   ├── 1-page.pdf
│   ├── 2-pages.pdf
│   ├── 3-pages.pdf
│   ├── 5-pages.pdf
│   └── 10-pages.pdf
└── helpers/
    └── pdf-helpers.ts                     # Shared helper functions
```

---

## Setup and Configuration

### Playwright Config (Already exists at `/Users/yasithranusha/Developer/proj-pdf/playwright.config.ts`)

Key settings to verify:
```typescript
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

## Helper Functions (`tests/helpers/pdf-helpers.ts`)

```typescript
import { Page, Locator, expect } from '@playwright/test';
import path from 'path';

const FIXTURES_PATH = path.join(__dirname, '..', 'fixtures');

export class PdfHelpers {
  constructor(private page: Page) {}

  /**
   * Upload one or more PDF files
   */
  async uploadFiles(...filenames: string[]) {
    const filePaths = filenames.map(f => path.join(FIXTURES_PATH, f));
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePaths);

    // Wait for at least one PDF card to appear
    await this.page.waitForSelector('text=Uploaded PDFs', {
      state: 'visible',
      timeout: 5000
    });
  }

  /**
   * Wait for all preview images to finish loading
   */
  async waitForPreviewsLoaded() {
    // Wait for loading spinners to disappear
    const loadingSpinner = this.page.locator('text=Loading preview...');
    const count = await loadingSpinner.count();

    if (count > 0) {
      await loadingSpinner.first().waitFor({ state: 'hidden', timeout: 10000 });
    }

    // Additional wait to ensure all previews are rendered
    await this.page.waitForTimeout(500);
  }

  /**
   * Get the current order of PDFs by reading position badges
   */
  async getPdfOrder(): Promise<string[]> {
    const cards = this.page.locator('[data-testid="pdf-card"]').or(
      this.page.locator('.group.relative.overflow-hidden')
    );
    const count = await cards.count();
    const filenames: string[] = [];

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const filename = await card.locator('p.font-medium').textContent();
      filenames.push(filename?.trim() || '');
    }

    return filenames;
  }

  /**
   * Get summary values from the sidebar
   */
  async getSummary() {
    const summarySection = this.page.locator('text=Summary').locator('..');

    const totalPdfs = await summarySection
      .locator('text=Total PDFs:')
      .locator('..')
      .locator('span.font-bold')
      .textContent();

    const totalPages = await summarySection
      .locator('text=Total pages:')
      .locator('..')
      .locator('span.font-bold')
      .textContent();

    const totalSize = await summarySection
      .locator('text=Total size:')
      .locator('..')
      .locator('span.font-bold')
      .textContent();

    const duplexMode = await summarySection
      .locator('text=Duplex mode:')
      .locator('..')
      .locator('span.font-bold')
      .textContent();

    return {
      totalPdfs: totalPdfs?.trim() || '',
      totalPages: totalPages?.trim() || '',
      totalSize: totalSize?.trim() || '',
      duplexMode: duplexMode?.trim() || '',
    };
  }

  /**
   * Toggle duplex mode
   */
  async toggleDuplex() {
    const duplexSwitch = this.page.locator('#duplex-toggle');
    await duplexSwitch.click();
    await this.page.waitForTimeout(300); // Allow for state update
  }

  /**
   * Get duplex switch state
   */
  async isDuplexEnabled(): Promise<boolean> {
    const duplexSwitch = this.page.locator('#duplex-toggle');
    return await duplexSwitch.isChecked();
  }

  /**
   * Click merge button and wait for process to start
   */
  async clickMerge() {
    const mergeButton = this.page.locator('button:has-text("Merge")');
    await mergeButton.click();

    // Wait for merging state
    await this.page.waitForSelector('text=Merging PDFs...', {
      state: 'visible',
      timeout: 5000
    });
  }

  /**
   * Wait for merge to complete and UI to reset
   */
  async waitForMergeComplete() {
    // Wait for progress to reach 100%
    await this.page.waitForSelector('text=100%', { timeout: 30000 });

    // Wait for UI reset (files clear)
    await this.page.waitForSelector('text=No PDFs uploaded yet', {
      timeout: 5000
    });
  }

  /**
   * Get merge progress percentage
   */
  async getMergeProgress(): Promise<number> {
    const progressText = await this.page
      .locator('text=/\\d+%/')
      .textContent();
    const match = progressText?.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Remove PDF by index (0-based)
   */
  async removePdf(index: number) {
    const cards = this.page.locator('[data-testid="pdf-card"]').or(
      this.page.locator('.group.relative.overflow-hidden')
    );
    const card = cards.nth(index);

    // Hover to reveal remove button
    await card.hover();

    // Click remove button
    const removeButton = card.locator('button:has-text("×")').or(
      card.locator('button[aria-label^="Remove"]')
    );
    await removeButton.click();

    await this.page.waitForTimeout(300); // Allow for removal animation
  }

  /**
   * Get count of uploaded PDFs
   */
  async getPdfCount(): Promise<number> {
    const cards = this.page.locator('[data-testid="pdf-card"]').or(
      this.page.locator('.group.relative.overflow-hidden')
    );
    return await cards.count();
  }

  /**
   * Drag PDF from one position to another (0-based indexes)
   */
  async dragPdfFromTo(fromIndex: number, toIndex: number) {
    const cards = this.page.locator('[data-testid="pdf-card"]').or(
      this.page.locator('.group.relative.overflow-hidden')
    );

    const sourceCard = cards.nth(fromIndex);
    const targetCard = cards.nth(toIndex);

    // Get bounding boxes
    const sourceBox = await sourceCard.boundingBox();
    const targetBox = await targetCard.boundingBox();

    if (!sourceBox || !targetBox) {
      throw new Error('Could not get bounding boxes for drag operation');
    }

    // Perform drag
    await this.page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2
    );
    await this.page.mouse.down();
    await this.page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 10 }
    );
    await this.page.mouse.up();

    await this.page.waitForTimeout(500); // Allow for reorder animation
  }

  /**
   * Check if merge button is enabled
   */
  async isMergeButtonEnabled(): Promise<boolean> {
    const mergeButton = this.page.locator('button:has-text("Merge")');
    return await mergeButton.isEnabled();
  }

  /**
   * Get merge button text
   */
  async getMergeButtonText(): Promise<string> {
    const mergeButton = this.page.locator('button:has-text("Merge")');
    return (await mergeButton.textContent())?.trim() || '';
  }

  /**
   * Check if PDF card has preview image loaded
   */
  async hasPreviews(): Promise<boolean> {
    const previews = this.page.locator('img[alt^="Preview of"]');
    const count = await previews.count();
    return count > 0;
  }

  /**
   * Get page count for a specific PDF card by index
   */
  async getPageCountForPdf(index: number): Promise<string> {
    const cards = this.page.locator('[data-testid="pdf-card"]').or(
      this.page.locator('.group.relative.overflow-hidden')
    );
    const card = cards.nth(index);
    const pageText = await card.locator('text=/\\d+ pages?/').textContent();
    return pageText?.trim() || '';
  }
}

/**
 * Setup download listener and return download promise
 */
export async function setupDownloadListener(page: Page) {
  const downloadPromise = page.waitForEvent('download');
  return downloadPromise;
}

/**
 * Verify downloaded file name matches expected pattern
 */
export function verifyDownloadFilename(filename: string): boolean {
  // Expected format: merged-YYYY-MM-DD.pdf
  const pattern = /^merged-\d{4}-\d{2}-\d{2}\.pdf$/;
  return pattern.test(filename);
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

---

## Example Test: Complete Happy Path

**File**: `tests/e2e/unite-pdf-happy-path.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { PdfHelpers, setupDownloadListener, verifyDownloadFilename } from '../helpers/pdf-helpers';

test.describe('UnitePDF - Complete Happy Path', () => {
  let helpers: PdfHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new PdfHelpers(page);
    await page.goto('/');
  });

  test('should complete full user journey from upload to download', async ({ page }) => {
    // Step 1: Verify initial state
    await expect(page.locator('text=Upload PDF Files')).toBeVisible();
    await expect(page.locator('button:has-text("Merge 0 PDFs")')).toBeDisabled();
    await expect(page.locator('text=No PDFs uploaded yet')).toBeVisible();

    // Step 2: Upload 3 PDFs
    await helpers.uploadFiles('3-pages.pdf', '5-pages.pdf', '2-pages.pdf');

    // Step 3: Wait for previews to load
    await helpers.waitForPreviewsLoaded();

    // Step 4: Verify PDF cards appear
    expect(await helpers.getPdfCount()).toBe(3);
    expect(await helpers.hasPreviews()).toBe(true);

    // Step 5: Verify metadata
    expect(await helpers.getPageCountForPdf(0)).toBe('3 pages');
    expect(await helpers.getPageCountForPdf(1)).toBe('5 pages');
    expect(await helpers.getPageCountForPdf(2)).toBe('2 pages');

    // Step 6: Verify initial summary (no duplex)
    const initialSummary = await helpers.getSummary();
    expect(initialSummary.totalPdfs).toBe('3');
    expect(initialSummary.totalPages).toBe('10'); // 3 + 5 + 2
    expect(initialSummary.duplexMode).toContain('Disabled');

    // Step 7: Reorder PDFs (drag 3rd to 1st)
    await helpers.dragPdfFromTo(2, 0);

    // Step 8: Verify new order
    const order = await helpers.getPdfOrder();
    expect(order[0]).toContain('2-pages.pdf');
    expect(order[1]).toContain('3-pages.pdf');
    expect(order[2]).toContain('5-pages.pdf');

    // Step 9: Enable duplex mode
    await helpers.toggleDuplex();
    expect(await helpers.isDuplexEnabled()).toBe(true);

    // Step 10: Verify page count adjustment with duplex
    const duplexSummary = await helpers.getSummary();
    expect(duplexSummary.totalPages).toBe('12'); // 2 + 3+1 + 5+1
    expect(duplexSummary.duplexMode).toContain('Enabled');

    // Step 11: Setup download listener
    const downloadPromise = setupDownloadListener(page);

    // Step 12: Click merge
    await helpers.clickMerge();

    // Step 13: Verify merging state
    await expect(page.locator('text=Merging PDFs...')).toBeVisible();
    await expect(page.locator('text=Processing...')).toBeVisible();

    // Step 14: Wait for download
    const download = await downloadPromise;
    expect(verifyDownloadFilename(download.suggestedFilename())).toBe(true);

    // Step 15: Wait for UI reset
    await helpers.waitForMergeComplete();

    // Step 16: Verify post-merge state
    await expect(page.locator('text=No PDFs uploaded yet')).toBeVisible();
    await expect(page.locator('button:has-text("Merge 0 PDFs")')).toBeDisabled();
    expect(await helpers.getPdfCount()).toBe(0);
  });
});
```

---

## Example Test: Duplex Calculations

**File**: `tests/e2e/duplex-mode.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { PdfHelpers } from '../helpers/pdf-helpers';

test.describe('Duplex Mode Calculations', () => {
  let helpers: PdfHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new PdfHelpers(page);
    await page.goto('/');
  });

  test('should calculate correctly with all odd pages', async () => {
    // Upload: 1-page.pdf, 3-pages.pdf, 5-pages.pdf
    await helpers.uploadFiles('1-page.pdf', '3-pages.pdf', '5-pages.pdf');
    await helpers.waitForPreviewsLoaded();

    // Without duplex: 1 + 3 + 5 = 9
    let summary = await helpers.getSummary();
    expect(summary.totalPages).toBe('9');

    // Enable duplex: 1+1 + 3+1 + 5 = 11
    await helpers.toggleDuplex();
    summary = await helpers.getSummary();
    expect(summary.totalPages).toBe('11');
  });

  test('should calculate correctly with all even pages', async () => {
    // Upload: 2-pages.pdf, 10-pages.pdf
    await helpers.uploadFiles('2-pages.pdf', '10-pages.pdf');
    await helpers.waitForPreviewsLoaded();

    // Without duplex: 2 + 10 = 12
    let summary = await helpers.getSummary();
    expect(summary.totalPages).toBe('12');

    // Enable duplex: 2 + 10 = 12 (no change)
    await helpers.toggleDuplex();
    summary = await helpers.getSummary();
    expect(summary.totalPages).toBe('12');
  });

  test('should calculate correctly with mixed pages', async () => {
    // Upload: 2-pages.pdf, 3-pages.pdf, 10-pages.pdf
    await helpers.uploadFiles('2-pages.pdf', '3-pages.pdf', '10-pages.pdf');
    await helpers.waitForPreviewsLoaded();

    // Without duplex: 2 + 3 + 10 = 15
    let summary = await helpers.getSummary();
    expect(summary.totalPages).toBe('15');

    // Enable duplex: 2 + 3+1 + 10 = 16
    await helpers.toggleDuplex();
    summary = await helpers.getSummary();
    expect(summary.totalPages).toBe('16');
  });

  test('should not add blank page to single odd PDF', async () => {
    // Upload: only 5-pages.pdf (is last, no blank)
    await helpers.uploadFiles('5-pages.pdf');
    await helpers.waitForPreviewsLoaded();

    // Without duplex: 5
    let summary = await helpers.getSummary();
    expect(summary.totalPages).toBe('5');

    // Enable duplex: still 5 (last PDF, no blank)
    await helpers.toggleDuplex();
    summary = await helpers.getSummary();
    expect(summary.totalPages).toBe('5');
  });

  test('should toggle on and off correctly', async () => {
    await helpers.uploadFiles('3-pages.pdf', '2-pages.pdf');
    await helpers.waitForPreviewsLoaded();

    // Initial: 5 pages
    let summary = await helpers.getSummary();
    expect(summary.totalPages).toBe('5');

    // Toggle ON: 6 pages (3+1 + 2)
    await helpers.toggleDuplex();
    summary = await helpers.getSummary();
    expect(summary.totalPages).toBe('6');

    // Toggle OFF: back to 5
    await helpers.toggleDuplex();
    summary = await helpers.getSummary();
    expect(summary.totalPages).toBe('5');
  });
});
```

---

## Example Test: Upload Functionality

**File**: `tests/e2e/upload-functionality.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { PdfHelpers } from '../helpers/pdf-helpers';

test.describe('Upload Functionality', () => {
  let helpers: PdfHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new PdfHelpers(page);
    await page.goto('/');
  });

  test('should upload single PDF', async ({ page }) => {
    await helpers.uploadFiles('1-page.pdf');
    await helpers.waitForPreviewsLoaded();

    expect(await helpers.getPdfCount()).toBe(1);
    await expect(page.locator('text=1 file ready to merge')).toBeVisible();
    expect(await helpers.getPageCountForPdf(0)).toBe('1 page'); // Singular
  });

  test('should upload multiple PDFs at once', async ({ page }) => {
    await helpers.uploadFiles('1-page.pdf', '2-pages.pdf', '3-pages.pdf');
    await helpers.waitForPreviewsLoaded();

    expect(await helpers.getPdfCount()).toBe(3);
    await expect(page.locator('text=3 files ready to merge')).toBeVisible();

    const summary = await helpers.getSummary();
    expect(summary.totalPages).toBe('6'); // 1 + 2 + 3
  });

  test('should add more PDFs to existing collection', async ({ page }) => {
    // Upload first PDF
    await helpers.uploadFiles('1-page.pdf');
    await helpers.waitForPreviewsLoaded();
    expect(await helpers.getPdfCount()).toBe(1);

    // Click "Add more PDFs"
    await page.locator('text=+ Add more PDFs').click();

    // Upload second PDF
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(
      '/Users/yasithranusha/Developer/proj-pdf/tests/fixtures/2-pages.pdf'
    );

    await helpers.waitForPreviewsLoaded();

    // Verify
    expect(await helpers.getPdfCount()).toBe(2);
    await expect(page.locator('text=2 files ready to merge')).toBeVisible();

    const summary = await helpers.getSummary();
    expect(summary.totalPages).toBe('3'); // 1 + 2
  });
});
```

---

## Running the Tests

### Run all tests
```bash
pnpm exec playwright test
```

### Run specific test file
```bash
pnpm exec playwright test unite-pdf-happy-path.spec.ts
```

### Run in headed mode (see browser)
```bash
pnpm exec playwright test --headed
```

### Run in UI mode (interactive)
```bash
pnpm exec playwright test --ui
```

### Run specific browser
```bash
pnpm exec playwright test --project=chromium
```

### Debug mode
```bash
pnpm exec playwright test --debug
```

### Generate report
```bash
pnpm exec playwright show-report
```

---

## Best Practices

### 1. Use Proper Waits
```typescript
// ❌ Bad: Fixed timeout
await page.waitForTimeout(5000);

// ✅ Good: Wait for specific condition
await page.waitForSelector('text=Uploaded PDFs', { state: 'visible' });
```

### 2. Use Helper Functions
```typescript
// ❌ Bad: Repeat logic
const fileInput = page.locator('input[type="file"]');
await fileInput.setInputFiles(['file1.pdf', 'file2.pdf']);
await page.waitForSelector('text=Uploaded PDFs');

// ✅ Good: Use helper
await helpers.uploadFiles('file1.pdf', 'file2.pdf');
```

### 3. Clear Test Descriptions
```typescript
// ❌ Bad: Vague description
test('test duplex', async () => { ... });

// ✅ Good: Descriptive
test('should calculate total pages correctly with all odd pages when duplex enabled', async () => { ... });
```

### 4. Independent Tests
```typescript
// ❌ Bad: Tests depend on each other
test('upload PDF', async () => { /* uploads */ });
test('merge PDF', async () => { /* assumes PDF uploaded */ });

// ✅ Good: Each test is independent
test('should upload and merge PDF', async () => {
  await helpers.uploadFiles('1-page.pdf');
  await helpers.clickMerge();
});
```

### 5. Proper Assertions
```typescript
// ❌ Bad: Generic assertion
expect(await page.locator('span').textContent()).toBe('3');

// ✅ Good: Specific assertion
const summary = await helpers.getSummary();
expect(summary.totalPdfs).toBe('3');
```

---

## Debugging Tips

### 1. Use page.pause()
```typescript
test('debug test', async ({ page }) => {
  await helpers.uploadFiles('1-page.pdf');
  await page.pause(); // Opens Playwright Inspector
  await helpers.clickMerge();
});
```

### 2. Take Screenshots
```typescript
await page.screenshot({ path: 'debug.png', fullPage: true });
```

### 3. Check Console Logs
```typescript
page.on('console', msg => console.log('BROWSER:', msg.text()));
```

### 4. Use Trace Viewer
```bash
pnpm exec playwright test --trace on
pnpm exec playwright show-trace trace.zip
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: pnpm install
      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps
      - name: Run Playwright tests
        run: pnpm exec playwright test
      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Next Steps

1. **Create helper file**: Implement `tests/helpers/pdf-helpers.ts`
2. **Start with happy path**: Implement `unite-pdf-happy-path.spec.ts`
3. **Add duplex tests**: Implement `duplex-mode.spec.ts`
4. **Expand coverage**: Add remaining test files
5. **Run and debug**: Fix any failures
6. **Add to CI**: Integrate with GitHub Actions

---

## Reference: Key Selectors

Based on the application code review:

```typescript
// Upload
'input[type="file"]'
'button:has-text("Upload PDF Files")'
'text=+ Add more PDFs'

// File Grid
'text=Uploaded PDFs'
'text=/\\d+ files? ready to merge/'
'img[alt^="Preview of"]'
'text=/\\d+ pages?/'

// Duplex
'#duplex-toggle'
'text=Duplex Printing'
'[data-testid="tooltip-trigger"]'

// Merge
'button:has-text("Merge")'
'text=Merging PDFs...'
'text=Processing...'
'text=/\\d+%/'

// Summary
'text=Summary'
'text=Total PDFs:'
'text=Total pages:'
'text=Total size:'
'text=Duplex mode:'
'text=Merged PDF size:'

// States
'text=No PDFs uploaded yet'
'text=Loading preview...'
```

---

## Troubleshooting

### Issue: Tests fail due to timing
**Solution**: Increase timeouts or add better wait conditions

### Issue: Drag-and-drop not working
**Solution**: Use lower-level mouse operations as shown in helpers

### Issue: Download not captured
**Solution**: Ensure download listener is setup before clicking merge

### Issue: Previews not loading
**Solution**: Check that PDF files exist in fixtures directory

### Issue: Flaky tests
**Solution**: Add proper waits, avoid fixed timeouts, ensure test isolation
