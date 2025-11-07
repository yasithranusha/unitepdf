import { Loader2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MergeButtonProps {
  fileCount: number;
  onMerge: () => void;
  isLoading?: boolean;
  progress?: number;
}

export function MergeButton({ fileCount, onMerge, isLoading = false, progress = 0 }: MergeButtonProps) {
  const isDisabled = fileCount === 0 || isLoading;

  return (
    <div className="space-y-4">
      {/* Merge Button - Primary Action with Gradient and Glow */}
      <Button
        onClick={onMerge}
        disabled={isDisabled}
        size="lg"
        className={cn(
          "w-full text-base font-semibold relative overflow-hidden group shadow-lg transition-all",
          !isDisabled && "btn-glow bg-gradient-to-r from-primary to-primary/90 hover:shadow-xl hover:shadow-primary/50 hover:scale-[1.02]"
        )}
        aria-label={isLoading ? "Merging PDFs in progress" : `Merge ${fileCount} PDF${fileCount !== 1 ? "s" : ""}`}
      >
        {/* Animated gradient background on hover */}
        {!isDisabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent-foreground to-primary opacity-0 group-hover:opacity-20 transition-opacity" />
        )}

        <span className="relative flex items-center justify-center">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Merging PDFs...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-5 w-5" />
              Merge {fileCount} PDF{fileCount !== 1 ? "s" : ""}
            </>
          )}
        </span>
      </Button>

      {/* Progress Indicator */}
      {isLoading && (
        <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border">
          <Progress value={progress} aria-label="Merge progress" className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Processing...</span>
            <span className="font-semibold text-primary">{progress}%</span>
          </div>
        </div>
      )}

      {/* Help text */}
      {!isLoading && fileCount === 0 && (
        <div className="text-center p-6 rounded-lg bg-muted/30 border-2 border-dashed">
          <p className="text-sm text-muted-foreground">
            Upload PDF files to begin merging
          </p>
        </div>
      )}
    </div>
  );
}
