# UnitePDF E2E Test Flow Diagrams

Visual representations of test flows for the UnitePDF application.

---

## 1. Complete Happy Path Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    HAPPY PATH E2E TEST FLOW                     │
└─────────────────────────────────────────────────────────────────┘

[1] Navigate to App
    │
    ├── ✓ Page loads successfully
    ├── ✓ Upload area visible
    ├── ✓ "Merge 0 PDFs" button disabled
    └── ✓ "No PDFs uploaded yet" message shown
    │
    ▼
[2] Upload 3 PDFs
    │   • 3-pages.pdf (odd)
    │   • 5-pages.pdf (odd)
    │   • 2-pages.pdf (even)
    │
    ├── ✓ 3 PDF cards appear
    ├── ✓ Position badges: #1, #2, #3
    └── ✓ "Add more PDFs" button appears
    │
    ▼
[3] Wait for Previews
    │
    ├── ⏳ Loading spinners show
    ├── ✓ Preview images load
    ├── ✓ File names displayed
    ├── ✓ File sizes shown (KB format)
    └── ✓ Page counts: "3 pages", "5 pages", "2 pages"
    │
    ▼
[4] Check Summary (No Duplex)
    │
    ├── ✓ Summary section visible
    ├── ✓ Total PDFs: 3
    ├── ✓ Total pages: 10 (3+5+2)
    ├── ✓ Total size: XX.XX KB
    └── ✓ Duplex mode: ✗ Disabled
    │
    ▼
[5] Reorder PDFs
    │   Drag #3 (2-pages.pdf) → Position #1
    │
    ├── ✓ Grip icon visible on hover
    ├── ✓ Visual feedback during drag
    ├── ✓ New order: 2-pages, 3-pages, 5-pages
    └── ✓ Position badges update: #1, #2, #3
    │
    ▼
[6] Enable Duplex Mode
    │
    ├── ✓ Toggle switch ON
    ├── ✓ Switch shows checked state
    └── ✓ Tooltip available (info icon)
    │
    ▼
[7] Verify Duplex Calculation
    │   Formula: 2 + (3+1) + (5+1) = 12 pages
    │
    ├── ✓ Total pages: 12 (was 10)
    ├── ✓ Duplex mode: ✓ Enabled
    ├── ✓ Page count adjusts correctly
    └── ✓ 2-pages: no blank (even)
        3-pages: +1 blank (odd, not last)
        5-pages: +1 blank (odd, not last)
    │
    ▼
[8] Initiate Merge
    │
    ├── ✓ "Merge 3 PDFs" button clicked
    ├── ✓ Button becomes disabled
    ├── ✓ Button text: "Merging PDFs..."
    └── ✓ Spinner icon animates
    │
    ▼
[9] Monitor Progress
    │
    ├── ✓ Progress bar appears
    ├── ✓ "Processing..." text shown
    ├── ✓ Progress updates:
    │       0% → 20% → 50% → 80% → 100%
    └── ✓ Percentage displayed on right
    │
    ▼
[10] Download PDF
     │
     ├── ✓ Download event fires
     ├── ✓ Filename: merged-2025-11-07.pdf
     ├── ✓ File size reasonable
     └── ✓ Progress reaches 100%
     │
     ▼
[11] UI Reset (after 1 second)
     │
     ├── ✓ File grid clears
     ├── ✓ Upload area returns
     ├── ✓ "No PDFs uploaded yet" shown
     ├── ✓ Summary section hidden
     ├── ✓ Button text: "Merge 0 PDFs"
     └── ✓ Button disabled
     │
     ▼
