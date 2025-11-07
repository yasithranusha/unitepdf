# UnitePDF E2E Test Scenarios - Quick Reference

## Application Under Test

- **URL**: http://localhost:5173/
- **Name**: UnitePDF
- **Purpose**: Merge PDFs with optional duplex mode for double-sided printing

## Test Data Location

```
tests/fixtures/
├── 1-page.pdf   (1 page, odd, ~5 KB)
├── 2-pages.pdf  (2 pages, even, ~8 KB)
├── 3-pages.pdf  (3 pages, odd, ~11 KB)
├── 5-pages.pdf  (5 pages, odd, ~17 KB)
└── 10-pages.pdf (10 pages, even, ~30 KB)
```

---

## Critical Test Scenarios (Must Implement)

### 1. Complete Happy Path (E2E)

**File**: `unite-pdf-happy-path.spec.ts`

```
1. Navigate to http://localhost:5173/
2. Upload 3 PDFs: 3-pages.pdf, 5-pages.pdf, 2-pages.pdf
3. Verify previews load with correct metadata:
   - File names, sizes, page counts
   - Position badges (#1, #2, #3)
4. Verify initial summary (no duplex):
   - Total PDFs: 3
   - Total pages: 10
   - Duplex mode: ✗ Disabled
5. Drag 3rd PDF to 1st position (reorder)
6. Verify new order: 2-pages.pdf, 3-pages.pdf, 5-pages.pdf
7. Enable duplex mode toggle
8. Verify summary updates:
   - Total pages: 12 (2 + 3+1 + 5+1)
   - Duplex mode: ✓ Enabled
9. Click "Merge 3 PDFs"
10. Verify progress: 0% → 20% → 50% → 80% → 100%
11. Verify download triggered: merged-YYYY-MM-DD.pdf
12. Verify UI resets after merge
```

**Expected Duration**: ~30-60 seconds
**Priority**: P0 - Critical

---

### 2. Upload Scenarios

**File**: `upload-functionality.spec.ts`

#### 2.1 Upload Single PDF

```
1. Navigate to app
2. Click "Upload PDF Files"
3. Select 1-page.pdf
4. Verify: 1 card, preview, "1 file ready to merge"
```

#### 2.2 Upload Multiple PDFs at Once

```
1. Click upload
2. Multi-select: 1-page.pdf, 2-pages.pdf, 3-pages.pdf
3. Verify: 3 cards, all previews, "3 files ready to merge"
```

#### 2.3 Add More PDFs

```
1. Upload 1-page.pdf
2. Click "+ Add more PDFs"
3. Upload 2-pages.pdf
4. Verify: 2 cards, summary shows 2 files, 3 pages total
```

**Priority**: P0 - Critical

---

### 3. Duplex Mode Calculations

**File**: `duplex-mode.spec.ts`

#### 3.1 All Odd Pages

```
Upload: 1-page.pdf, 3-pages.pdf, 5-pages.pdf
Enable duplex
Expected: 11 pages (1+1 + 3+1 + 5)
```

#### 3.2 All Even Pages

```
Upload: 2-pages.pdf, 10-pages.pdf
Enable duplex
Expected: 12 pages (no change)
```

#### 3.3 Mixed Pages

```
Upload: 2-pages.pdf, 3-pages.pdf, 10-pages.pdf
Enable duplex
Expected: 16 pages (2 + 3+1 + 10)
```

#### 3.4 Single Odd PDF

```
Upload: 5-pages.pdf (only one)
Enable duplex
Expected: 5 pages (no blank, it's the last)
```

#### 3.5 Toggle On/Off

```
Upload: 3-pages.pdf, 2-pages.pdf
Initial: 5 pages
Enable duplex: 6 pages (3+1 + 2)
Disable duplex: 5 pages
```

**Priority**: P0 - Critical

---

### 4. Drag-and-Drop Reordering

**File**: `reordering.spec.ts`

#### 4.1 Move First to Last

```
Initial: [1-page.pdf, 2-pages.pdf, 3-pages.pdf]
Drag #1 to #3
Result: [2-pages.pdf, 3-pages.pdf, 1-page.pdf]
Verify: Position badges update
```

#### 4.2 Move Last to First

```
Initial: [1-page.pdf, 2-pages.pdf, 3-pages.pdf]
Drag #3 to #1
Result: [3-pages.pdf, 1-page.pdf, 2-pages.pdf]
```

