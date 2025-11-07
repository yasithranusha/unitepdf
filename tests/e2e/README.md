# UnitePDF E2E Test Suite

Comprehensive end-to-end test plan for the UnitePDF application using Playwright.

## Documentation Overview

This directory contains comprehensive test planning and implementation guides:

### 📋 [TESTPLAN.md](./TESTPLAN.md)

**Comprehensive Test Plan** - Detailed test cases covering all aspects of the application:

- 13 test suites with 50+ test cases
- Complete user flows and edge cases
- Expected results and assertions
- Test data requirements
- Manual and automated test scenarios

### 🎯 [TEST_SCENARIOS.md](./TEST_SCENARIOS.md)

**Quick Reference Guide** - Condensed test scenarios for rapid implementation:

- Critical test scenarios (P0)
- Key test flows with step-by-step instructions
- Common assertions and locators
- Playwright helper function examples
- Execution strategy and priorities

### 🛠️ [PLAYWRIGHT_IMPLEMENTATION_GUIDE.md](./PLAYWRIGHT_IMPLEMENTATION_GUIDE.md)

**Implementation Guide** - Practical guide for writing Playwright tests:

- Complete helper function library
- Example test implementations
- Best practices and patterns
- Debugging tips
- CI/CD integration examples

---

## Quick Start

### 1. Review Test Plan

Start with `TESTPLAN.md` to understand all test requirements.

### 2. Implement Critical Tests

Use `TEST_SCENARIOS.md` and `PLAYWRIGHT_IMPLEMENTATION_GUIDE.md` to implement:

- ✅ Complete happy path E2E test
- ✅ Duplex mode calculations
- ✅ Upload functionality
- ✅ Merge and download process

### 3. Run Tests

```bash
# Install dependencies (if not already done)
pnpm install

# Install Playwright browsers
pnpm exec playwright install

# Run all tests
pnpm exec playwright test

# Run in UI mode
pnpm exec playwright test --ui

# Run specific test
pnpm exec playwright test unite-pdf-happy-path.spec.ts
```

---

## Test Coverage

### Core User Flows (P0 - Critical)

- ✅ **Complete Happy Path**: Upload → Reorder → Duplex → Merge → Download
- ✅ **Duplex Calculations**: All variations (odd/even/mixed pages)
- ✅ **Upload**: Single, multiple, add more
- ✅ **Merge Process**: Progress tracking and download
- ✅ **Summary Display**: Accurate calculations

### Additional Features (P1 - High)

- ✅ **Drag-and-Drop**: Reordering PDFs
- ✅ **File Removal**: Remove individual PDFs
- ✅ **Preview Generation**: PDF thumbnails
- ✅ **Metadata Display**: File names, sizes, page counts

### Edge Cases (P2 - Medium)

- ✅ Same PDF uploaded multiple times
- ✅ Single PDF merge
- ✅ Rapid duplex toggle
- ✅ Large number of PDFs
- ✅ Error handling

---

## Test Data

Location: `tests/fixtures/`

Available test PDFs:
| File | Pages | Parity | Size | Description |
|------|-------|--------|------|-------------|
| 1-page.pdf | 1 | Odd | ~5 KB | Single page PDF |
| 2-pages.pdf | 2 | Even | ~8 KB | Even pages |
| 3-pages.pdf | 3 | Odd | ~11 KB | Odd pages |
| 5-pages.pdf | 5 | Odd | ~17 KB | Medium size |
| 10-pages.pdf | 10 | Even | ~30 KB | Large PDF |

All test PDFs have:

- Visible page numbers on each page
- Page parity labels (ODD/EVEN)
- File name and page count in header

---

## Key Test Scenarios

### 1. Complete Happy Path

```
1. Upload 3 PDFs (3-pages, 5-pages, 2-pages)
2. Verify previews and metadata
3. Reorder PDFs via drag-and-drop
4. Enable duplex mode
5. Verify page count adjustment (10 → 12 pages)
6. Merge PDFs
7. Verify download (merged-YYYY-MM-DD.pdf)
8. Verify UI reset
```

### 2. Duplex Calculations

```
Test Matrix:
- All odd pages: [1, 3, 5] → 11 pages with duplex (1+1 + 3+1 + 5)
- All even pages: [2, 10] → 12 pages with duplex (no change)
- Mixed pages: [2, 3, 10] → 16 pages with duplex (2 + 3+1 + 10)
- Single odd: [5] → 5 pages (no blank added, is last)
```

### 3. Upload Variations

```
- Single PDF upload
- Multiple PDFs at once
- Add more PDFs to existing collection
- Drag-and-drop upload
```

### 4. Summary Accuracy

```
Verify calculations:
- Total PDFs count
- Total pages (with/without duplex)
- Total file size
- Duplex mode status
- Merged PDF size (after merge)
```

---

## Implementation Steps

### Phase 1: Setup (15 minutes)

