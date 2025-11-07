import { Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DuplexToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function DuplexToggle({ enabled, onChange }: DuplexToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-gradient-to-r from-muted/30 to-transparent border">
      {/* Label and description */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <label
            htmlFor="duplex-toggle"
            className="text-sm font-semibold leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Duplex Printing
          </label>

          {/* Info tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                data-testid="tooltip-trigger"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="More information about duplex printing"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="text-sm">
                Adds a blank page after PDFs with odd page counts. This ensures proper
                alignment when printing double-sided, preventing content from different
                documents appearing on opposite sides of the same sheet.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <p className="text-xs text-muted-foreground">
          Add blank pages for PDFs with odd page counts
        </p>
      </div>

      {/* Switch */}
      <Switch
        id="duplex-toggle"
        checked={enabled}
        onCheckedChange={onChange}
        aria-label="Enable duplex printing mode"
      />
    </div>
  );
}
