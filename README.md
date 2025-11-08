# UnitePDF

Merge PDF files for duplex printing with this modern, browser-based PDF merging tool. UnitePDF allows you to combine multiple PDF files into a single document with support for duplex printing optimization.

## Why UnitePDF?

-   **✅ 100% Free & Open Source**: No hidden costs or subscriptions.
-   **🔒 Privacy-First**: All processing is done in your browser. Your files never touch a server.
-   **🚀 No Installation**: Works directly in your web browser.
-   **📄 Duplex Printing Perfected**: Automatically adds blank pages to ensure your double-sided printing works flawlessly. Use our tool to merge PDF for duplex printing.
-   **Modern & Simple**: A clean, intuitive interface that's easy to use.

## Features

- 🔄 **Merge Multiple PDFs**: Combine multiple PDF files into one document
- 📄 **Duplex Printing Support**: Automatically add blank pages to PDFs with odd page counts for proper double-sided printing
- 🗜️ **PDF Compression**: Optional compression with three levels (Extreme, Recommended, Light) to reduce file size
- 🖼️ **PDF Previews**: View thumbnails of the first page of each PDF before merging
- 📊 **Page Count Tracking**: See individual and total page counts, automatically adjusted for duplex mode
- 💾 **File Size Information**: Track individual file sizes, total size before merge, and final merged PDF size with compression savings
- 🎯 **Drag-and-Drop Reordering**: Easily rearrange PDFs in your desired sequence
- 🌙 **Dark Mode**: Full dark mode support with Light/Dark/System preference options
- 🌐 **100% Browser-Based**: All processing happens in your browser - no server uploads required
- 🎨 **Modern UI**: Built with React and Tailwind CSS for a clean, responsive interface
- 🔒 **Privacy-First**: Your files never leave your device
- 🔍 **SEO Optimized**: Comprehensive meta tags and structured data for search visibility

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite (via Rolldown)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **PDF Libraries**:
  - pdf-lib (for PDF merging and manipulation)
  - pdfjs-dist (for PDF preview generation)
- **Testing**: Vitest + Playwright
- **CI/CD**: GitHub Actions
- **Package Manager**: pnpm

## Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/unitepdf.git
cd unitepdf
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Upload PDFs**: Click or drag-and-drop to select multiple PDF files
2. **Reorder (optional)**: Drag files to reorder them in your desired sequence
3. **Enable Duplex Mode (optional)**: Toggle the duplex printing option to automatically add blank pages after PDFs with odd page counts
4. **Merge**: Click the "Merge PDFs" button to combine your files
5. **Download**: Save the merged PDF to your device

## Development

### Available Commands

```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint

# Type check
pnpm exec tsc -b

# Run tests in watch mode
pnpm test

# Run tests once (CI mode)
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Run tests with interactive UI
pnpm test:ui

# Run browser mode tests (requires additional setup)
pnpm test:browser

# Run Playwright E2E tests
pnpm test:e2e

# Run visual regression tests
pnpm test:visual

# Update visual test baselines
pnpm test:visual:update

# View test report
pnpm test:report

# Regenerate test PDF fixtures (if needed)
node scripts/generate-test-pdfs.js
```

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components (button, card, badge, dropdown, etc.)
│   ├── Header.tsx      # App header with GitHub link and theme toggle
│   ├── ThemeToggle.tsx # Dark mode toggle with dropdown menu
│   ├── theme-provider.tsx # Theme provider for dark mode
│   ├── PdfUploader.tsx # PDF upload with drag-and-drop
│   ├── PdfFileGrid.tsx # Grid with previews and reordering
│   ├── DuplexToggle.tsx # Duplex mode toggle
│   ├── CompressionToggle.tsx # PDF compression toggle
│   └── MergeButton.tsx  # Merge button with progress
├── lib/                # Utility functions
│   ├── utils.ts        # General utilities
│   ├── pdfUtils.ts     # PDF manipulation (merge, download, compression)
│   └── pdfPreview.ts   # PDF preview generation
├── App.tsx             # Main app with state management
└── index.css           # Global styles and theme (including dark mode)

tests/
├── unit/               # Unit tests (78 tests)
│   ├── pdfUtils.test.ts
│   ├── PdfUploader.test.tsx
│   ├── DuplexToggle.test.tsx
│   ├── CompressionToggle.test.tsx
│   └── MergeButton.test.tsx
├── browser/            # Vitest browser tests
│   └── button.browser.test.tsx
├── e2e/               # Playwright E2E tests (14 tests)
│   ├── unite-pdf-happy-path.spec.ts
│   ├── duplex-mode-calculations.spec.ts
│   ├── dark-mode.spec.ts
│   ├── README.md
│   ├── TESTPLAN.md
│   └── TEST_SCENARIOS.md
└── fixtures/          # Sample PDF files for testing
    ├── 1-page.pdf
    ├── 2-pages.pdf
    ├── 3-pages.pdf
    ├── 5-pages.pdf
    └── 10-pages.pdf