[SUCCESS] ✓ Complete Happy Path Test Passed
```

---

## 2. Duplex Calculation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  DUPLEX MODE CALCULATION LOGIC                  │
└─────────────────────────────────────────────────────────────────┘

INPUT: Array of PDFs with page counts

                    ┌─────────────────────┐
                    │  DUPLEX ENABLED?    │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
            ✗ NO │                           │ ✓ YES
                 │                           │
                 ▼                           ▼
        ┌────────────────┐        ┌─────────────────────┐
        │  SIMPLE SUM    │        │  SMART CALCULATION  │
        │                │        │                     │
        │  Total = Σ(n)  │        │  For each PDF[i]:   │
        │                │        │  • If last: use n   │
        │  Example:      │        │  • If n is odd:     │
        │  [3,5,2] = 10  │        │    add n + 1        │
        └────────────────┘        │  • If n is even:    │
                                  │    add n            │
                                  │                     │
                                  │  Example:           │
                                  │  [3,5,2]            │
                                  │  = (3+1)+(5+1)+2    │
                                  │  = 4 + 6 + 2 = 12   │
                                  └─────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      TEST SCENARIOS                              │
└─────────────────────────────────────────────────────────────────┘

Scenario 1: All Odd Pages
├─ Input:  [1, 3, 5]
├─ No Duplex: 1 + 3 + 5 = 9 pages
└─ Duplex:    (1+1) + (3+1) + 5 = 11 pages ✓
               └──┬──┘   └──┬──┘   └┬┘
                blank     blank    no blank (last)

Scenario 2: All Even Pages
├─ Input:  [2, 10]
├─ No Duplex: 2 + 10 = 12 pages
└─ Duplex:    2 + 10 = 12 pages (no change) ✓
              └┬┘ └─┬┘
              even  even

Scenario 3: Mixed Pages
├─ Input:  [2, 3, 10]
├─ No Duplex: 2 + 3 + 10 = 15 pages
└─ Duplex:    2 + (3+1) + 10 = 16 pages ✓
              └┬┘  └──┬──┘  └─┬┘
              even   blank    even

Scenario 4: Single Odd PDF
├─ Input:  [5]
├─ No Duplex: 5 pages
└─ Duplex:    5 pages (no blank, is last) ✓

Scenario 5: Single Even PDF
├─ Input:  [2]
├─ No Duplex: 2 pages
└─ Duplex:    2 pages (no change) ✓
```

---

## 3. Upload Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        UPLOAD FLOW                              │
└─────────────────────────────────────────────────────────────────┘

[Option A] Single PDF Upload
    │
    1. Click "Upload PDF Files"
    2. Select 1-page.pdf
    │
    ├─ ✓ 1 PDF card appears
    ├─ ✓ Preview loads
    ├─ ✓ File name: "1-page.pdf"
    ├─ ✓ Page count: "1 page" (singular)
    ├─ ✓ Badge: "#1"
    └─ ✓ Message: "1 file ready to merge"

[Option B] Multiple PDFs at Once
    │
    1. Click "Upload PDF Files"
    2. Multi-select: 1-page.pdf, 2-pages.pdf, 3-pages.pdf
    │
    ├─ ✓ 3 PDF cards appear
    ├─ ✓ All previews load
    ├─ ✓ Badges: #1, #2, #3
    ├─ ✓ Message: "3 files ready to merge"
    └─ ✓ Summary: Total pages = 6 (1+2+3)

[Option C] Add More PDFs
    │
    1. Upload 1-page.pdf first
    │  ├─ ✓ 1 PDF card shown
    │  └─ ✓ "Add more PDFs" button appears
    │
    2. Click "+ Add more PDFs"
    3. Select 2-pages.pdf
    │
    ├─ ✓ 2 PDF cards total
    ├─ ✓ Second PDF has badge "#2"
    ├─ ✓ Message: "2 files ready to merge"
    └─ ✓ Total pages: 3 (1+2)

[Option D] Drag and Drop (Manual Test)
    │
    1. Drag 5-pages.pdf to upload area
    2. Drop
    │
    ├─ ✓ PDF uploads
    ├─ ✓ Preview loads
    └─ ✓ Page count: "5 pages"
