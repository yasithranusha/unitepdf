# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

**PDF Merger** - An open source web application for merging multiple PDF files into a single PDF document.

### Key Features

1. **PDF Merging**: Combine multiple PDF files into one output file
2. **Duplex Printing Support**: Optional feature that automatically adds blank pages to PDFs with odd page counts to ensure proper duplex (double-sided) printing
3. **Browser-based**: No server-side processing required - all PDF operations happen in the browser

### Development Philosophy

This project follows **Test-Driven Development (TDD)**:
- Write tests before implementing features
- Ensure all features have corresponding test coverage
- Run tests before committing changes

## Project Overview

This is a React + TypeScript + Vite project using:
- **Build Tool**: Vite (via rolldown-vite v7.1.14 - an experimental Rolldown-based Vite fork)
- **React**: v19.1.1 with React Compiler enabled
- **Styling**: Tailwind CSS v4 (latest major version)
- **UI Components**: shadcn/ui (New York style variant)
- **Package Manager**: pnpm
- **PDF Library**: pdf-lib (installed as dev dependency)

## Development Commands

```bash
# Start development server with HMR
pnpm dev

# Type-check and build for production
pnpm build

# Run ESLint
pnpm lint

# Preview production build
pnpm preview

# Run unit tests (once configured)
pnpm test

# Run unit tests in watch mode
pnpm test:watch

# Run E2E tests with Playwright
pnpm test:e2e

# Run all tests
pnpm test:all

# Regenerate test PDF fixtures
node scripts/generate-test-pdfs.js
```

## Testing

This project uses a comprehensive testing strategy:

### Testing Stack

- **Unit/Integration Tests**: Vitest (recommended for Vite projects)
  - Fast, Vite-native test runner
  - Compatible with Vite's configuration and plugins
  - Jest-compatible API

- **E2E Tests**: Playwright
  - Browser automation for testing the complete user workflow
  - Cross-browser testing support
  - Visual regression testing capabilities

### Test Structure

```
tests/
├── fixtures/         # Test PDF files (committed to repo)
│   ├── 1-page.pdf   # 1 page (odd) - ~1 KB
│   ├── 2-pages.pdf  # 2 pages (even) - ~1 KB
│   ├── 3-pages.pdf  # 3 pages (odd) - ~2 KB
│   ├── 5-pages.pdf  # 5 pages (odd) - ~2 KB
│   ├── 10-pages.pdf # 10 pages (even) - ~4 KB
│   └── README.md    # Documentation for fixtures
├── unit/            # Unit tests for utilities and hooks (to be created)
├── integration/     # Integration tests for components (to be created)
└── e2e/            # Playwright E2E tests (to be created)

scripts/
└── generate-test-pdfs.js  # Script to regenerate test fixtures
```

### Test PDF Fixtures

All test PDFs in `tests/fixtures/` contain:
- **Large page numbers (120pt)** centered on each page for visual identification
- **Header text** showing filename and "Page X of Y"
- **Footer text** indicating "ODD page" or "EVEN page"

This design allows you to:
1. Visually verify PDFs are merged in correct order
2. Confirm all pages are included
3. Test duplex printing (blank page insertion for odd-page PDFs)
4. Manually inspect merged output

**Regenerate fixtures**: Run `node scripts/generate-test-pdfs.js`

### Testing Guidelines

1. **TDD Workflow**: Write tests before implementation
2. **PDF Testing**: Use sample PDFs in `tests/fixtures/` with known page counts
3. **Duplex Feature Testing**: Verify blank pages are correctly added after odd-page PDFs
   - Example: Merging `1-page.pdf` + `2-pages.pdf` with duplex should produce 4 pages (1, blank, 1, 2)
4. **File Validation**: Test with various PDF structures and edge cases
5. **Browser Compatibility**: Run E2E tests across different browsers

### PDF Testing Library

`pdf-lib` is installed as a dev dependency for:
- Generating test fixtures
- PDF manipulation in tests
- Verifying page counts in merged PDFs
- Creating and testing blank pages

## Architecture

### Project Structure

