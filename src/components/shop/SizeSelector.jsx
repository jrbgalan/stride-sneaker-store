import React from "react";
import { cn } from "@/lib/utils";

/**
 * @param {{ sizes?: (number | string)[], selectedSize?: number | string | null, onSelectSize: (size: number | string) => void, disabledSizes?: (number | string)[], className?: string }} props
 */
export default function SizeSelector({
  sizes = [],
  selectedSize,
  onSelectSize,
  disabledSizes = [],
  className,
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {sizes.map((s) => {
        const isSelected = selectedSize === s;
        const isDisabled = disabledSizes.includes(s);

        return (
          <button
            key={s}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelectSize(s)}
            className={cn(
              "min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl border text-sm font-medium transition-all flex items-center justify-center select-none",
              isSelected
                ? "border-foreground bg-foreground text-background font-bold shadow-sm"
                : isDisabled
                ? "border-border/40 bg-secondary/30 text-muted-foreground/40 line-through cursor-not-allowed"
                : "border-border hover:border-foreground bg-card text-foreground"
            )}
            aria-pressed={isSelected}
            aria-label={`Size ${s}`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
