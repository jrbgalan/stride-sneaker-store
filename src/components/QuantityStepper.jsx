import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuantityStepper({ value, onChange, min = 1, max = 99, className }) {
  return (
    <div className={cn("inline-flex items-center rounded-full border border-border bg-card shadow-sm", className)}>
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="min-h-[44px] min-w-[44px] grid place-items-center rounded-full transition-colors hover:bg-muted active:scale-95 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic"
      >
        <Minus size={15} />
      </button>
      <span className="w-9 text-center text-sm font-mono font-semibold tabular-nums select-none">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="min-h-[44px] min-w-[44px] grid place-items-center rounded-full transition-colors hover:bg-muted active:scale-95 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}