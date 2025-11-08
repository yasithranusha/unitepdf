# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

**UnitePDF** - An open source web application for merging multiple PDF files optimized for duplex printing.

### Key Features

1. **PDF Merging**: Combine multiple PDF files into one output file
2. **Duplex Printing Support**: Automatically adds blank pages to PDFs with odd page counts to ensure proper duplex (double-sided) printing
3. **PDF Compression**: Optional compression with three levels (Extreme, Recommended, Light) to reduce file size
4. **PDF Previews**: View the first page of each PDF before merging with thumbnail previews
5. **Page Count Tracking**: See individual page counts for each PDF and total pages (adjusted for duplex mode)
6. **File Size Information**: Track individual file sizes, total size, and merged PDF size with compression savings
7. **Drag-and-Drop Reordering**: Rearrange PDFs in your desired sequence
8. **Dark Mode**: Full dark mode support using shadcn/ui theme provider with system preference detection
9. **Browser-based**: No server-side processing required - all PDF operations happen in the browser
10. **SEO Optimized**: Comprehensive meta tags and structured data for search engine visibility

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
- **PDF Libraries**:
  - pdf-lib (for PDF manipulation and merging)
  - pdfjs-dist (for PDF preview generation)
- **CI/CD**: GitHub Actions workflow for automated testing

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

# Run tests in watch mode (default)
pnpm test

# Run tests once (CI mode)
pnpm test:run

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Run browser mode tests (requires @vitest/browser + playwright)
pnpm test:browser

# Run Playwright E2E tests
pnpm test:e2e

# Run Playwright visual regression tests
pnpm test:visual

# Update visual test snapshots
pnpm test:visual:update

# Run Playwright tests with UI mode (interactive)
pnpm test:e2e:ui

# View Playwright test report
pnpm test:report

# Regenerate test PDF fixtures
node scripts/generate-test-pdfs.js
```

## Testing

This project uses a comprehensive testing strategy:

### Testing Stack

- **Unit/Integration Tests**: Vitest with jsdom
  - Fast, Vite-native test runner
  - jsdom environment for DOM testing
  - Global test APIs enabled (describe, it, expect)
  - Jest-compatible API

- **Component Tests**: Vitest Browser Mode (optional)
  - Real browser testing with Playwright
  - `vitest-browser-react` for React component rendering
  - Actual browser APIs and user interactions
  - Install with: `pnpm add -D @vitest/browser playwright vitest-browser-react`

- **E2E Tests**: Playwright
  - End-to-end testing with real browsers
  - Cross-browser testing (Chromium, Firefox, WebKit)
  - Mobile and tablet viewport testing
  - Automatic waiting and retry mechanisms

- **Visual Regression Tests**: Playwright Screenshots
  - Pixel-perfect UI validation
  - Screenshot comparison against baselines
  - Detect unintended visual changes
  - Cross-browser visual consistency
  - Responsive design validation

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
├── unit/            # Unit tests for utilities (jsdom)
│   └── utils.test.ts
├── browser/         # Browser mode tests for React components
│   └── button.browser.test.tsx
├── visual/          # Playwright visual regression tests
│   └── homepage.visual.spec.ts
└── example.test.ts  # Basic test example

scripts/
└── generate-test-pdfs.js  # Script to regenerate test fixtures

playwright.config.ts         # Playwright configuration
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

### Running Different Test Types

**Unit Tests (jsdom)**: Default mode for utility and logic testing
```bash
pnpm test              # Watch mode
pnpm test:run          # Single run
```

**Browser Mode Tests**: For React components in real browsers
```bash
# First install browser dependencies:
pnpm add -D @vitest/browser playwright vitest-browser-react

# Uncomment browser config in vite.config.ts

# Run browser tests:
pnpm test:browser
```

**Test Coverage**: Generate coverage reports
```bash
pnpm test:coverage
```

**UI Mode**: Interactive test UI
```bash
pnpm test:ui
```

**Visual Regression Tests**: Playwright screenshot comparison
```bash
# Run visual tests
pnpm test:visual

# Update baseline screenshots
pnpm test:visual:update

# View HTML report with screenshot diffs
pnpm test:report

