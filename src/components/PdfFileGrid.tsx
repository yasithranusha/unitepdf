import { useState, useEffect } from "react";
import { FileText, X, GripVertical, Loader2, FileStack } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { generatePdfPreview, getPdfPageCount } from "@/lib/pdfPreview";

interface PdfFileGridProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onRemove: (index: number) => void;
  onPageCountsChange?: (pageCounts: Map<string, number>) => void;
}

export function PdfFileGrid({ files, onFilesChange, onRemove, onPageCountsChange }: PdfFileGridProps) {
  const [previews, setPreviews] = useState<Map<string, string>>(new Map());
  const [pageCounts, setPageCounts] = useState<Map<string, number>>(new Map());
  const [loadingPreviews, setLoadingPreviews] = useState<Set<string>>(new Set());
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Generate previews and get page counts when files change
  useEffect(() => {
    const generatePreviewsAndCounts = async () => {
      for (const file of files) {
        if (!previews.has(file.name) && !loadingPreviews.has(file.name)) {
          setLoadingPreviews((prev) => new Set(prev).add(file.name));

          // Generate preview and get page count in parallel
          const [preview, pageCount] = await Promise.all([
            generatePdfPreview(file, 400),
            getPdfPageCount(file)
          ]);

          setPreviews((prev) => new Map(prev).set(file.name, preview));
          setPageCounts((prev) => new Map(prev).set(file.name, pageCount));

          setLoadingPreviews((prev) => {
            const next = new Set(prev);
            next.delete(file.name);
            return next;
          });
        }
      }
    };

    generatePreviewsAndCounts();
  }, [files]);

  // Notify parent when page counts change
  useEffect(() => {
    if (onPageCountsChange) {
      onPageCountsChange(pageCounts);
    }
  }, [pageCounts, onPageCountsChange]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newFiles = [...files];
      const [draggedFile] = newFiles.splice(draggedIndex, 1);
      newFiles.splice(dragOverIndex, 0, draggedFile);
      onFilesChange(newFiles);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (files.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-4">
            <FileText className="h-16 w-16 text-primary/70" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No PDFs uploaded yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Upload PDF files using the area above to start merging
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Uploaded PDFs</h2>
          <p className="text-sm text-muted-foreground">
            {files.length} file{files.length !== 1 ? "s" : ""} ready to merge
          </p>
        </div>
        <Badge variant="secondary" className="text-base px-3 py-1">
          {files.length}
        </Badge>
      </div>

      {/* Grid of PDF cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {files.map((file, index) => {
          const preview = previews.get(file.name);
          const pageCount = pageCounts.get(file.name);
          const isLoading = loadingPreviews.has(file.name);
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;

          return (
            <Card
              key={`${file.name}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              data-dragging={isDragging || undefined}
              className={cn(
                "group relative overflow-hidden transition-all cursor-move",
                "bg-card/80 backdrop-blur-sm shadow-md border-primary/10",
                "hover:shadow-xl hover:scale-[1.02] hover:border-primary/30",
                isDragging && "opacity-50 scale-95",
                isDragOver && "ring-2 ring-primary shadow-primary/20 scale-105"
              )}
            >
              {/* Drag handle indicator */}
              <div className="absolute top-2 left-2 z-10 p-1.5 rounded-md bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Remove button */}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
              </Button>

              <CardContent className="p-0">
                {/* PDF Preview */}
                <div className="aspect-[2/3] bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center relative overflow-hidden">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-xs text-muted-foreground">Loading preview...</p>
                    </div>
                  ) : preview ? (
                    <img
                      src={preview}
                      alt={`Preview of ${file.name}`}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <FileText className="h-16 w-16 text-muted-foreground/30" />
                  )}

                  {/* Position badge */}
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>

                {/* File info */}
                <div className="p-2 space-y-0.5 border-t">
                  <p className="font-medium text-xs truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    {pageCount !== undefined && pageCount > 0 && (
                      <span className="flex items-center gap-1 font-medium text-primary">
                        <FileStack className="h-3 w-3" />
                        {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