```

---

## 4. Drag-and-Drop Reordering Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    REORDERING FLOW                              │
└─────────────────────────────────────────────────────────────────┘

INITIAL STATE:
┌──────────┐  ┌──────────┐  ┌──────────┐
│ PDF #1   │  │ PDF #2   │  │ PDF #3   │
│ 1-page   │  │ 2-pages  │  │ 3-pages  │
└──────────┘  └──────────┘  └──────────┘

[1] Hover Over Card
    │
    ├─ ✓ Cursor changes to "move"
    ├─ ✓ Grip icon (⋮⋮) appears top-left
    └─ ✓ Remove button (×) appears top-right

[2] Start Dragging #3
    │
    ├─ ✓ Source card opacity: 50%
    ├─ ✓ Source card scale: 95%
    └─ ✓ Cursor shows dragging state

[3] Drag Over #1
    │
    ├─ ✓ Target card ring border (primary)
    ├─ ✓ Target card scale: 105%
    └─ ✓ Shadow effect on target

[4] Release Drop
    │
    └─ ✓ Smooth animation

NEW STATE:
┌──────────┐  ┌──────────┐  ┌──────────┐
│ PDF #1   │  │ PDF #2   │  │ PDF #3   │
│ 3-pages  │  │ 1-page   │  │ 2-pages  │
└──────────┘  └──────────┘  └──────────┘

[5] Verify
    │
    ├─ ✓ Position badges update: #1, #2, #3
    ├─ ✓ Order correct in file list
    ├─ ✓ Summary recalculates correctly
    └─ ✓ All visual effects reset
```

---

## 5. Merge Process Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      MERGE PROCESS                              │
└─────────────────────────────────────────────────────────────────┘

[READY STATE]
    ├─ Button: "Merge 3 PDFs"
    ├─ Button: Enabled
    ├─ Icon: FileDown
    └─ Glow effect on hover

         │ Click Merge Button
         ▼

[PROCESSING STATE]
    ├─ Button: "Merging PDFs..."
    ├─ Button: Disabled
    ├─ Icon: Loader2 (spinning)
    └─ Progress bar appears

         │
         ├─── Step 1: Convert Files to Uint8Array
         │    Progress: 20%
         │
         ├─── Step 2: Merge PDFs with pdf-lib
         │    Progress: 50%
         │    (Add blank pages if duplex enabled)
         │
         ├─── Step 3: Generate Merged PDF Blob
         │    Progress: 80%
         │
         └─── Step 4: Trigger Download
              Progress: 100%

         │
         ▼

[DOWNLOAD STATE]
    ├─ Browser download triggered
    ├─ Filename: merged-YYYY-MM-DD.pdf
    ├─ File size stored
    └─ "Merged PDF size: XX.XX MB" displayed (briefly)

         │ Wait 1 second
         ▼

[RESET STATE]
    ├─ Files cleared
    ├─ Upload area returns
    ├─ Summary hidden
    ├─ Button: "Merge 0 PDFs" (disabled)
    └─ Ready for next session
```

---

## 6. Summary Display State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUMMARY STATE MACHINE                        │
└─────────────────────────────────────────────────────────────────┘

[STATE 1] No PDFs
    ├─ Summary: Hidden
    ├─ Duplex Toggle: Hidden
    └─ Merge Button: Disabled

         │ Upload 1+ PDFs
         ▼

[STATE 2] PDFs Uploaded (No Duplex)
    ├─ Summary: Visible
    │   ├─ Total PDFs: [count]
    │   ├─ Total pages: Σ(pages)
    │   ├─ Total size: Σ(bytes)
    │   └─ Duplex mode: ✗ Disabled
    ├─ Duplex Toggle: Visible
    └─ Merge Button: Enabled

         │ Enable Duplex
         ▼

[STATE 3] PDFs Uploaded (With Duplex)
    ├─ Summary: Visible
    │   ├─ Total PDFs: [count]
    │   ├─ Total pages: [adjusted]
    │   │   (adds blank pages for odd PDFs)
    │   ├─ Total size: Σ(bytes)
    │   └─ Duplex mode: ✓ Enabled
    ├─ Duplex Toggle: Visible (checked)
    └─ Merge Button: Enabled

         │ Click Merge
         ▼

[STATE 4] Merging
    ├─ Summary: Visible (static)
    ├─ Duplex Toggle: Visible (disabled)
    ├─ Merge Button: Disabled
    └─ Progress: 0-100%

         │ Merge Complete
         ▼

[STATE 5] Merged (Brief)
    ├─ Summary: Visible
    │   ├─ [previous values]
    │   └─ Merged PDF size: XX.XX MB ✨
    └─ Download triggered

         │ After 1 second
         ▼

[STATE 1] Reset (back to start)
```

