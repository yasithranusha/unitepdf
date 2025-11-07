import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source - using unpkg for reliability
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

/**
 * Get the number of pages in a PDF file
 */
export async function getPdfPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    return pdf.numPages;
  } catch (error) {
    console.error('Error getting PDF page count:', error);
    return 0;
  }
}

/**
 * Generate a preview image (data URL) for the first page of a PDF
 */
export async function generatePdfPreview(file: File, maxWidth: number = 300): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Get first page
    const page = await pdf.getPage(1);

    // Calculate scale to fit maxWidth
    const viewport = page.getViewport({ scale: 1 });
    const scale = maxWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Could not get canvas context');
    }

    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;

    // Render PDF page to canvas
    await page.render({
      canvasContext: context,
      viewport: scaledViewport,
    } as any).promise;

    // Convert canvas to data URL
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating PDF preview:', error);
    // Return a placeholder or empty string on error
    return '';
  }
}

/**
 * Generate previews for multiple PDF files
 */
export async function generatePdfPreviews(files: File[], maxWidth: number = 300): Promise<Map<string, string>> {
  const previews = new Map<string, string>();

  await Promise.all(
    files.map(async (file) => {
      const preview = await generatePdfPreview(file, maxWidth);
      previews.set(file.name, preview);
    })
  );

  return previews;
}
