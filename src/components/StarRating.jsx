import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({ rating = 0, size = 14, className, showValue = false }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            "transition-colors",
            i <= Math.round(rating) ? "fill-kinetic text-kinetic" : "text-muted-foreground/40"
          )}
        />
      ))}
      {showValue && <span className="ml-1 text-xs font-mono text-muted-foreground">{rating.toFixed(1)}</span>}
    </div>
  );
}