# PDF Merger

A modern, browser-based PDF merging tool that allows you to combine multiple PDF files into a single document with support for duplex printing optimization.

## Features

- 🔄 **Merge Multiple PDFs**: Combine multiple PDF files into one document
- 📄 **Duplex Printing Support**: Automatically add blank pages to PDFs with odd page counts for proper double-sided printing
- 🌐 **100% Browser-Based**: All processing happens in your browser - no server uploads required
- 🎨 **Modern UI**: Built with React and Tailwind CSS for a clean, responsive interface
- 🔒 **Privacy-First**: Your files never leave your device

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite (via Rolldown)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **PDF Library**: pdf-lib (for browser-based PDF manipulation)
- **Testing**: Vitest + Playwright
- **Package Manager**: pnpm

## Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/proj-pdf.git
cd proj-pdf
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

# Run unit tests
pnpm test

# Run unit tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Run all tests
pnpm test:all

# Regenerate test PDF fixtures (if needed)
node scripts/generate-test-pdfs.js
```

### Project Structure

```
src/
├── components/        # React components
│   ├── ui/           # shadcn/ui components
│   ├── PdfUploader/  # PDF upload component
│   └── PdfMerger/    # Main merging logic
├── lib/              # Utility functions
│   ├── pdf-utils/    # PDF manipulation utilities
│   └── duplex-utils/ # Duplex printing logic
├── hooks/            # Custom React hooks
└── types/            # TypeScript type definitions

tests/
├── unit/             # Unit tests
├── integration/      # Integration tests
├── e2e/             # End-to-end tests
└── fixtures/        # Sample PDF files for testing
```

## Testing

This project follows **Test-Driven Development (TDD)** principles.

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# All tests
pnpm test:all
```

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
- [ ] Duplex printing support with blank page insertion
- [ ] Drag-and-drop file reordering
- [ ] PDF preview before merging
- [ ] Page range selection for each PDF
- [ ] Dark mode support
- [ ] Internationalization (i18n)
- [ ] PDF compression options
- [ ] Batch processing support

## License

[MIT](LICENSE) - Feel free to use this project for any purpose.

## Support

If you encounter any issues or have questions:

1. Check existing [Issues](https://github.com/yourusername/proj-pdf/issues)
2. Create a new issue with detailed information
3. Provide sample PDFs (if relevant) to reproduce the problem

## Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- PDF manipulation powered by [pdf-lib](https://pdf-lib.js.org/)
- Icons from [Lucide](https://lucide.dev/)