---

## 7. File Removal Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     FILE REMOVAL FLOW                           │
└─────────────────────────────────────────────────────────────────┘

BEFORE:
┌──────────┐  ┌──────────┐  ┌──────────┐
│ PDF #1   │  │ PDF #2   │  │ PDF #3   │
│ 1-page   │  │ 3-pages  │  │ 5-pages  │
└──────────┘  └──────────┘  └──────────┘
Summary: 3 PDFs, 9 pages

[1] Hover Over PDF #2
    │
    ├─ Remove button (×) appears
    ├─ Button styled: red/destructive
    └─ Aria-label: "Remove 3-pages.pdf"

[2] Click Remove
    │
    ├─ Fade out animation
    ├─ PDF #2 removed from array
    └─ UI updates

AFTER:
┌──────────┐  ┌──────────┐
│ PDF #1   │  │ PDF #2   │
│ 1-page   │  │ 5-pages  │
└──────────┘  └──────────┘
Summary: 2 PDFs, 6 pages

[3] Updates Triggered
    │
    ├─ Position badges reindex: #1, #2
    ├─ Summary recalculates:
    │   ├─ Total PDFs: 3 → 2
    │   ├─ Total pages: 9 → 6
    │   └─ Total size: recalculated
    └─ Page count map updated

[4] Remove All PDFs
    │
    └─ When count reaches 0:
        ├─ File grid: "No PDFs uploaded yet"
        ├─ Summary: Hidden
        ├─ Duplex toggle: Hidden
        └─ Merge button: Disabled
```

---

## 8. Test Data Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                   TEST DATA SELECTION                           │
└─────────────────────────────────────────────────────────────────┘

What are you testing?
    │
    ├─ Single Page Handling?
    │  └─> Use: 1-page.pdf (1 page, odd)
    │
    ├─ Small Even PDF?
    │  └─> Use: 2-pages.pdf (2 pages, even)
    │
    ├─ Small Odd PDF?
    │  └─> Use: 3-pages.pdf (3 pages, odd)
    │
    ├─ Medium Odd PDF?
    │  └─> Use: 5-pages.pdf (5 pages, odd)
    │
    ├─ Large Even PDF?
    │  └─> Use: 10-pages.pdf (10 pages, even)
    │
    ├─ Duplex - All Odd?
    │  └─> Use: [1-page, 3-pages, 5-pages]
    │
    ├─ Duplex - All Even?
    │  └─> Use: [2-pages, 10-pages]
    │
    ├─ Duplex - Mixed?
    │  └─> Use: [2-pages, 3-pages, 10-pages]
    │
    └─ Performance/Large File?
       └─> Use: [10-pages, 10-pages, 10-pages]
```

---

## 9. Assertion Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│                    ASSERTION CHECKLIST                          │
└─────────────────────────────────────────────────────────────────┘

