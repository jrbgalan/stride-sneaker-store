import React from "react";
import { BRANDS, CATEGORIES, ALL_SIZES, COLOR_OPTIONS } from "@/lib/products";
import SizeSelector from "@/components/shop/SizeSelector";
import { cn } from "@/lib/utils";

/**
 * @param {{ brand?: string[], category?: string[], gender?: string[], sale?: boolean, size?: number | null, color?: string | null, maxPrice?: number, onSetParam: (key: string, val: any) => void, onSetMaxPrice: (val: number) => void, className?: string }} props
 */
export default function FilterSidebar({
  brand = [],
  category = [],
  gender = [],
  sale = false,
  size = null,
  color = null,
  maxPrice = 300,
  onSetParam,
  onSetMaxPrice,
  className,
}) {
  return (
    <div className={cn("space-y-6", className)}>
      <FilterGroup title="Brand">
        <div className="space-y-1">
          {BRANDS.map((b) => (
            <label
              key={b}
              className="flex min-h-[44px] cursor-pointer items-center gap-3 py-1 text-sm font-medium hover:text-kinetic transition-colors"
            >
              <input
                type="checkbox"
                checked={brand.includes(b)}
                onChange={() => onSetParam("brand", brand.includes(b) ? null : b)}
                className="h-5 w-5 rounded accent-kinetic"
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Category">
        <div className="space-y-1">
          {CATEGORIES.map((c) => (
            <label
              key={c}
              className="flex min-h-[44px] cursor-pointer items-center gap-3 py-1 text-sm font-medium hover:text-kinetic transition-colors"
            >
              <input
                type="checkbox"
                checked={category.includes(c)}
                onChange={() =>
                  onSetParam("category", category.includes(c) ? null : c)
                }
                className="h-5 w-5 rounded accent-kinetic"
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Gender">
        <div className="space-y-1">
          {["Men", "Women", "Kids"].map((g) => (
            <label
              key={g}
              className="flex min-h-[44px] cursor-pointer items-center gap-3 py-1 text-sm font-medium hover:text-kinetic transition-colors"
            >
              <input
                type="checkbox"
                checked={gender.includes(g)}
                onChange={() =>
                  onSetParam("gender", gender.includes(g) ? null : g)
                }
                className="h-5 w-5 rounded accent-kinetic"
              />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Max Price">
        <input
          type="range"
          min={50}
          max={300}
          step={10}
          value={maxPrice}
          onChange={(e) => onSetMaxPrice(Number(e.target.value))}
          className="w-full accent-kinetic min-h-[44px] cursor-pointer"
          aria-label="Filter by maximum price"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>$50</span>
          <span className="font-bold text-foreground text-sm">${maxPrice}</span>
          <span>$300</span>
        </div>
      </FilterGroup>

      <FilterGroup title="Size">
        <SizeSelector
          sizes={ALL_SIZES}
          selectedSize={size}
          onSelectSize={(s) => onSetParam("size", size === s ? null : s)}
        />
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-2.5">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => onSetParam("color", color === c.name ? null : c.name)}
              title={c.name}
              aria-label={c.name}
              className={cn(
                "min-h-[44px] min-w-[44px] rounded-full border-2 transition-all flex items-center justify-center",
                color === c.name
                  ? "border-kinetic scale-110 shadow-md ring-2 ring-kinetic/30"
                  : "border-border hover:scale-105"
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Offers">
        <label className="flex min-h-[44px] cursor-pointer items-center gap-3 py-1 text-sm font-medium hover:text-kinetic transition-colors">
          <input
            type="checkbox"
            checked={sale}
            onChange={() => onSetParam("sale", sale ? null : "true")}
            className="h-5 w-5 rounded accent-kinetic"
          />
          <span>On Sale Only</span>
        </label>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}
