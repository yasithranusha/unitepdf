import { Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type CompressionLevel = "extreme" | "recommended" | "light";

interface CompressionToggleProps {
  enabled: boolean;
  level: CompressionLevel;
  onEnabledChange: (enabled: boolean) => void;
  onLevelChange: (level: CompressionLevel) => void;
}

export function CompressionToggle({
  enabled,
  level,
  onEnabledChange,
  onLevelChange,
}: CompressionToggleProps) {
  return (
    <div className="rounded-lg bg-gradient-to-r from-muted/30 to-transparent border">
      {/* Main toggle section */}
      <div className="flex items-start justify-between gap-4 p-4">
        {/* Label and description */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <label
              htmlFor="compression-toggle"
              className="text-sm font-semibold leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              PDF Compression
            </label>

            {/* Info tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  data-testid="compression-tooltip-trigger"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="More information about PDF compression"
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="text-sm">
                  Reduces the file size of your merged PDF by optimizing images and removing
                  unnecessary data. Choose a compression level that balances file size and
                  quality based on your needs.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <p className="text-xs text-muted-foreground">
            Reduce file size by compressing images and content
          </p>
        </div>

        {/* Switch */}
        <Switch
          id="compression-toggle"
          checked={enabled}
          onCheckedChange={onEnabledChange}
          aria-label="Enable PDF compression"
        />
      </div>

      {/* Compression level options - shown when enabled */}
      {enabled && (
        <div className="px-4 pb-4 pt-2 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Compression Level
          </p>
          <RadioGroup
            value={level}
            onValueChange={(value) => onLevelChange(value as CompressionLevel)}
            className="space-y-3"
          >
            {/* Extreme Compression */}
            <div className="flex items-start gap-3">
              <RadioGroupItem value="extreme" id="compression-extreme" className="mt-0.5" />
              <div className="flex-1">
                <Label
                  htmlFor="compression-extreme"
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  Extreme Compression
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Extreme compression information"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">Less quality, high compress</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Maximum file size reduction
                </p>
              </div>
            </div>

            {/* Recommended Compression */}
            <div className="flex items-start gap-3">
              <RadioGroupItem value="recommended" id="compression-recommended" className="mt-0.5" />
              <div className="flex-1">
                <Label
                  htmlFor="compression-recommended"
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  Recommended Compression
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Recommended compression information"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">Good quality, good compression</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Balanced quality and size
                </p>
              </div>
            </div>

            {/* Light Compression */}
            <div className="flex items-start gap-3">
              <RadioGroupItem value="light" id="compression-light" className="mt-0.5" />
              <div className="flex-1">
                <Label
                  htmlFor="compression-light"
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  Light Compression
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Light compression information"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">High quality, less compression</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Preserve maximum quality
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