#### 4.3 Visual Feedback

```
1. Hover over PDF card
   - Verify: Grip icon appears
2. Start dragging
   - Verify: Opacity 50%, scale 95%
3. Drag over target
   - Verify: Target has ring border, scale 105%
4. Release
   - Verify: Effects reset, new order
```

**Priority**: P1 - High

---

### 5. Summary Display

**File**: `summary.spec.ts`

```
1. No PDFs: Summary hidden
2. Upload 1 PDF: Summary appears
3. Verify displays:
   - Total PDFs count
   - Total pages (updates with duplex)
   - Total size (cumulative)
   - Duplex mode status (✓ Enabled / ✗ Disabled)
4. Upload more: All values update
5. Remove PDF: All values recalculate
```

**Priority**: P1 - High

---

### 6. Merge Process

**File**: `merge-process.spec.ts`

#### 6.1 Merge Button States

```
No PDFs: "Merge 0 PDFs" (disabled)
1 PDF: "Merge 1 PDF" (enabled)
3 PDFs: "Merge 3 PDFs" (enabled)
During merge: "Merging PDFs..." (disabled, with spinner)
```

#### 6.2 Progress Indicator

```
1. Click merge
2. Verify:
   - Button disabled
   - Progress bar appears
   - Progress updates: 20% → 50% → 80% → 100%
   - "Processing..." text shown
```

#### 6.3 Download Verification

```
1. Setup download listener
2. Click merge
3. Wait for completion
4. Verify:
   - Download event fired
   - Filename: merged-YYYY-MM-DD.pdf (today's date)
   - File exists
```

#### 6.4 Post-Merge Reset

```
After merge completes:
1. Wait ~1 second
2. Verify:
   - File grid cleared
   - Upload area returns
   - Summary hidden
   - Button disabled
```

**Priority**: P0 - Critical

---

### 7. File Removal

**File**: `file-removal.spec.ts`

```
1. Upload 3 PDFs
2. Hover over 2nd PDF
3. Verify: X button appears (top-right)
4. Click X
5. Verify:
   - PDF removed
   - Remaining: 2 PDFs
   - Position badges update
   - Summary recalculates
6. Remove all PDFs one by one
7. Final state: "No PDFs uploaded yet", summary hidden
```

**Priority**: P1 - High

---

### 8. Edge Cases

**File**: `edge-cases.spec.ts`

#### 8.1 Same PDF Multiple Times

```
Upload 1-page.pdf twice
Verify: 2 separate cards, both named "1-page.pdf"
```

#### 8.2 Single PDF Merge

```
Upload only 5-pages.pdf
Click "Merge 1 PDF"
Verify: Merge works, download succeeds
```

#### 8.3 Rapid Duplex Toggle

```
Upload 3 PDFs
Toggle duplex ON/OFF rapidly 5 times
Verify: Page count always correct
```

#### 8.4 Remove During Preview Load

```
Upload large PDF
Immediately click remove (before preview loads)
Verify: No errors, clean removal
```

**Priority**: P2 - Medium

---

## Test Execution Strategy

### Phase 1: Critical Path (Day 1)

- Complete happy path E2E
- Duplex calculations (all scenarios)
- Merge process with download
- Basic upload functionality

### Phase 2: Core Features (Day 2)

- Drag-and-drop reordering
- Summary display accuracy
- File removal
- Upload variations

### Phase 3: Edge Cases (Day 3)

- Error scenarios
- Edge cases
- Responsive design
- Accessibility basics

---

## Key Assertions to Include

### Upload Phase

- ✓ File count matches uploaded count
- ✓ Preview images load (no broken images)
- ✓ File names display correctly
- ✓ Page counts accurate
- ✓ File sizes formatted properly
- ✓ Position badges sequential

### Reorder Phase

- ✓ Drag events work smoothly
- ✓ Visual feedback during drag
- ✓ Final order matches expectation
- ✓ Position badges update
- ✓ Summary remains accurate

### Duplex Phase

- ✓ Toggle state changes
- ✓ Page count recalculates correctly
- ✓ Status text updates (✓/✗)
- ✓ Tooltip content accurate
- ✓ Multiple toggles don't break calculation

### Merge Phase

