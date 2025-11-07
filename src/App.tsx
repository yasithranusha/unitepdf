import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { PdfUploader } from "@/components/PdfUploader";
import { PdfFileGrid } from "@/components/PdfFileGrid";
import { DuplexToggle } from "@/components/DuplexToggle";
import { CompressionToggle } from "@/components/CompressionToggle";
import type { CompressionLevel } from "@/components/CompressionToggle";
import { MergeButton } from "@/components/MergeButton";
import { filesToUint8Arrays, mergePdfs, downloadPdf } from "@/lib/pdfUtils";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCounts, setPageCounts] = useState<Map<string, number>>(new Map());
  const [duplexEnabled, setDuplexEnabled] = useState(false);
  const [compressionEnabled, setCompressionEnabled] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("recommended");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedPdf, setMergedPdf] = useState<Uint8Array | null>(null);
  const [mergedPdfSize, setMergedPdfSize] = useState<number | null>(null);

  // Reset merged PDF state
  const resetMergedState = () => {
    setMergedPdf(null);
    setMergedPdfSize(null);
  };

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    resetMergedState();
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    resetMergedState();
  };

  // Handle settings changes - reset merged state
  const handleDuplexChange = (enabled: boolean) => {
    setDuplexEnabled(enabled);
    resetMergedState();
  };

  const handleCompressionEnabledChange = (enabled: boolean) => {
    setCompressionEnabled(enabled);
    resetMergedState();
  };

  const handleCompressionLevelChange = (level: CompressionLevel) => {
    setCompressionLevel(level);
    resetMergedState();
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Calculate total size of all uploaded files
  const calculateTotalSize = (): number => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  // Calculate total pages based on current files and duplex mode
  const calculateTotalPages = () => {
    if (files.length === 0) return 0;

    let total = 0;
    files.forEach((file) => {
      const pageCount = pageCounts.get(file.name) || 0;
      total += pageCount;
    });

    // In duplex mode, add blank pages for odd-numbered PDFs (except the last one)
    if (duplexEnabled) {
      files.forEach((file, index) => {
        const pageCount = pageCounts.get(file.name) || 0;
        // Add 1 blank page if this PDF has odd pages and it's not the last PDF
        if (pageCount % 2 === 1 && index < files.length - 1) {
          total += 1;
        }
      });
    }

    return total;
  };

  const handleMerge = async () => {
    if (files.length === 0) return;

    setIsLoading(true);
    setProgress(0);

    try {
      // Convert files to Uint8Array
      setProgress(20);
      const pdfBytes = await filesToUint8Arrays(files);

      // Merge PDFs
      setProgress(50);
      const mergedPdfBytes = await mergePdfs(
        pdfBytes,
        duplexEnabled,
        compressionEnabled,
        compressionLevel
      );

      setProgress(80);

      // Store merged PDF and size
      setMergedPdf(mergedPdfBytes);
      setMergedPdfSize(mergedPdfBytes.length);

      setProgress(100);
      setIsLoading(false);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      setIsLoading(false);
      setProgress(0);
      resetMergedState();
      alert("Failed to merge PDFs. Please try again.");
    }
  };

  const handleDownload = () => {
    if (!mergedPdf) return;

    const timestamp = new Date().toISOString().slice(0, 10);
    downloadPdf(mergedPdf, `merged-${timestamp}.pdf`);

    // Don't clear anything - let user download multiple times if needed
    // State will be cleared when files change or settings are modified
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        {/* Header with GitHub Link */}
        <Header />

        <div className="container mx-auto p-4 md:p-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent-foreground bg-clip-text text-transparent pb-2">
              Merge PDF for Duplex Printing
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Combine multiple PDF files with automatic blank page insertion for odd pages. Perfect for double-sided printing. Fast, secure, and 100% browser-based.
            </p>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Free online tool to merge PDFs and add blank pages to ensure even page counts for duplex printing mode
            </p>
          </div>

          {/* Main Content - 3/4 Split Layout */}
          <main className="grid lg:grid-cols-4 gap-8">
            {/* Left Column - File Management (3 columns) */}
            <div className="space-y-6 lg:col-span-3">
              {/* Uploader */}
              {files.length === 0 ? (
                <PdfUploader onFilesSelected={handleFilesSelected} />
              ) : (
                <div className="p-6 border-2 border-dashed rounded-xl border-primary/30 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:scale-[1.01] transition-all shadow-md">
                  <label className="flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      multiple
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files || []);
                        if (newFiles.length > 0) {
                          handleFilesSelected(newFiles);
                        }
                      }}
                      className="hidden"
                    />
                    <span className="text-base font-semibold text-primary">+ Add more PDFs</span>
                  </label>
                </div>
              )}

              {/* File Grid with Previews */}
              <PdfFileGrid
                files={files}
                onFilesChange={setFiles}
                onRemove={handleRemoveFile}
                onPageCountsChange={setPageCounts}
              />
            </div>

            {/* Right Column - Controls (1 column, Sticky) */}
            <div className="space-y-6 lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
              {/* Controls Card */}
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/95 backdrop-blur shadow-2xl">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 animate-gradient pointer-events-none" />

                <div className="relative p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold mb-1">Merge Settings</h2>
                    <p className="text-xs text-muted-foreground">Configure your PDF merge</p>
                  </div>

                  {/* Duplex Toggle */}
                  {files.length > 0 && (
                    <DuplexToggle enabled={duplexEnabled} onChange={handleDuplexChange} />
                  )}

                  {/* Compression Toggle */}
                  {files.length > 0 && (
                    <CompressionToggle
                      enabled={compressionEnabled}
                      level={compressionLevel}
                      onEnabledChange={handleCompressionEnabledChange}
                      onLevelChange={handleCompressionLevelChange}
                    />
                  )}

                  {/* Continue/Download Button */}
                  {!mergedPdf ? (
                    <MergeButton
                      fileCount={files.length}
                      onMerge={handleMerge}
                      isLoading={isLoading}
                      progress={progress}
                    />
                  ) : (
                    <button
                      onClick={handleDownload}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Merged PDF
                    </button>
                  )}

                  {/* Summary */}
                  {files.length > 0 && (
                    <div className="pt-6 border-t space-y-3">
                      <h3 className="text-sm font-semibold">Summary</h3>
                      <div className="space-y-2">
                        {/* Input Information */}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total PDFs:</span>
                          <span className="font-bold text-primary">{files.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total pages:</span>
                          <span className="font-bold text-primary">{calculateTotalPages()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Input size:</span>
                          <span className="font-bold text-primary">{formatFileSize(calculateTotalSize())}</span>
                        </div>

                        {/* Settings Status */}
                        <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                          <span className="text-muted-foreground">Duplex mode:</span>
                          <span className="font-bold text-foreground">
                            {duplexEnabled ? "✓ Enabled" : "✗ Disabled"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Compression:</span>
                          <span className="font-bold text-foreground">
                            {compressionEnabled ? `✓ ${compressionLevel.charAt(0).toUpperCase() + compressionLevel.slice(1)}` : "✗ Disabled"}
                          </span>
                        </div>

                        {/* Output Information - Highlighted */}
                        {mergedPdfSize !== null && (
                          <div className="pt-3 mt-2 border-t border-primary/20">
                            <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-semibold text-green-900 dark:text-green-100">Output size:</span>
                              </div>
                              <span className="font-bold text-green-600 dark:text-green-400">{formatFileSize(mergedPdfSize)}</span>
                            </div>
                            {/* Size comparison */}
                            {compressionEnabled && (
                              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                                <span>Compression savings:</span>
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                  {((1 - mergedPdfSize / calculateTotalSize()) * 100).toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="text-center text-sm p-4 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm rounded-xl border border-primary/10 shadow-md">
                <p className="font-semibold mb-1">🔒 Private & Secure</p>
                <p className="text-xs text-muted-foreground">
                  All processing happens in your browser. Your files never leave your device.
                </p>
              </div>
            </div>
          </main>

          {/* SEO Content Section */}
          <section className="mt-16 max-w-4xl mx-auto space-y-8 text-sm text-muted-foreground">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Merge PDF Files for Perfect Duplex Printing</h2>
              <p>
                UnitePDF is a free, browser-based tool designed to merge multiple PDF files with automatic blank page insertion
                for duplex (double-sided) printing. When printing documents on both sides of the page, it's crucial that each
                PDF starts on the front side of a new sheet. Our tool automatically adds blank pages to PDFs with odd page
                counts, ensuring perfect alignment for duplex printing.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">How to Merge PDFs for Duplex Printing</h2>
              <ol className="list-decimal list-inside space-y-2 pl-4">
                <li>Upload multiple PDF files by dragging and dropping or clicking the upload area</li>
                <li>Reorder PDFs by dragging them into your desired sequence</li>
                <li>Enable "Duplex Mode" to automatically add blank pages after odd-page PDFs</li>
                <li>View the total page count including inserted blank pages</li>
                <li>Click "Merge PDFs" to combine all files into a single document</li>
                <li>Download your merged PDF ready for double-sided printing</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Why Add Blank Pages for Duplex Printing?</h2>
              <p>
                When printing duplex (both sides of paper), printers alternate between front and back sides. If you merge
                PDFs without considering page counts, a document ending on an odd page will cause the next document to start
                on the back of a page instead of the front. By adding blank pages to odd-numbered PDFs, each document
                maintains proper pagination for double-sided printing.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Key Features</h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Automatic Blank Page Insertion:</strong> Adds blank pages to odd-page PDFs when duplex mode is enabled</li>
                <li><strong>100% Browser-Based:</strong> No server upload required - all processing happens locally in your browser</li>
                <li><strong>Privacy-Focused:</strong> Your PDF files never leave your device, ensuring complete data privacy</li>
                <li><strong>Free and Open Source:</strong> Completely free to use with no hidden costs or subscriptions</li>
                <li><strong>PDF Preview:</strong> View the first page of each PDF before merging</li>
                <li><strong>Page Count Tracking:</strong> See individual and total page counts, adjusted for duplex mode</li>
                <li><strong>Drag and Drop:</strong> Easily reorder PDFs by dragging them to the desired position</li>
                <li><strong>No File Size Limits:</strong> Merge large PDFs without restrictions</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Perfect For</h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Preparing documents for duplex printing</li>
                <li>Combining multiple PDF chapters or sections</li>
                <li>Creating booklets with proper page alignment</li>
                <li>Office document management and printing</li>
                <li>Academic papers and thesis preparation</li>
                <li>Business reports and presentations</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