1. Create `tests/helpers/pdf-helpers.ts`
2. Copy helper functions from `PLAYWRIGHT_IMPLEMENTATION_GUIDE.md`
3. Verify Playwright configuration

### Phase 2: Critical Tests (2-3 hours)

1. Implement `unite-pdf-happy-path.spec.ts`
2. Implement `duplex-mode.spec.ts`
3. Implement `upload-functionality.spec.ts`
4. Implement `merge-process.spec.ts`
5. Run tests and fix any failures

### Phase 3: Additional Tests (2-3 hours)

1. Implement `reordering.spec.ts`
2. Implement `summary.spec.ts`
3. Implement `file-removal.spec.ts`
4. Run full test suite

### Phase 4: Edge Cases (1-2 hours)

1. Implement `edge-cases.spec.ts`
2. Add responsive design tests
3. Add accessibility tests
4. Run cross-browser tests

---

## Expected Results

### All Tests Pass ✅

- Chromium: All tests passing
- Firefox: All tests passing
- WebKit: All tests passing

### Performance Metrics

- Preview generation: < 2 seconds per PDF
- Merge process: Based on file size
- Test execution: < 5 minutes total

### Coverage

- 50+ test cases implemented
- All critical user flows covered
- Edge cases handled
- Cross-browser compatibility verified

---

## Running Tests in Different Modes

### Development Mode (Fast Feedback)

```bash
# Run tests in headed mode (see browser)
pnpm exec playwright test --headed

# Run in UI mode (interactive)
pnpm exec playwright test --ui

# Run specific test
pnpm exec playwright test -g "happy path"
```

### CI/CD Mode (Full Coverage)

```bash
# Run all tests in all browsers
pnpm exec playwright test

# Run with retries
pnpm exec playwright test --retries=2

# Generate HTML report
pnpm exec playwright test --reporter=html
```

### Debug Mode

```bash
# Debug specific test
pnpm exec playwright test --debug unite-pdf-happy-path.spec.ts

# With trace
pnpm exec playwright test --trace on
```

---

## Key Assertions

### Upload Phase

```typescript
expect(await helpers.getPdfCount()).toBe(3);
expect(await helpers.hasPreviews()).toBe(true);
expect(await helpers.getPageCountForPdf(0)).toBe("3 pages");
```

### Duplex Phase

```typescript
const summary = await helpers.getSummary();
expect(summary.totalPages).toBe("12");
expect(summary.duplexMode).toContain("Enabled");
```

### Merge Phase

```typescript
await expect(page.locator("text=Merging PDFs...")).toBeVisible();
const download = await downloadPromise;
expect(verifyDownloadFilename(download.suggestedFilename())).toBe(true);
```

---

## Troubleshooting

### Tests Timing Out

- Increase timeout in playwright.config.ts
- Add better wait conditions
- Check if dev server is running

### Previews Not Loading

- Verify test PDFs exist in fixtures directory
- Check browser console for errors
- Ensure sufficient timeout for preview generation

### Download Not Working

- Ensure download listener is setup before clicking merge
- Check browser permissions
- Verify download path is writable

### Flaky Tests

- Add proper waits (avoid fixed timeouts)
- Ensure test isolation (each test independent)
- Check for race conditions

---

## CI/CD Integration

### GitHub Actions

Add `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm exec playwright install --with-deps
      - run: pnpm exec playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Useful Commands

```bash
# Install Playwright
pnpm add -D @playwright/test

# Install browsers
pnpm exec playwright install

# Run all tests
pnpm exec playwright test

# Run specific file
pnpm exec playwright test unite-pdf-happy-path.spec.ts

# Run specific test
pnpm exec playwright test -g "should complete full user journey"

# Run in headed mode
pnpm exec playwright test --headed

# Run in UI mode
pnpm exec playwright test --ui

# Run in debug mode
pnpm exec playwright test --debug

# Run specific browser
pnpm exec playwright test --project=chromium

# Update snapshots
pnpm exec playwright test --update-snapshots

# Show report
pnpm exec playwright show-report

# Show trace
pnpm exec playwright show-trace trace.zip
```

---

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright Test Runner](https://playwright.dev/docs/test-runners)

---

## Next Steps

1. ✅ Review test plan documentation
2. ⬜ Create helper functions (`tests/helpers/pdf-helpers.ts`)
3. ⬜ Implement critical tests (happy path, duplex, upload, merge)
4. ⬜ Run tests and fix failures
5. ⬜ Add additional tests (reordering, summary, removal)
6. ⬜ Add edge case tests
7. ⬜ Setup CI/CD integration
8. ⬜ Generate and review test reports

---

## Contact & Support

For questions or issues with test implementation:

1. Review the comprehensive guides in this directory
2. Check Playwright documentation
3. Review application source code in `src/`

---

**Last Updated**: 2025-11-07
**Status**: Test plan complete, ready for implementation
**Coverage**: 50+ test cases across 13 test suites
**Priority**: P0 (Critical path), P1 (Core features), P2 (Edge cases)
