import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "@/lib/products";
import { cn } from "@/lib/utils";

export default function CategoryChips({ active, onSelect }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1">
      <button
        onClick={() => onSelect?.("All")}
        className={cn("inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border px-5 py-2 text-sm font-medium transition-all", active === "All" || !active ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground")}
      >
        All
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => onSelect?.(c)}
          className={cn("inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border px-5 py-2 text-sm font-medium transition-all", active === c ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground")}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export function CategoryChipsLinks() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <CategoryChips />
      <div className="mt-3 text-center">
        <Link to="/shop" className="inline-flex min-h-[44px] items-center text-sm font-medium text-muted-foreground hover:text-kinetic">Browse all categories →</Link>
      </div>
    </section>
  );
}