# Run in UI mode (interactive)
pnpm test:e2e:ui
```

## Claude Agents

This project includes specialized Claude agents in `.claude/agents/`:

### Visual QA Engineer (`visual-qa-engineer.md`)
Specialized in visual testing and UI validation using Playwright:
- Screenshot comparison and visual regression testing
- Cross-browser and responsive design validation
- Accessibility visual checks (focus indicators, color contrast)
- Component state testing (hover, focus, disabled, loading)
- Automated baseline screenshot generation

**Use this agent when:**
- Adding new UI components that need visual validation
- Checking for unintended visual changes
- Validating responsive design across viewports
- Testing dark/light mode consistency
- Verifying accessibility visual requirements

### Playwright Test Agents
Generated by Playwright MCP integration:
- `playwright-test-generator.md` - Generate E2E tests
- `playwright-test-healer.md` - Fix failing tests automatically
- `playwright-test-planner.md` - Plan comprehensive test coverage

**Invoke agents:** Use the Task tool or `/agent <name>` command

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

**Implemented structure:**
```
src/
├── components/
│   ├── ui/                  # shadcn/ui components (button, card, badge, dropdown, etc.)
│   ├── Header.tsx           # Application header with GitHub link and theme toggle
│   ├── ThemeToggle.tsx      # Dark mode toggle with dropdown menu (Light/Dark/System)
│   ├── theme-provider.tsx   # Theme provider using official shadcn/ui pattern
│   ├── PdfUploader.tsx      # Component for uploading PDFs with drag-and-drop
│   ├── PdfFileGrid.tsx      # Grid display with previews, page counts, drag-to-reorder
│   ├── DuplexToggle.tsx     # Toggle for duplex printing mode
│   ├── CompressionToggle.tsx # Toggle for PDF compression with level selection
│   └── MergeButton.tsx      # Button with progress indicator
├── lib/
│   ├── utils.ts             # General utilities (cn, etc.)
│   ├── pdfUtils.ts          # PDF manipulation utilities (merge, download, compression)
│   └── pdfPreview.ts        # PDF preview generation using pdfjs-dist
└── App.tsx                  # Main application with state management

tests/
├── unit/                    # Unit tests for utilities (78 tests)
│   ├── pdfUtils.test.ts
│   ├── utils.test.ts
│   ├── PdfUploader.test.tsx
│   ├── PdfFileList.test.tsx
│   ├── DuplexToggle.test.tsx
│   ├── CompressionToggle.test.tsx
│   └── MergeButton.test.tsx
├── browser/                 # Vitest browser mode tests
│   └── button.browser.test.tsx
├── e2e/                     # Playwright E2E tests (14 tests)
│   ├── README.md
│   ├── TESTPLAN.md
│   ├── TEST_SCENARIOS.md
│   ├── PLAYWRIGHT_IMPLEMENTATION_GUIDE.md
│   ├── TEST_FLOW_DIAGRAMS.md
│   ├── unite-pdf-happy-path.spec.ts
│   ├── duplex-mode-calculations.spec.ts
│   └── dark-mode.spec.ts    # Dark mode feature tests (10 tests)
├── fixtures/                # Test PDF files
│   ├── 1-page.pdf
│   ├── 2-pages.pdf
│   ├── 3-pages.pdf
│   ├── 5-pages.pdf
│   ├── 10-pages.pdf
│   └── README.md
└── example.test.ts
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
- Custom theme with blue/purple color palette
- Dark mode support via `.dark` class on `<html>` element

### Dark Mode Implementation

Dark mode follows the official shadcn/ui pattern:
- **Theme Provider**: `src/components/theme-provider.tsx` using React Context
- **Theme Toggle**: Dropdown menu with Light/Dark/System options
- **Storage**: User preference saved in localStorage as `unitepdf-theme`
- **System Detection**: Automatically detects OS dark mode preference
- **CSS Variables**: Custom dark mode colors defined in `src/index.css`
- **Class Strategy**: Applies `dark` class to `<html>` element
- **Color Palette**: Deep blue/purple theme matching the app's design

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

## CI/CD with GitHub Actions

The project includes a comprehensive CI/CD workflow that runs on every push and pull request to the `main` branch.

### Workflow Configuration

**File**: `.github/workflows/ci.yml`

**Pipeline Steps:**
1. Install dependencies with pnpm
2. Install Playwright chromium browser
3. Run unit tests (55 tests via Vitest)
4. Build production bundle
5. Start development server
6. Run E2E tests (4 tests via Playwright)
7. Upload test reports as artifacts

**Test Coverage:**
- ✅ 78 unit tests (components and utilities)
- ✅ 14 E2E tests (happy path + duplex calculations + dark mode)
- ✅ Runs on Ubuntu latest
- ✅ 60-minute timeout
- ✅ Chromium-only for fast CI execution
- ✅ Artifacts uploaded with unique run IDs

### Running Tests Locally

```bash
# Run all unit tests
pnpm test:run

# Run E2E tests (chromium only)
pnpm test:e2e

# Run E2E tests with UI mode
pnpm test:e2e:ui
```

## SEO Implementation

The application includes comprehensive SEO optimization:

### Meta Tags (index.html)
- Primary meta tags with targeted keywords
- Open Graph tags for social media sharing
- Twitter Card tags
- Canonical URL
- robots.txt and sitemap.xml

### Structured Data (JSON-LD)
- Schema.org WebApplication markup
- Feature list
- Free pricing information
- Organization details

### Content Optimization
- Keyword-rich headings and descriptions
- Comprehensive feature documentation
- Use case examples
- Step-by-step instructions

**Target Keywords:**
- merge pdf for duplex printing
- combine pdf duplex
- add blank page odd pages pdf
- pdf duplex printing tool
- merge pdf add blank pages
