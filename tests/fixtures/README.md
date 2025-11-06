# Test PDF Fixtures

This directory contains sample PDF files used for testing the PDF merger functionality.

## Test Files

| File | Pages | Page Count | Size | Purpose |
|------|-------|------------|------|---------|
| `1-page.pdf` | 1 | Odd | ~1 KB | Test minimum case with single page (odd) |
| `2-pages.pdf` | 2 | Even | ~1 KB | Test even page count |
| `3-pages.pdf` | 3 | Odd | ~2 KB | Test odd page count |
| `5-pages.pdf` | 5 | Odd | ~2 KB | Test larger odd page count |
| `10-pages.pdf` | 10 | Even | ~4 KB | Test larger even page count |

## PDF Content

Each PDF contains:
- **Large page number** (120pt) in the center of each page for easy visual identification
- **Header text** showing the filename and current page/total pages
- **Footer text** indicating whether the page is ODD or EVEN

This design makes it easy to:
1. Verify that PDFs are merged in the correct order
2. Confirm that all pages are included in the merge
3. Test the duplex printing feature (blank page insertion for odd-page PDFs)
4. Visually inspect the merged output

## Testing Duplex Feature

For duplex printing tests:
- **Odd-page PDFs** (`1-page.pdf`, `3-pages.pdf`, `5-pages.pdf`) should have a blank page added when duplex mode is enabled
- **Even-page PDFs** (`2-pages.pdf`, `10-pages.pdf`) should remain unchanged

### Example Test Scenarios

**Scenario 1: Merge 1-page + 2-pages with duplex**
- Expected output: 4 pages (1, blank, 1, 2)
- Each PDF starts on an odd page number

**Scenario 2: Merge 3-pages + 5-pages with duplex**
- Expected output: 10 pages (1, 2, 3, blank, 1, 2, 3, 4, 5, blank)
- Each PDF starts on an odd page number

**Scenario 3: Merge all PDFs (1+2+3+5+10) with duplex**
- Expected output: 23 pages total
- Blank pages inserted after 1-page, 3-pages, and 5-pages PDFs

## Regenerating Test PDFs

If you need to regenerate these test files:

```bash
node scripts/generate-test-pdfs.js
```

This will recreate all test PDFs with the same specifications.

## Notes for Contributors

- Do not modify these PDFs manually
- Keep total fixture size under 2 MB
- All PDFs use A4 size (595 x 842 points)
- PDFs are generated programmatically for consistency
- Page numbers are 1-indexed (first page = 1, not 0)
