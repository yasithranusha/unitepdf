# UnitePDF E2E Test Plan

## Overview

Comprehensive End-to-End test plan for the UnitePDF application covering the complete user flow from upload to download.

**Application URL**: http://localhost:5173/

**Test Data Location**: `tests/fixtures/`

Available test PDFs:

- `1-page.pdf` (odd pages)
- `2-pages.pdf` (even pages)
- `3-pages.pdf` (odd pages)
- `5-pages.pdf` (odd pages)
- `10-pages.pdf` (even pages)

---

## Test Suite 1: Complete Happy Path Flow

### Test Case 1.1: Full User Journey with Multiple PDFs

**Priority**: Critical
**Description**: Tests the complete end-to-end flow from upload to download with multiple PDFs

**Preconditions**:

- Application is running on http://localhost:5173/
- Test PDF files are available in the fixtures directory

**Test Steps**:

1. **Navigate to Application**

   - Action: Open http://localhost:5173/
   - Expected: Homepage loads with upload area visible
   - Expected: "Upload PDF Files" button is visible
   - Expected: "Merge 0 PDFs" button is disabled
   - Expected: No PDFs shown in the file grid

2. **Upload Multiple PDF Files (3 files)**

   - Action: Upload `3-pages.pdf`, `5-pages.pdf`, and `2-pages.pdf` (in this order)
   - Expected: Upload area changes to "Add more PDFs" button
   - Expected: 3 PDF cards appear in the file grid
   - Expected: Each card shows position badge (#1, #2, #3)
   - Expected: Preview images are displayed (or loading spinner while generating)
   - Expected: File names are displayed correctly
   - Expected: File sizes are shown (e.g., "XX.XX KB")
   - Expected: Page counts are visible:
     - 3-pages.pdf: "3 pages"
     - 5-pages.pdf: "5 pages"
     - 2-pages.pdf: "2 pages"

3. **Verify Previews and Metadata**

   - Action: Wait for all previews to load
   - Expected: Each PDF card shows a preview image of the first page
   - Expected: Loading spinners disappear
   - Expected: "Uploaded PDFs" heading shows "3 files ready to merge"
   - Expected: Badge shows count "3"

4. **Check Initial Summary (Without Duplex)**

   - Action: Scroll to summary section in right sidebar
   - Expected: "Summary" section is visible
   - Expected: "Total PDFs: 3" is displayed
   - Expected: "Total pages: 10" is displayed (3 + 5 + 2)
   - Expected: "Total size" shows cumulative file size
   - Expected: "Duplex mode: ✗ Disabled" is displayed
   - Expected: No "Merged PDF size" is shown yet

5. **Test Drag-and-Drop Reordering**

   - Action: Drag the third PDF (#3, 2-pages.pdf) to the first position
   - Expected: PDF cards reorder smoothly
   - Expected: Position badges update: 2-pages.pdf becomes #1
   - Expected: Other PDFs shift positions accordingly
   - Expected: Drag handle icon (grip vertical) appears on hover
   - Expected: Visual feedback during drag (opacity change, scale)

6. **Verify Reordered State**

   - Action: Check the new order
   - Expected: New order is: 2-pages.pdf (#1), 3-pages.pdf (#2), 5-pages.pdf (#3)
   - Expected: Summary still shows "Total pages: 10"
   - Expected: Summary still shows "Total PDFs: 3"

7. **Enable Duplex Mode**

   - Action: Toggle the "Duplex Printing" switch ON
   - Expected: Switch animates to enabled state
   - Expected: Info tooltip icon is visible next to "Duplex Printing" label
   - Expected: Description text: "Add blank pages for PDFs with odd page counts"

8. **Verify Page Count Adjustment with Duplex**

   - Action: Check the summary after enabling duplex
   - Expected: "Total pages: 12" is displayed (calculation: 2 + 3+1 + 5+1 = 12)
     - 2-pages.pdf: 2 pages (even, no blank page added, but it's not last)
     - 3-pages.pdf: 3 + 1 blank = 4 pages (odd, not last)
     - 5-pages.pdf: 5 pages (odd, but it's last, no blank page added)
   - Expected: "Duplex mode: ✓ Enabled" is displayed
   - Expected: "Total PDFs: 3" remains the same

9. **Hover Over Info Tooltip**

   - Action: Hover over the info icon next to "Duplex Printing"
   - Expected: Tooltip appears with explanation text
   - Expected: Text explains: "Adds a blank page after PDFs with odd page counts..."

10. **Initiate PDF Merge**

    - Action: Click "Merge 3 PDFs" button
    - Expected: Button becomes disabled
    - Expected: Button text changes to "Merging PDFs..."
    - Expected: Loading spinner appears in button
    - Expected: Progress bar appears below button showing "Processing..."
    - Expected: Progress updates from 0% → 20% → 50% → 80% → 100%

11. **Verify Download Triggered**

    - Action: Wait for merge completion
    - Expected: Browser download is triggered
    - Expected: Downloaded file name format: `merged-YYYY-MM-DD.pdf`
    - Expected: Progress reaches 100%
    - Expected: After 1 second delay, UI resets

12. **Verify Post-Merge State**
    - Action: Check application state after merge
    - Expected: File grid is cleared (no PDFs shown)
    - Expected: Upload area returns to initial state
    - Expected: "Upload PDF Files" is visible again
    - Expected: "Merge 0 PDFs" button is disabled again
    - Expected: Summary section is hidden

**Expected Result**: Complete user flow works seamlessly from upload through reorder, duplex configuration, merge, and download.

---

## Test Suite 2: Upload Functionality

### Test Case 2.1: Upload Single PDF via File Picker

**Priority**: High

**Test Steps**:

1. Navigate to http://localhost:5173/
2. Click on "Upload PDF Files" button
3. Select `1-page.pdf` from file picker
4. Verify:
   - 1 PDF card appears
   - Preview loads
   - File name: "1-page.pdf"
   - Page count: "1 page" (singular)
   - Badge shows "#1"
   - "Uploaded PDFs" shows "1 file ready to merge" (singular)

### Test Case 2.2: Upload Multiple PDFs at Once

**Priority**: High

**Test Steps**:

1. Navigate to http://localhost:5173/
2. Click "Upload PDF Files"
3. Select multiple files: `1-page.pdf`, `2-pages.pdf`, `3-pages.pdf` (multi-select)
4. Verify:
   - 3 PDF cards appear
   - All previews load
   - Correct order maintained
   - Summary shows "3 files ready to merge"
   - Total pages calculated correctly: 6 pages (1+2+3)

### Test Case 2.3: Add More PDFs to Existing Collection

**Priority**: High

**Test Steps**:

1. Upload `1-page.pdf`
2. Verify 1 PDF is shown
3. Click "+ Add more PDFs" button
4. Upload `2-pages.pdf`
5. Verify:
   - 2 PDF cards are shown
   - Second PDF has badge "#2"
   - Summary shows "2 files ready to merge"
   - Total pages: 3

### Test Case 2.4: Upload PDFs via Drag and Drop

**Priority**: Medium

**Test Steps**:

1. Navigate to application
2. Drag `5-pages.pdf` and drop onto upload area
3. Verify:
   - PDF is uploaded
   - Preview loads
   - File appears in grid
   - Page count shows "5 pages"

---

## Test Suite 3: PDF Preview and Metadata

### Test Case 3.1: Verify Preview Generation

**Priority**: High

**Test Steps**:

1. Upload `3-pages.pdf`
2. Observe preview loading:
   - Initial state shows loading spinner with "Loading preview..." text
   - Loader2 icon animates (spinning)
   - After loading, preview image of first page appears
   - Preview is clear and readable

### Test Case 3.2: Verify Page Count Display

**Priority**: High

**Test Steps**:

1. Upload each test PDF individually (in separate test runs):
   - `1-page.pdf` → "1 page" (singular)
   - `2-pages.pdf` → "2 pages"
   - `3-pages.pdf` → "3 pages"
   - `5-pages.pdf` → "5 pages"
   - `10-pages.pdf` → "10 pages"
2. Verify correct page count with FileStack icon

### Test Case 3.3: Verify File Size Display

**Priority**: Medium

**Test Steps**:

1. Upload `10-pages.pdf` (larger file)
2. Verify file size is displayed in appropriate unit:
   - If < 1024 bytes: "X bytes"
   - If < 1 MB: "XX.X KB"
   - If >= 1 MB: "XX.X MB"
3. Format shows 1 decimal place

### Test Case 3.4: Verify Position Badges

**Priority**: Medium

**Test Steps**:

1. Upload 3 PDFs
2. Verify each card shows position badge in bottom-left:
   - First PDF: "#1"
   - Second PDF: "#2"
   - Third PDF: "#3"
3. Badges are visible and styled as secondary badges

---

## Test Suite 4: Drag-and-Drop Reordering

### Test Case 4.1: Reorder PDFs - Move First to Last

**Priority**: High

**Test Steps**:

1. Upload `1-page.pdf`, `2-pages.pdf`, `3-pages.pdf` (in order)
2. Drag first PDF (#1) to last position (#3)
3. Verify:
   - Order becomes: 2-pages.pdf (#1), 3-pages.pdf (#2), 1-page.pdf (#3)
   - Position badges update correctly
   - Total pages remain the same

### Test Case 4.2: Reorder PDFs - Move Last to First

**Priority**: High

**Test Steps**:

1. Upload 3 PDFs
2. Drag last PDF to first position
3. Verify reordering works correctly
4. Verify position badges update

### Test Case 4.3: Reorder PDFs - Move Middle to Ends

**Priority**: Medium

**Test Steps**:

1. Upload `1-page.pdf`, `2-pages.pdf`, `3-pages.pdf`
2. Drag middle PDF (#2) to first position
3. Verify order updates
4. Drag same PDF from first to last
5. Verify order updates again

### Test Case 4.4: Visual Feedback During Drag

**Priority**: Medium

**Test Steps**:

1. Upload 3 PDFs
2. Hover over a PDF card
3. Verify:
   - Grip vertical icon appears in top-left
   - Cursor changes to move cursor
4. Start dragging a PDF
5. Verify:
   - Dragged card becomes semi-transparent (opacity-50)
   - Dragged card scales down (scale-95)
6. Drag over another card
7. Verify:
   - Target card shows ring border (ring-2 ring-primary)
   - Target card scales up slightly (scale-105)
8. Release drag
9. Verify:
   - All visual effects reset
   - Cards are in new order

### Test Case 4.5: No Reorder When Dropped on Same Position

**Priority**: Low

**Test Steps**:

1. Upload 3 PDFs
2. Drag first PDF and drop on itself
3. Verify:
   - No reordering occurs
   - Position badges remain the same
   - No unnecessary re-renders

---

## Test Suite 5: Duplex Mode Functionality

### Test Case 5.1: Toggle Duplex Mode On

**Priority**: Critical

**Test Steps**:

1. Upload `3-pages.pdf` (odd) and `2-pages.pdf` (even)
2. Note initial total pages: 5 (3+2)
3. Toggle duplex mode ON
4. Verify:
   - Switch is checked
   - "Duplex mode: ✓ Enabled"
   - Total pages: 6 (3+1+2 since 3-pages is not last)

### Test Case 5.2: Toggle Duplex Mode Off

**Priority**: Critical

**Test Steps**:

1. Upload 2 PDFs (one odd, one even)
2. Enable duplex mode
3. Note adjusted page count
4. Disable duplex mode
5. Verify:
   - Switch is unchecked
   - "Duplex mode: ✗ Disabled"
   - Total pages return to original sum

### Test Case 5.3: Duplex Calculation - All Odd Pages

**Priority**: High

**Test Steps**:

1. Upload `1-page.pdf`, `3-pages.pdf`, `5-pages.pdf` (all odd)
2. Enable duplex mode
3. Verify total pages: 11 (1+1+3+1+5 = 11)
   - First PDF: 1+1 = 2 (blank added, not last)
   - Second PDF: 3+1 = 4 (blank added, not last)
   - Third PDF: 5 (no blank added, is last)

### Test Case 5.4: Duplex Calculation - All Even Pages

**Priority**: High

**Test Steps**:

1. Upload `2-pages.pdf`, `10-pages.pdf` (all even)
2. Enable duplex mode
3. Verify total pages: 12 (2+10)
   - No blank pages added (all even)

### Test Case 5.5: Duplex Calculation - Mixed Pages

**Priority**: High

**Test Steps**:

1. Upload `2-pages.pdf`, `3-pages.pdf`, `10-pages.pdf` (even, odd, even)
2. Enable duplex mode
3. Verify total pages: 16
   - 2-pages: 2 (even, not last, no blank)
   - 3-pages: 3+1 = 4 (odd, not last, blank added)
   - 10-pages: 10 (even, is last, no blank)

### Test Case 5.6: Duplex Calculation - Single Odd PDF

**Priority**: Medium

**Test Steps**:

1. Upload only `5-pages.pdf` (odd, is last)
2. Enable duplex mode
3. Verify total pages: 5 (no blank page added since it's the last PDF)

### Test Case 5.7: Duplex Calculation - Single Even PDF

**Priority**: Medium

**Test Steps**:

1. Upload only `2-pages.pdf` (even)
2. Enable duplex mode
3. Verify total pages: 2 (no change)

### Test Case 5.8: Info Tooltip Content

**Priority**: Medium

**Test Steps**:

1. Upload at least one PDF
2. Hover over info icon (i) next to "Duplex Printing"
3. Verify tooltip appears with text:
   - "Adds a blank page after PDFs with odd page counts. This ensures proper alignment when printing double-sided, preventing content from different documents appearing on opposite sides of the same sheet."
4. Move mouse away
5. Verify tooltip disappears

---

## Test Suite 6: Summary Display

### Test Case 6.1: Summary Appears with PDFs

**Priority**: High

**Test Steps**:

1. Navigate to application
2. Verify summary section is not visible initially
3. Upload 1 PDF
4. Verify:
   - Summary section appears
   - Shows "Summary" heading

### Test Case 6.2: Total PDFs Count

**Priority**: High

**Test Steps**:

1. Upload 1 PDF
   - Verify "Total PDFs: 1"
2. Add 2 more PDFs
   - Verify "Total PDFs: 3"
3. Remove 1 PDF
   - Verify "Total PDFs: 2"

### Test Case 6.3: Total Pages Calculation

**Priority**: Critical

**Test Steps**:

1. Upload `1-page.pdf`, `2-pages.pdf`, `3-pages.pdf`
2. Verify "Total pages: 6" (without duplex)
3. Enable duplex
4. Verify "Total pages: 8" (1+1+2+3+1)

### Test Case 6.4: Total Size Display

**Priority**: High

**Test Steps**:

1. Upload `1-page.pdf` (~5 KB)
2. Verify "Total size: X.X KB"
3. Add `10-pages.pdf` (~20 KB)
4. Verify "Total size" increases appropriately
5. Verify format uses appropriate unit (bytes/KB/MB)

### Test Case 6.5: Duplex Mode Status

**Priority**: High

**Test Steps**:

1. Upload PDFs
2. Verify "Duplex mode: ✗ Disabled"
3. Enable duplex toggle
4. Verify "Duplex mode: ✓ Enabled"
5. Disable duplex toggle
6. Verify "Duplex mode: ✗ Disabled"

### Test Case 6.6: Merged PDF Size After Merge

**Priority**: Critical

**Test Steps**:

1. Upload `1-page.pdf`, `2-pages.pdf`
2. Verify "Merged PDF size" is NOT shown
3. Click "Merge 2 PDFs"
4. Wait for merge completion
5. **Note**: This is tricky as UI resets after merge. Need to check timing:
   - During merge: size should not be shown yet
   - After merge but before reset: "Merged PDF size: XX.XX MB" should appear
6. Verify merged size is displayed in green text
7. After 1 second, UI resets and merged size disappears

---

## Test Suite 7: Merge Process

### Test Case 7.1: Merge Button - Initial State

**Priority**: High

**Test Steps**:

1. Navigate to application (no PDFs)
2. Verify:
   - Button text: "Merge 0 PDFs"
   - Button is disabled
   - Help text shown: "Upload PDF files to begin merging"

### Test Case 7.2: Merge Button - Enabled State

**Priority**: High

**Test Steps**:

1. Upload 2 PDFs
2. Verify:
   - Button text: "Merge 2 PDFs"
   - Button is enabled
   - Button shows FileDown icon
   - Button has glow effect on hover
   - Help text is not shown

### Test Case 7.3: Merge Progress Indicator

**Priority**: Critical

**Test Steps**:

1. Upload `10-pages.pdf`, `5-pages.pdf` (larger files for observable progress)
2. Click "Merge 2 PDFs"
3. Verify:
   - Button disabled immediately
   - Button text: "Merging PDFs..."
   - Loader2 icon animates (spinning)
   - Progress bar appears
   - Progress bar shows "Processing..."
   - Progress updates: 20% → 50% → 80% → 100%
   - Each percentage is displayed on right side

### Test Case 7.4: Successful Merge and Download

**Priority**: Critical

**Test Steps**:

1. Upload `1-page.pdf`, `2-pages.pdf`
2. Enable duplex mode
3. Click "Merge 2 PDFs"
4. Wait for completion
5. Verify:
   - Progress reaches 100%
   - Download is triggered
   - File name format: `merged-YYYY-MM-DD.pdf` (today's date)
   - After ~1 second, UI resets:
     - File grid clears
     - Upload area returns
     - Summary disappears
     - Button disabled again

### Test Case 7.5: Merge with Duplex Enabled

**Priority**: Critical

**Test Steps**:

1. Upload `3-pages.pdf`, `5-pages.pdf` (both odd)
2. Enable duplex mode
3. Click "Merge 2 PDFs"
4. Wait for merge
5. Download merged PDF
6. **Manual verification needed**: Open merged PDF
   - Expected total pages: 9 (3+1+5)
   - Blank page inserted after page 3
   - Content of second PDF starts on page 5

### Test Case 7.6: Merge Without Duplex

**Priority**: High

**Test Steps**:

1. Upload `3-pages.pdf`, `5-pages.pdf`
2. Keep duplex mode OFF
3. Click "Merge 2 PDFs"
4. Download merged PDF
5. **Manual verification**: Open merged PDF
   - Expected total pages: 8 (3+5)
   - No blank pages inserted
   - Content flows continuously

---

## Test Suite 8: File Removal

### Test Case 8.1: Remove Single PDF

**Priority**: High

**Test Steps**:

1. Upload 3 PDFs
2. Hover over second PDF card
3. Verify:
   - X (remove) button appears in top-right
   - Button is red (destructive variant)
4. Click X button
5. Verify:
   - PDF is removed from grid
   - Remaining PDFs are 2
   - Position badges update (#1, #2)
   - Summary updates:
     - Total PDFs: 2
     - Total pages recalculates
     - Total size recalculates

### Test Case 8.2: Remove All PDFs One by One

**Priority**: Medium

**Test Steps**:

1. Upload 3 PDFs
2. Remove first PDF
   - Verify 2 remain
3. Remove another PDF
   - Verify 1 remains
   - Verify summary still shows
4. Remove last PDF
   - Verify file grid shows "No PDFs uploaded yet"
   - Verify summary disappears
   - Verify button disabled

### Test Case 8.3: Remove PDF After Enabling Duplex

**Priority**: High

**Test Steps**:

1. Upload `1-page.pdf`, `3-pages.pdf`, `2-pages.pdf`
2. Enable duplex mode
3. Note total pages (should be 7: 1+1+3+1+2)
4. Remove middle PDF (3-pages.pdf)
5. Verify:
   - Total pages updates to 4 (1+1+2, first is odd and not last)
   - Total PDFs: 2
   - Duplex mode still enabled

### Test Case 8.4: Remove Button Accessibility

**Priority**: Medium

**Test Steps**:

1. Upload 1 PDF named "test-document.pdf"
2. Hover over card
3. Check remove button:
   - Has aria-label: "Remove test-document.pdf"
   - Is keyboard accessible
   - Shows visual focus indicator

---

## Test Suite 9: Edge Cases and Error Handling

### Test Case 9.1: Upload Same PDF Multiple Times

**Priority**: Medium

**Test Steps**:

1. Upload `1-page.pdf`
2. Click "+ Add more PDFs"
3. Upload `1-page.pdf` again
4. Verify:
   - Both PDFs appear as separate cards
   - Both have same name but different positions
   - Total shows 2 PDFs
   - Total pages: 2

### Test Case 9.2: Merge with Only One PDF

**Priority**: Medium

**Test Steps**:

1. Upload single PDF: `5-pages.pdf`
2. Verify button text: "Merge 1 PDF" (singular)
3. Click "Merge 1 PDF"
4. Verify merge works
5. Download file
6. **Manual verification**: PDF downloads correctly with 5 pages

### Test Case 9.3: Large Number of PDFs

**Priority**: Low

**Test Steps**:

1. Upload 10+ PDFs
2. Verify:
   - All PDFs load and display
   - Grid layout handles multiple rows
   - Scrolling works smoothly
   - Performance is acceptable
   - Summary calculates correctly

### Test Case 9.4: Rapid Toggle of Duplex Mode

**Priority**: Low

**Test Steps**:

1. Upload 3 PDFs (mix of odd and even)
2. Rapidly toggle duplex mode ON and OFF multiple times
3. Verify:
   - Total pages update correctly each time
   - No race conditions
   - No incorrect calculations
   - No UI glitches

### Test Case 9.5: Merge Failure Handling

**Priority**: High
**Note**: This test requires simulating a merge error

**Test Steps**:

1. Upload 2 PDFs
2. Click merge
3. **Simulate error** (requires code modification or network failure)
4. Verify:
   - Alert appears: "Failed to merge PDFs. Please try again."
   - Loading state resets
   - Progress resets to 0
   - Files remain in grid (not cleared)
   - Button becomes enabled again
   - No merged PDF size is set

### Test Case 9.6: Remove PDF While Preview Loading

**Priority**: Medium

**Test Steps**:

1. Upload large PDF file
2. Immediately click remove button (before preview loads)
3. Verify:
   - PDF is removed
   - No errors in console
   - Loading state is cleaned up

---

## Test Suite 10: Responsive Design

### Test Case 10.1: Mobile View (375px width)

**Priority**: High

**Test Steps**:

1. Set viewport to 375x667 (iPhone SE)
2. Navigate to application
3. Verify:
   - Layout is single column
   - Upload area is full width
   - File grid uses 2 columns
   - Summary moves below file grid
   - All interactive elements are touch-friendly (min 44x44px)

### Test Case 10.2: Tablet View (768px width)

**Priority**: Medium

**Test Steps**:

1. Set viewport to 768x1024 (iPad)
2. Navigate to application
3. Verify:
   - Layout adapts appropriately
   - File grid uses 3-4 columns
   - Summary sidebar is visible

### Test Case 10.3: Desktop View (1920px width)

**Priority**: Medium

**Test Steps**:

1. Set viewport to 1920x1080
2. Navigate to application
3. Verify:
   - 3/4 split layout: content (3 cols) | sidebar (1 col)
   - File grid uses 6 columns
   - Summary is sticky on right
   - All content is readable and well-spaced

---

## Test Suite 11: Accessibility

### Test Case 11.1: Keyboard Navigation

**Priority**: High

**Test Steps**:

1. Navigate using Tab key only
2. Verify:
   - All interactive elements are reachable
   - Focus indicators are visible
   - Tab order is logical: upload → files → duplex toggle → merge button
   - Remove buttons are keyboard accessible

### Test Case 11.2: Screen Reader Labels

**Priority**: High

**Test Steps**:

1. Upload PDFs
2. Check aria-labels:
   - Upload button: appropriate label
   - Remove buttons: "Remove [filename]"
   - Duplex toggle: "Enable duplex printing mode"
   - Merge button: "Merge X PDFs" or "Merging PDFs in progress"
   - Progress bar: "Merge progress"

### Test Case 11.3: Alt Text for Images

**Priority**: Medium

**Test Steps**:

1. Upload PDF
2. Verify preview image has alt text: "Preview of [filename]"

### Test Case 11.4: Tooltip Accessibility

**Priority**: Medium

**Test Steps**:

1. Check duplex info tooltip
2. Verify:
   - Trigger button has aria-label: "More information about duplex printing"
   - Tooltip is keyboard accessible

---

## Test Suite 12: Performance

### Test Case 12.1: Preview Generation Time

**Priority**: Medium

**Test Steps**:

1. Upload `10-pages.pdf`
2. Measure time from upload to preview appearance
3. Expected: < 2 seconds for preview generation

### Test Case 12.2: Merge Performance

**Priority**: Medium

**Test Steps**:

1. Upload 3 large PDFs (10 pages each)
2. Click merge
3. Measure time to completion
4. Expected: Reasonable time based on file size

### Test Case 12.3: Memory Cleanup After Merge

**Priority**: Low

**Test Steps**:

1. Open browser dev tools → Memory
2. Upload PDFs
3. Merge PDFs
4. Wait for UI reset
5. Verify:
   - No memory leaks
   - Preview URLs are revoked
   - File references are cleared

---

## Test Suite 13: Cross-Browser Compatibility

### Test Case 13.1: Chrome/Chromium

**Priority**: Critical

- Run all critical tests in Chrome
- Verify PDF preview generation works
- Verify merge and download work

### Test Case 13.2: Firefox

**Priority**: High

- Run all critical tests in Firefox
- Verify PDF.js compatibility
- Verify file handling works

### Test Case 13.3: Safari/WebKit

**Priority**: High

- Run all critical tests in Safari
- Verify drag-and-drop works
- Verify download mechanism works

---

## Test Data Matrix

| File         | Pages | Parity | Size   | Use Case                   |
| ------------ | ----- | ------ | ------ | -------------------------- |
| 1-page.pdf   | 1     | Odd    | ~5 KB  | Single page, smallest file |
| 2-pages.pdf  | 2     | Even   | ~8 KB  | Even pages                 |
| 3-pages.pdf  | 3     | Odd    | ~11 KB | Odd pages                  |
| 5-pages.pdf  | 5     | Odd    | ~17 KB | Medium odd                 |
| 10-pages.pdf | 10    | Even   | ~30 KB | Largest file, even pages   |

## Duplex Calculation Reference

Formula: For each PDF except the last, if page count is odd, add 1 blank page.

Examples:

- [3, 5, 2] with duplex: 3+1 + 5+1 + 2 = 12 pages
- [1, 2, 3] with duplex: 1+1 + 2 + 3 = 7 pages
- [2, 4, 6] with duplex: 2 + 4 + 6 = 12 pages (no change)
- [5] with duplex: 5 pages (single PDF, no blank added)

---

## Automation Priority

**Must Automate (P0)**:

- Test Suite 1: Complete Happy Path Flow
- Test Case 5.1-5.5: Duplex calculations
- Test Case 6.3: Total pages calculation
- Test Case 7.4: Successful merge

**Should Automate (P1)**:

- Test Suite 2: Upload functionality
- Test Suite 4: Drag-and-drop reordering
- Test Suite 6: Summary display
- Test Suite 8: File removal

**Nice to Automate (P2)**:

- Test Suite 9: Edge cases
- Test Suite 10: Responsive design
- Test Suite 11: Accessibility
- Test Suite 13: Cross-browser

**Manual Testing**:

- Test Case 7.5-7.6: Manual PDF verification (open merged file)
- Test Case 12: Performance measurements
- Visual regression testing for UI elements

---

## Notes for Test Implementation

1. **Setup Requirements**:

   - Ensure dev server is running on port 5173
   - Test fixtures must be in `tests/fixtures/`
   - Set up proper browser context with downloads enabled

2. **File Upload Helpers**:

   - Create helper function to upload files via file input
   - Use `page.setInputFiles()` for programmatic upload
   - Consider creating fixtures for drag-and-drop testing

3. **Download Verification**:

   - Use Playwright's download events to capture file
   - Verify filename matches pattern
   - Optionally verify merged PDF content

4. **Timing Considerations**:

   - Wait for preview generation (loading spinners disappear)
   - Wait for page count updates
   - Wait for merge completion (progress = 100%)
   - 1-second delay after merge before UI resets

5. **Assertions Strategy**:

   - Verify element visibility
   - Check text content
   - Validate computed values (page counts, sizes)
   - Test state changes (enabled/disabled, checked/unchecked)

6. **Test Data Cleanup**:

   - Clear browser state between tests
   - No server-side cleanup needed (all client-side)

7. **Visual Regression**:
   - Consider screenshots for:
     - Initial state
     - After upload (with previews)
     - With duplex enabled
     - During merge (progress state)
