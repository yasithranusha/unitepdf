/**
 * Script to generate test PDF fixtures with visible page numbers
 * Run with: node scripts/generate-test-pdfs.js
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createPDFWithPages(pageCount, filename) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 1; i <= pageCount; i++) {
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();

    // Draw large page number in center
    const fontSize = 120;
    const text = `${i}`;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = fontSize;

    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - textHeight / 2,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Draw smaller text at top with PDF name
    const smallFontSize = 14;
    const smallText = `${filename} - Page ${i} of ${pageCount}`;
    const smallTextWidth = font.widthOfTextAtSize(smallText, smallFontSize);

    page.drawText(smallText, {
      x: width / 2 - smallTextWidth / 2,
      y: height - 50,
      size: smallFontSize,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Draw footer with page parity info
    const footerText = `${i % 2 === 0 ? 'EVEN' : 'ODD'} page`;
    const footerWidth = font.widthOfTextAtSize(footerText, smallFontSize);

    page.drawText(footerText, {
      x: width / 2 - footerWidth / 2,
      y: 30,
      size: smallFontSize,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  return pdfDoc;
}

async function generateAllTestPDFs() {
  console.log('🔨 Generating test PDF fixtures...\n');

  const testCases = [
    { pages: 1, filename: '1-page.pdf', description: 'Single page (odd)' },
    { pages: 2, filename: '2-pages.pdf', description: 'Two pages (even)' },
    { pages: 3, filename: '3-pages.pdf', description: 'Three pages (odd)' },
    { pages: 5, filename: '5-pages.pdf', description: 'Five pages (odd)' },
    { pages: 10, filename: '10-pages.pdf', description: 'Ten pages (even)' },
  ];

  const outputDir = join(__dirname, '..', 'tests', 'fixtures');

  for (const testCase of testCases) {
    const pdfDoc = await createPDFWithPages(testCase.pages, testCase.filename);
    const pdfBytes = await pdfDoc.save();
    const outputPath = join(outputDir, testCase.filename);

    writeFileSync(outputPath, pdfBytes);

    const sizeKB = (pdfBytes.length / 1024).toFixed(2);
    console.log(`✅ Created ${testCase.filename.padEnd(15)} - ${testCase.description.padEnd(20)} (${sizeKB} KB)`);
  }

  console.log('\n✨ All test PDFs generated successfully!');
  console.log(`📁 Location: tests/fixtures/`);
}

// Run the generator
generateAllTestPDFs().catch(console.error);
