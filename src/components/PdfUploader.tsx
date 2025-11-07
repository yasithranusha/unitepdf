import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

export function PdfUploader({ onFilesSelected }: PdfUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const filterPdfFiles = (files: FileList | File[]): File[] => {
    const fileArray = Array.from(files);
    return fileArray.filter((file) => file.type === "application/pdf");
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const pdfFiles = filterPdfFiles(files);
        if (pdfFiles.length > 0) {
          onFilesSelected(pdfFiles);
        }
      }
    },
    [onFilesSelected]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragActive(false);

      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        const pdfFiles = filterPdfFiles(files);
        if (pdfFiles.length > 0) {
          onFilesSelected(pdfFiles);
        }
      }
    },
    [onFilesSelected]
  );

  return (
    <div
      data-testid="dropzone"
      data-drag-active={isDragActive}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center w-full min-h-72 p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer overflow-hidden shadow-lg",
        isDragActive
          ? "border-primary bg-gradient-to-br from-primary/15 via-primary/8 to-transparent scale-[1.02] shadow-xl border-primary/50"
          : "border-primary/20 hover:border-primary/40 hover:shadow-xl bg-gradient-to-br from-card/80 via-card/70 to-card/60 backdrop-blur-sm hover:scale-[1.01]"
      )}
    >
      {/* Animated gradient background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent transition-opacity",
        isDragActive ? "opacity-100" : "opacity-0"
      )} />

      <label
        htmlFor="file-upload"
        className="relative flex flex-col items-center justify-center w-full h-full cursor-pointer z-10"
      >
        <div className={cn(
          "p-4 rounded-full mb-4 transition-all",
          isDragActive
            ? "bg-primary/20 scale-110"
            : "bg-primary/10"
        )}>
          <Upload
            className={cn(
              "w-10 h-10 transition-colors",
              isDragActive ? "text-primary" : "text-primary/70"
            )}
          />
        </div>
        <p className="mb-2 text-xl font-semibold text-foreground">
          Upload PDF Files
        </p>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Drag and drop PDF files here, or click to browse
        </p>
        <p className="mt-3 text-xs text-muted-foreground px-4 py-1.5 bg-muted/50 rounded-full">
          Multiple files supported
        </p>
      </label>

      <input
        id="file-upload"
        type="file"
        accept=".pdf,application/pdf"
        multiple
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Upload PDF files"
      />
    </div>
  );
}