✓ UPLOAD PHASE
  ├─ [ ] File count matches uploaded count
  ├─ [ ] Preview images load (no broken images)
  ├─ [ ] File names display correctly
  ├─ [ ] Page counts accurate
  ├─ [ ] File sizes formatted properly
  └─ [ ] Position badges sequential (#1, #2, #3...)

✓ PREVIEW PHASE
  ├─ [ ] Loading spinners appear initially
  ├─ [ ] Spinners disappear when loaded
  ├─ [ ] Preview images visible
  └─ [ ] Alt text present on images

✓ METADATA PHASE
  ├─ [ ] File names truncate if too long
  ├─ [ ] Page count singular/plural correct
  ├─ [ ] File size in correct unit (bytes/KB/MB)
  └─ [ ] FileStack icon visible

✓ REORDER PHASE
  ├─ [ ] Drag events work smoothly
  ├─ [ ] Visual feedback during drag
  ├─ [ ] Final order matches expectation
  ├─ [ ] Position badges update
  └─ [ ] Summary remains accurate

✓ DUPLEX PHASE
  ├─ [ ] Toggle state changes visually
  ├─ [ ] Page count recalculates correctly
  ├─ [ ] Status text updates (✓/✗)
  ├─ [ ] Tooltip content accurate
  └─ [ ] Multiple toggles work correctly

✓ SUMMARY PHASE
  ├─ [ ] Total PDFs count correct
  ├─ [ ] Total pages accurate
  ├─ [ ] Total size cumulative
  ├─ [ ] Duplex status correct
  └─ [ ] Merged size shown after merge

✓ MERGE PHASE
  ├─ [ ] Button states transition correctly
  ├─ [ ] Progress updates sequentially
  ├─ [ ] Progress percentages: 20→50→80→100
  ├─ [ ] Download event fires
  ├─ [ ] Filename format correct
  ├─ [ ] UI resets after completion
  └─ [ ] No console errors

✓ REMOVAL PHASE
  ├─ [ ] Remove button visible on hover
  ├─ [ ] PDF removed on click
  ├─ [ ] Remaining PDFs reindex
  ├─ [ ] Summary recalculates
  └─ [ ] Can remove all PDFs
```

---

## 10. Error Scenarios

```
┌─────────────────────────────────────────────────────────────────┐
│                     ERROR HANDLING                              │
└─────────────────────────────────────────────────────────────────┘

[Scenario 1] Merge Fails
    │
    ├─ Simulate: Network error, invalid PDF, etc.
    │
    ├─ Expected:
    │   ├─ Alert: "Failed to merge PDFs. Please try again."
    │   ├─ Loading state resets
    │   ├─ Progress resets to 0
    │   ├─ Files remain in grid (not cleared)
    │   ├─ Button becomes enabled again
    │   └─ No merged PDF size is set
    │
    └─ Recovery: User can try merge again

[Scenario 2] Preview Generation Fails
    │
    ├─ Simulate: Corrupted PDF, unsupported format
    │
    ├─ Expected:
    │   ├─ Fallback icon (FileText) shown
    │   ├─ No broken image
    │   ├─ Page count still loads
    │   └─ File can still be merged
    │
    └─ Recovery: Merge may still work

[Scenario 3] Large File Upload
    │
    ├─ Upload: Very large PDF (100+ MB)
    │
    ├─ Expected:
    │   ├─ Preview may take longer
    │   ├─ Page count loads eventually
    │   ├─ Merge may be slower
    │   └─ Browser doesn't crash
    │
    └─ Note: No explicit file size limit

[Scenario 4] Browser Compatibility
    │
    ├─ Test: Safari, Firefox, Edge
    │
    └─ Verify:
        ├─ pdf-lib works in all browsers
        ├─ Download mechanism works
        ├─ Drag-and-drop works
        └─ FileReader API works
```

---

## Legend

```
Symbols Used:
├─  Branch/Connection
└─  End of branch
│   Continuation
▼   Flow direction (downward)
►   Flow direction (rightward)
✓   Success/Assertion passed
✗   Disabled/Not active
⏳  Loading/In progress
✨  New/Highlighted feature
[ ] Checkbox (unchecked)
[x] Checkbox (checked)
```

---

## Quick Reference

### Critical Paths
1. **Happy Path**: Upload → Reorder → Duplex → Merge → Download
2. **Duplex Calculation**: Various page combinations
3. **Upload Variations**: Single, multiple, add more
4. **Merge Process**: Progress tracking and download

### Key Assertions
- File counts match
- Page counts accurate (with/without duplex)
- Previews load correctly
- Drag-and-drop reorders properly
- Download succeeds with correct filename
- UI resets after merge

### Test Data Strategy
- **Odd pages**: 1-page, 3-pages, 5-pages
- **Even pages**: 2-pages, 10-pages
- **Mix them** for comprehensive duplex testing

---

**These flow diagrams complement the detailed test plans in:**
- `TESTPLAN.md` - Comprehensive test cases
- `TEST_SCENARIOS.md` - Quick reference scenarios
- `PLAYWRIGHT_IMPLEMENTATION_GUIDE.md` - Implementation code
- `README.md` - Overview and getting started