- ✓ Button states transition correctly
- ✓ Progress updates sequentially
- ✓ Download event fires
- ✓ Filename format correct
- ✓ UI resets after completion
- ✓ No console errors

---

## Playwright-Specific Helpers

### Upload Files Helper

```typescript
async function uploadPDFs(page, ...filenames: string[]) {
  const fixturePath = "tests/fixtures";
  const filePaths = filenames.map((f) => `${fixturePath}/${f}`);

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePaths);

  // Wait for previews to load
  await page.waitForSelector('[data-testid="pdf-card"]', {
    state: "visible",
    timeout: 5000,
  });
}
```

### Wait for Preview Load

```typescript
async function waitForPreviewsLoaded(page) {
  // Wait for loading spinners to disappear
  await page.waitForSelector("text=Loading preview...", {
    state: "hidden",
    timeout: 10000,
  });
}
```

### Get Summary Values

```typescript
async function getSummaryValues(page) {
  return {
    totalPdfs: await page
      .locator("text=Total PDFs:")
      .locator("..")
      .locator("span")
      .last()
      .textContent(),
    totalPages: await page
      .locator("text=Total pages:")
      .locator("..")
      .locator("span")
      .last()
      .textContent(),
    duplexMode: await page
      .locator("text=Duplex mode:")
      .locator("..")
      .locator("span")
      .last()
      .textContent(),
  };
}
```

### Drag and Drop Helper

```typescript
async function dragPdfFromTo(page, fromIndex: number, toIndex: number) {
  const cards = page.locator('[data-testid="pdf-card"]');
  const sourceCard = cards.nth(fromIndex);
  const targetCard = cards.nth(toIndex);

  await sourceCard.dragTo(targetCard);
  await page.waitForTimeout(300); // Allow animation
}
```

### Wait for Merge Completion

```typescript
async function waitForMergeComplete(page) {
  // Wait for progress to reach 100%
  await page.waitForSelector("text=100%", { timeout: 30000 });

  // Wait for UI reset (files clear)
  await page.waitForSelector("text=No PDFs uploaded yet", {
    timeout: 5000,
  });
}
```

---

## Common Locators

```typescript
// Upload
const uploadButton = page.locator('button:has-text("Upload PDF Files")');
const addMoreButton = page.locator("text=+ Add more PDFs");
const fileInput = page.locator('input[type="file"]');

// File Grid
const pdfCards = page.locator('[data-testid="pdf-card"]'); // Or use actual selector
const removeButtons = page.locator('button[aria-label^="Remove"]');
const positionBadges = page.locator("text=/^#\\d+$/");

// Duplex Toggle
const duplexSwitch = page.locator("#duplex-toggle");
const duplexLabel = page.locator("text=Duplex Printing");
const infoTooltip = page.locator('[data-testid="tooltip-trigger"]');

// Merge Button
const mergeButton = page.locator('button:has-text("Merge")');
const progressBar = page.locator('[role="progressbar"]');
const progressText = page.locator("text=/\\d+%/");

// Summary
const summarySection = page.locator("text=Summary").locator("..");
const totalPdfsText = page.locator("text=Total PDFs:");
const totalPagesText = page.locator("text=Total pages:");
const totalSizeText = page.locator("text=Total size:");
const duplexModeText = page.locator("text=Duplex mode:");
```

---

## Success Criteria

✅ **All critical paths pass** (P0 scenarios)
✅ **Duplex calculations are accurate** (all test cases)
✅ **Merge and download work reliably**
✅ **No console errors during normal operation**
✅ **UI state transitions are smooth**
✅ **All assertions pass consistently**
✅ **Tests run in < 5 minutes total**
✅ **Cross-browser compatibility** (Chromium, Firefox, WebKit)

---

## Next Steps

1. **Setup Playwright Test Files**:

   - Create test files for each scenario
   - Implement helper functions
   - Setup fixtures and test data

2. **Implement Critical Tests First**:

   - Happy path E2E
   - Duplex calculations
   - Merge process

3. **Run and Debug**:

   - Execute tests in headed mode
   - Fix any flaky tests
   - Add proper waits and timeouts

4. **Expand Coverage**:

   - Add P1 tests
   - Add P2 tests
   - Visual regression tests

5. **CI Integration**:
   - Setup GitHub Actions workflow
   - Run tests on PR
   - Generate test reports
