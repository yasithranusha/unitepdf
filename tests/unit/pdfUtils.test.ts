import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { mergePdfs, getPageCount, addBlankPageIfOdd } from "@/lib/pdfUtils";

describe("PDF Utils - Core Functionality", () => {
  // Helper to create a test PDF with specific page count
  async function createTestPdf(pageCount: number): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    for (let i = 0; i < pageCount; i++) {
      pdfDoc.addPage([595, 842]); // A4 size
    }
    return await pdfDoc.save();
  }

  describe("getPageCount", () => {
    it("should return correct page count for single page PDF", async () => {
      const pdfBytes = await createTestPdf(1);
      const pageCount = await getPageCount(pdfBytes);
      expect(pageCount).toBe(1);
    });

    it("should return correct page count for multi-page PDF", async () => {
      const pdfBytes = await createTestPdf(5);
      const pageCount = await getPageCount(pdfBytes);
      expect(pageCount).toBe(5);
    });

  });

  describe("addBlankPageIfOdd", () => {
    it("should add blank page to PDF with odd page count", async () => {
      const originalPdf = await createTestPdf(3); // 3 pages (odd)
      const modifiedPdf = await addBlankPageIfOdd(originalPdf);

      const pageCount = await getPageCount(modifiedPdf);
      expect(pageCount).toBe(4); // Should now have 4 pages
    });

    it("should not add blank page to PDF with even page count", async () => {
      const originalPdf = await createTestPdf(4); // 4 pages (even)
      const modifiedPdf = await addBlankPageIfOdd(originalPdf);

      const pageCount = await getPageCount(modifiedPdf);
      expect(pageCount).toBe(4); // Should still have 4 pages
    });

    it("should add blank page to single page PDF", async () => {
      const originalPdf = await createTestPdf(1);
      const modifiedPdf = await addBlankPageIfOdd(originalPdf);

      const pageCount = await getPageCount(modifiedPdf);
      expect(pageCount).toBe(2);
    });

  });

  describe("mergePdfs", () => {
    it("should merge two PDFs", async () => {
      const pdf1 = await createTestPdf(2);
      const pdf2 = await createTestPdf(3);

      const merged = await mergePdfs([pdf1, pdf2]);
      const pageCount = await getPageCount(merged);

      expect(pageCount).toBe(5); // 2 + 3 = 5 pages
    });

    it("should merge multiple PDFs in correct order", async () => {
      const pdf1 = await createTestPdf(1);
      const pdf2 = await createTestPdf(2);
      const pdf3 = await createTestPdf(3);

      const merged = await mergePdfs([pdf1, pdf2, pdf3]);
      const pageCount = await getPageCount(merged);

      expect(pageCount).toBe(6); // 1 + 2 + 3 = 6 pages
    });

    it("should handle single PDF", async () => {
      const pdf1 = await createTestPdf(5);

      const merged = await mergePdfs([pdf1]);
      const pageCount = await getPageCount(merged);

      expect(pageCount).toBe(5);
    });

    it("should return empty PDF for empty array", async () => {
      const merged = await mergePdfs([]);
      // An empty merge creates a valid but empty PDF structure
      expect(merged).toBeInstanceOf(Uint8Array);
      expect(merged.length).toBeGreaterThan(0); // Has PDF structure
    });

    it("should merge PDFs with duplex mode enabled", async () => {
      const pdf1 = await createTestPdf(3); // Odd - will get blank page
      const pdf2 = await createTestPdf(2); // Even - no blank page
      const pdf3 = await createTestPdf(1); // Odd - will get blank page

      const merged = await mergePdfs([pdf1, pdf2, pdf3], true); // duplex enabled
      const pageCount = await getPageCount(merged);

      // 3 -> 4, 2 -> 2, 1 -> 2 = 8 total pages
      expect(pageCount).toBe(8);
    });

    it("should merge PDFs without duplex mode", async () => {
      const pdf1 = await createTestPdf(3);
      const pdf2 = await createTestPdf(2);
      const pdf3 = await createTestPdf(1);

      const merged = await mergePdfs([pdf1, pdf2, pdf3], false); // duplex disabled
      const pageCount = await getPageCount(merged);

      // 3 + 2 + 1 = 6 total pages (no blank pages added)
      expect(pageCount).toBe(6);
    });
  });
});