```
src/
├── components/
│   └── ui/           # shadcn/ui components
│       └── button.tsx
├── lib/
│   └── utils.ts      # General utilities (cn, etc.)
├── assets/           # Static assets
├── main.tsx          # Application entry point
├── App.tsx           # Root component
└── index.css         # Global styles and Tailwind imports

tests/
└── fixtures/         # Test PDF files (committed to repo)
    ├── 1-page.pdf
    ├── 2-pages.pdf
    ├── 3-pages.pdf
    ├── 5-pages.pdf
    ├── 10-pages.pdf
    └── README.md

scripts/
└── generate-test-pdfs.js  # Generate test PDF fixtures
```

**Planned structure for implementation:**
```
src/
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── PdfUploader.tsx      # Component for selecting/uploading PDFs
│   ├── PdfMerger.tsx        # Main PDF merging component
│   └── DuplexOptions.tsx    # Duplex printing configuration
├── lib/
│   ├── utils.ts             # General utilities (cn, etc.)
│   ├── pdf-utils.ts         # PDF manipulation utilities
│   └── duplex-utils.ts      # Duplex printing logic
├── hooks/
│   └── usePdfMerge.ts       # Hook for PDF merging logic
└── types/
    └── pdf.ts               # PDF-related type definitions

tests/
├── unit/             # Unit tests for utilities
├── integration/      # Component integration tests
└── e2e/             # Playwright E2E tests
```

### Path Aliases

The project uses `@/` as an alias for the `src/` directory:
- `@/components` → `src/components`
- `@/lib/utils` → `src/lib/utils`
- `@/ui` → `src/components/ui`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`

These are configured in:
- `vite.config.ts` (for Vite)
- `tsconfig.json` (for TypeScript)
- `components.json` (for shadcn/ui)

### shadcn/ui Configuration

Components are configured with:
- **Style**: new-york
- **Base Color**: neutral
- **Icon Library**: lucide-react
- **CSS Variables**: Enabled (for theme customization)
- **RSC**: Disabled (client-side React only)

Add new shadcn/ui components using:
```bash
pnpm dlx shadcn@latest add [component-name]
```

## Key Technical Details

### React Compiler

The React Compiler is enabled via `babel-plugin-react-compiler`. This automatically optimizes React components but may impact Vite dev/build performance.

### Vite via Rolldown

This project uses `rolldown-vite` instead of standard Vite. Rolldown is an experimental Rust-based bundler. All Vite commands work the same, but be aware of this when debugging build issues.

### TypeScript Configuration

- **Strict mode enabled** with additional strictness flags
- **Target**: ES2022
- **Module Resolution**: bundler mode
- **JSX**: react-jsx (automatic runtime)
- **No emit**: TypeScript is only used for type-checking; Vite handles transpilation

### Tailwind CSS v4

This project uses Tailwind CSS v4 (installed as `@tailwindcss/vite` plugin). Key differences from v3:
- No `tailwind.config.js` file (configured via CSS)
- Uses Vite plugin for integration
- Global styles in `src/index.css`

### ESLint Configuration

Flat config format with:
- TypeScript ESLint recommended rules
- React Hooks recommended rules (latest)
- React Refresh for Vite
- Ignores `dist/` directory

## PDF Manipulation Implementation

### Core Functionality

1. **PDF Loading**: Read and parse multiple PDF files from user input
2. **Page Count Detection**: Determine number of pages in each PDF
3. **Duplex Logic**:
   - If duplex mode is enabled and a PDF has odd pages, append a blank page
   - Formula: `if (pageCount % 2 !== 0) addBlankPage()`
4. **PDF Merging**: Combine all processed PDFs into a single output file
5. **Download**: Allow user to download the merged PDF

### Recommended Library: pdf-lib

`pdf-lib` is recommended for browser-based PDF manipulation:
- Runs entirely in the browser (no server required)
- Can create, modify, and merge PDFs
- Can add blank pages
- TypeScript support
- Zero native dependencies

```typescript
// Example: Adding a blank page for duplex printing
import { PDFDocument } from 'pdf-lib'

async function addBlankPageIfOdd(pdfDoc: PDFDocument) {
  const pageCount = pdfDoc.getPageCount()
  if (pageCount % 2 !== 0) {
    const blankPage = pdfDoc.addPage()
    // Blank page dimensions should match the last page
  }
}
```

## Type Checking

Type checking is performed during build but not during development. To type-check manually:
```bash
pnpm exec tsc -b
```