.github/
└── workflows/
    └── ci.yml         # GitHub Actions CI/CD
```

## Testing

This project follows **Test-Driven Development (TDD)** principles using **Vitest**.

### Testing Stack

- **Vitest** - Fast, Vite-native test runner
- **jsdom** - DOM environment for unit/integration tests
- **Vitest Browser Mode** - Real browser testing with Playwright
- **Playwright** - E2E and visual regression testing
- **pdf-lib** - PDF manipulation and verification in tests

### Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once (for CI)
pnpm test:run

# Generate coverage reports
pnpm test:coverage

# Interactive test UI
pnpm test:ui
```

### Browser Mode (Optional)

For testing React components in real browsers:

```bash
# Install browser mode dependencies
pnpm add -D @vitest/browser playwright vitest-browser-react

# Uncomment browser config in vite.config.ts

# Run browser tests
pnpm test:browser
```

### Visual Regression Testing

UnitePDF uses Playwright for visual regression testing to ensure pixel-perfect UI:

```bash
# Run visual tests (compares screenshots against baselines)
pnpm test:visual

# First time setup: Generate baseline screenshots
pnpm test:visual:update

# View visual diff reports
pnpm test:report

# Run in UI mode (interactive debugging)
pnpm test:e2e:ui
```

**What gets tested:**
- Homepage at different viewports (mobile, tablet, desktop)
- Component states (default, hover, focus)
- Dark/light mode consistency
- Keyboard navigation focus indicators
- Cross-browser rendering (Chromium, Firefox, WebKit)

### Test Fixtures

Sample PDF files for testing are located in `tests/fixtures/`:

| File | Pages | Parity | Size | Purpose |
|------|-------|--------|------|---------|
| `1-page.pdf` | 1 | Odd | ~1 KB | Single page test case |
| `2-pages.pdf` | 2 | Even | ~1 KB | Even page count test |
| `3-pages.pdf` | 3 | Odd | ~2 KB | Odd page count test |
| `5-pages.pdf` | 5 | Odd | ~2 KB | Larger odd page count |
| `10-pages.pdf` | 10 | Even | ~4 KB | Larger even page count |

Each test PDF contains:
- **Large page numbers (120pt)** centered on each page for easy visual identification
- Header text showing filename and "Page X of Y"
- Footer text indicating "ODD page" or "EVEN page"

This makes it easy to verify that PDFs are merged in the correct order and that duplex printing (blank page insertion) works correctly.

**Regenerating fixtures**: If you need to regenerate the test PDFs, run:
```bash
node scripts/generate-test-pdfs.js
```

## Contributing

We welcome contributions! Please follow these guidelines:

### Before Contributing

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
3. Read the [CLAUDE.md](./CLAUDE.md) file for technical architecture details

### Development Workflow

1. **Write Tests First**: Follow TDD - write tests before implementing features
2. **Implement Feature**: Write the minimum code to make tests pass
3. **Refactor**: Clean up code while keeping tests green
4. **Run All Tests**: Ensure `pnpm test:all` passes
5. **Lint**: Run `pnpm lint` to check code style
6. **Type Check**: Run `pnpm exec tsc -b` to verify TypeScript

### Code Quality Standards

- ✅ Use TypeScript strict mode (already configured)
- ✅ Write meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- ✅ Keep components small and focused (single responsibility)
- ✅ Document complex logic with comments
- ✅ Ensure all tests pass before submitting PR
- ✅ Update documentation when adding features

### Pull Request Process

1. Ensure your code follows the project's code style
2. Update tests to cover your changes
3. Update documentation (README, CLAUDE.md) if needed
4. Test with sample PDFs (both odd and even page counts)
5. Submit a pull request with a clear description of changes

### PR Checklist

- [ ] Tests written and passing (`pnpm test:all`)
- [ ] ESLint passes with no warnings (`pnpm lint`)
- [ ] TypeScript compiles with no errors (`pnpm exec tsc -b`)
- [ ] Manual testing completed with various PDF files
- [ ] Documentation updated if needed
- [ ] Commit messages are clear and descriptive

## Roadmap

- [x] Basic PDF merging functionality
- [x] Duplex printing support with blank page insertion
- [x] Drag-and-drop file reordering
- [x] PDF preview before merging
- [x] Page count tracking for each PDF
- [x] File size information display
- [x] SEO optimization
- [x] Comprehensive E2E testing
- [x] GitHub Actions CI/CD
- [x] Dark mode support with system preference detection
- [x] PDF compression options (Extreme, Recommended, Light)
- [ ] Internationalization (i18n) support
- [ ] PWA support for offline usage

## License

[MIT](LICENSE) - Feel free to use this project for any purpose.

## Support

If you encounter any issues or have questions:

1. Check existing [Issues](https://github.com/yourusername/unitepdf/issues)
2. Create a new issue with detailed information
3. Provide sample PDFs (if relevant) to reproduce the problem

## Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- PDF manipulation powered by [pdf-lib](https://pdf-lib.js.org/)
- Icons from [Lucide](https://lucide.dev/)