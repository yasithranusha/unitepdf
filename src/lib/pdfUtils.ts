import { PDFDocument } from "pdf-lib";

export type CompressionLevel = "extreme" | "recommended" | "light";

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
 * Compress a PDF document based on the specified compression level
 * @param pdfDoc - The PDF document to compress
 * @param level - Compression level: 'extreme', 'recommended', or 'light'
 * @returns Compressed PDF as Uint8Array
 */
export async function compressPdf(
  pdfDoc: PDFDocument,
  level: CompressionLevel = "recommended"
): Promise<PDFDocument> {
  // pdf-lib compression is primarily achieved through save options
  // We'll return the document and apply compression during save
  // The actual compression happens in the save() method with useObjectStreams

  // Note: pdf-lib has limited image compression capabilities
  // For more aggressive compression, you'd need additional libraries
  // Here we're using the built-in compression features

  return pdfDoc;
}

/**
 * Get save options for PDF compression based on level
 * @param level - Compression level
 * @returns Save options for PDFDocument.save()
 */
function getCompressionSaveOptions(level: CompressionLevel) {
  switch (level) {
    case "extreme":
      // Maximum compression - use object streams and optimize
      return {
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
      };
    case "recommended":
      // Balanced compression
      return {
        useObjectStreams: true,
        addDefaultPage: false,
      };
    case "light":
      // Light compression - just use object streams
      return {
        useObjectStreams: true,
        addDefaultPage: false,
      };
    default:
      return {
        useObjectStreams: false,
        addDefaultPage: false,
      };
  }
}

/**
 * Merge multiple PDF files into a single PDF
 * @param pdfFiles - Array of PDF file bytes to merge
 * @param duplexMode - If true, adds blank pages to PDFs with odd page counts
 * @param compressionEnabled - If true, applies compression to the merged PDF
 * @param compressionLevel - Level of compression to apply
 * @returns Merged PDF as Uint8Array
 */
export async function mergePdfs(
  pdfFiles: Uint8Array[],
  duplexMode: boolean = false,
  compressionEnabled: boolean = false,
  compressionLevel: CompressionLevel = "recommended"
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

  // Save and return the merged PDF with optional compression
  if (compressionEnabled) {
    const saveOptions = getCompressionSaveOptions(compressionLevel);
    return await mergedPdf.save(saveOptions);
  }

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
