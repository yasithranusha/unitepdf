import { PDFDocument } from "pdf-lib";

/**
 * Get the page count of a PDF
 */
export async function getPageCount(pdfBytes: Uint8Array): Promise<number> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  return pdfDoc.getPageCount();
}

/**
 * Add a blank page to a PDF if it has an odd number of pages
 * This is useful for duplex printing to ensure proper alignment
 */
export async function addBlankPageIfOdd(pdfBytes: Uint8Array): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pageCount = pdfDoc.getPageCount();

  // Only add blank page if there's an odd number of pages (and at least 1 page)
  if (pageCount > 0 && pageCount % 2 !== 0) {
    // Get the size of the last page to match dimensions
    const lastPage = pdfDoc.getPage(pageCount - 1);
    const { width, height } = lastPage.getSize();

    // Add a blank page with the same dimensions
    pdfDoc.addPage([width, height]);
  }

  return await pdfDoc.save();
}

/**
 * Merge multiple PDF files into a single PDF
 * @param pdfFiles - Array of PDF file bytes to merge
 * @param duplexMode - If true, adds blank pages to PDFs with odd page counts
 * @returns Merged PDF as Uint8Array
 */
export async function mergePdfs(
  pdfFiles: Uint8Array[],
  duplexMode: boolean = false
): Promise<Uint8Array> {
  // Create a new PDF document for the merged result
  const mergedPdf = await PDFDocument.create();

  // Process each PDF file
  for (const pdfBytes of pdfFiles) {
    // Load the PDF
    let pdfDoc = await PDFDocument.load(pdfBytes);

    // Apply duplex mode if enabled (add blank page if odd page count)
    if (duplexMode) {
      const pageCount = pdfDoc.getPageCount();
      if (pageCount > 0 && pageCount % 2 !== 0) {
        // Get the size of the last page
        const lastPage = pdfDoc.getPage(pageCount - 1);
        const { width, height } = lastPage.getSize();
        // Add blank page
        pdfDoc.addPage([width, height]);
      }
    }

    // Copy all pages from the current PDF to the merged PDF
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  // Save and return the merged PDF
  return await mergedPdf.save();
}

/**
 * Convert File objects to Uint8Array for PDF processing
 */
export async function fileToUint8Array(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/**
 * Convert multiple File objects to Uint8Array
 */
export async function filesToUint8Arrays(files: File[]): Promise<Uint8Array[]> {
  return Promise.all(files.map(fileToUint8Array));
}

/**
 * Trigger download of a PDF file
 */
export function downloadPdf(pdfBytes: Uint8Array, filename: string = "merged.pdf"): void {
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  // Clean up the URL object
  URL.revokeObjectURL(url);
}
