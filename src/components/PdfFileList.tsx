import { useState, useCallback } from "react";
import { GripVertical, X, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface PdfFileListProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export function PdfFileList({ files, onFilesChange, onRemove }: PdfFileListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverIndex(index);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      e.preventDefault();
      e.stopPropagation();

      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      const newFiles = [...files];
      const [draggedFile] = newFiles.splice(draggedIndex, 1);
      newFiles.splice(dropIndex, 0, draggedFile);

      onFilesChange(newFiles);
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [files, draggedIndex, onFilesChange]
  );

  // Empty state
  if (files.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 mb-4 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            No files uploaded yet
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Upload PDF files to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* File count header with gradient */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Uploaded Files
            </h3>
            <p className="text-xs text-muted-foreground">
              {files.length} PDF{files.length !== 1 ? "s" : ""} ready to merge
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="font-semibold">
          {files.length}
        </Badge>
      </div>

      {/* File list with scroll */}
      <ScrollArea className="h-[calc(100vh-400px)] max-h-[600px] pr-4">
        <div className="space-y-2">
          {files.map((file, index) => (
            <Card
              key={`${file.name}-${index}`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                handleDragStart(index);
              }}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              data-dragging={draggedIndex === index ? "true" : undefined}
              className={cn(
                "transition-all duration-200 cursor-move hover:shadow-md relative overflow-hidden",
                draggedIndex === index && "opacity-50 scale-95",
                dragOverIndex === index && draggedIndex !== index && "border-primary bg-gradient-to-r from-primary/5 to-transparent shadow-lg scale-[1.02]"
              )}
            >
              {/* Gradient accent on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />

              <CardContent className="flex items-center gap-3 p-4 relative">
                {/* Drag handle */}
                <div
                  data-testid="drag-handle"
                  className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
                >
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* File icon with gradient background */}
                <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <p className="text-xs text-muted-foreground">
                      Position {index + 1}
                    </p>
                  </div>
                </div>

                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                  }}
                  aria-label={`Remove ${file.name}`}
                  className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
