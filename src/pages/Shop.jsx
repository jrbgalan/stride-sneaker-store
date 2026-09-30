import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { CATEGORIES } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/shop/FilterSidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, LayoutGrid, List, ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "new", label: "Newest" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Biggest Discount" },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(300);

  const brand = params.get("brand") ? [params.get("brand")] : [];
  const category = params.get("category") ? [params.get("category")] : [];
  const sale = params.get("sale") === "true";
  const q = params.get("q") || "";
  const sort = params.get("sort") || "featured";
  const gender = params.get("gender") ? [params.get("gender")] : [];
  const size = params.get("size") ? Number(params.get("size")) : null;
  const color = params.get("color");

  useEffect(() => {
    setLoading(true);
    base44.entities.Product.list("-created_date", 200)
      .then((p) => {
        setAll(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const setParam = (key, val) => {
    const next = new URLSearchParams(params);
    if (val === null || val === undefined || val === "") next.delete(key);
    else next.set(key, val);
    setParams(next);
  };

  const handleCategoryChip = (cat) => {
    if (cat === "All") {
      setParam("category", null);
    } else if (category.includes(cat)) {
      setParam("category", null);
    } else {
      setParam("category", cat);
    }
  };

  const filtered = useMemo(() => {
    let r = [...all];
    if (brand.length) r = r.filter((p) => brand.includes(p.brand));
    if (category.length) r = r.filter((p) => category.includes(p.category));
    if (gender.length) r = r.filter((p) => gender.includes(p.gender) || p.gender === "Unisex");
    if (sale) r = r.filter((p) => p.on_sale);
    if (q) {
      const ql = q.toLowerCase();
      r = r.filter(
        (p) =>
          p.name.toLowerCase().includes(ql) ||
          p.brand.toLowerCase().includes(ql) ||
          p.category.toLowerCase().includes(ql)
      );
    }
    if (size) r = r.filter((p) => p.sizes?.includes(size));
    if (color) r = r.filter((p) => p.colors?.some((c) => c.name === color));
    r = r.filter((p) => (p.sale_price || p.price) <= maxPrice);

    switch (sort) {
      case "price-asc":
        r.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
        break;
      case "price-desc":
        r.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
        break;
      case "rating":
        r.sort((a, b) => b.rating - a.rating);
        break;
      case "new":
        r.sort(
          (a, b) =>
            new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
        );
        break;
      case "discount":
        r.sort(
          (a, b) =>
            b.price -
            (b.sale_price || b.price) -
            (a.price - (a.sale_price || a.price))
        );
        break;
      default:
        r.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return r;
  }, [all, brand, category, gender, sale, q, size, color, maxPrice, sort]);

  const activeChips = [
    ...brand.map((b) => ({ label: b, key: "brand" })),
    ...category.map((c) => ({ label: c, key: "category" })),
    ...gender.map((g) => ({ label: g, key: "gender" })),
    ...(size ? [{ label: `Size ${size}`, key: "size" }] : []),
    ...(color ? [{ label: color, key: "color" }] : []),
    ...(sale ? [{ label: "On Sale", key: "sale" }] : []),
  ];

  const clearAll = () =>
    setParams(q ? new URLSearchParams({ q }) : new URLSearchParams());

  const activeFilterCount = activeChips.length + (maxPrice < 300 ? 1 : 0);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>Home</span> / <span className="text-foreground font-medium">Shop</span>
      </nav>

      {/* Header & Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tightest sm:text-4xl">
            {q ? `Results for "${q}"` : sale ? "On Sale" : "All Products"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Loading…" : `Showing ${filtered.length} of ${all.length} products`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium hover:border-kinetic lg:hidden transition-colors"
            aria-label="Open filters drawer"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge className="grid h-5 min-w-5 place-items-center rounded-full bg-kinetic px-1.5 text-[11px] font-bold text-white border-none">
                {activeFilterCount}
              </Badge>
            )}
          </button>

          {/* Sort dropdown with at least 44px tap target */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              aria-label="Sort products by"
              className="min-h-[44px] appearance-none rounded-full border border-border bg-card py-2.5 pl-4 pr-10 text-sm font-medium outline-none focus:border-kinetic cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>

          {/* View toggle (Grid / List) */}
          <div className="hidden sm:flex rounded-full border border-border p-1 bg-card">
            <button
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={cn(
                "min-h-[36px] min-w-[36px] grid place-items-center rounded-full transition-colors",
                view === "grid"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              aria-label="List view"
              onClick={() => setView("list")}
              className={cn(
                "min-h-[36px] min-w-[36px] grid place-items-center rounded-full transition-colors",
                view === "list"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontally scrollable category chips */}
      <div className="mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => handleCategoryChip("All")}
            className={cn(
              "shrink-0 min-h-[44px] px-5 py-2.5 rounded-full text-sm font-medium transition-all select-none flex items-center justify-center",
              category.length === 0
                ? "border-foreground bg-foreground text-background font-bold shadow-sm"
                : "border border-border bg-card text-foreground hover:border-foreground"
            )}
          >
            All Categories
          </button>
          {CATEGORIES.map((c) => {
            const isSelected = category.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => handleCategoryChip(c)}
                className={cn(
                  "shrink-0 min-h-[44px] px-5 py-2.5 rounded-full text-sm font-medium transition-all select-none flex items-center justify-center",
                  isSelected
                    ? "border-foreground bg-foreground text-background font-bold shadow-sm"
                    : "border border-border bg-card text-foreground hover:border-foreground"
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <AnimatePresence mode="popLayout">
            {activeChips.map((c) => (
              <motion.button
                key={`${c.key}-${c.label}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                onClick={() => setParam(c.key, null)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-secondary/80 px-4 py-2 text-xs font-semibold hover:bg-muted transition-colors"
              >
                <span>{c.label}</span>
                <X size={13} className="text-muted-foreground hover:text-foreground" />
              </motion.button>
            ))}
          </AnimatePresence>
          <motion.button
            layout
            onClick={clearAll}
            className="min-h-[44px] inline-flex items-center px-3 text-xs font-semibold text-kinetic hover:underline"
          >
            Clear all
          </motion.button>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <h2 className="font-heading font-bold text-base">Filters</h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs font-medium text-kinetic hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <FilterSidebar
              brand={brand}
              category={category}
              gender={gender}
              sale={sale}
              size={size}
              color={color}
              maxPrice={maxPrice}
              onSetParam={setParam}
              onSetMaxPrice={setMaxPrice}
            />
          </div>
        </aside>

        {/* Product Grid / List Section */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <ProductGrid products={[]} loading columns={4} />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-heading text-2xl font-bold">No shoes found</p>
              <p className="mt-2 text-muted-foreground">Try adjusting or clearing your filters</p>
              <Button
                onClick={clearAll}
                className="mt-6 min-h-[44px] rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background hover:bg-kinetic hover:text-white transition-colors border-none"
              >
                Clear all filters
              </Button>
            </div>
          ) : view === "grid" ? (
            <ProductGrid products={filtered} columns={4} />
          ) : (
            <div className="space-y-4">
              {filtered.map((p) => (
                <a
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="flex gap-3 sm:gap-4 rounded-2xl border border-border bg-card p-3 sm:p-4 transition-all hover:shadow-md hover:border-foreground/20"
                >
                  <div className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-secondary">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <div className="flex flex-1 flex-col min-w-0 justify-center">
                    <span className="font-mono text-[9px] sm:text-[10px] uppercase text-muted-foreground">
                      {p.brand}
                    </span>
                    <h3 className="font-heading text-base sm:text-lg font-medium truncate">
                      {p.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {p.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-semibold text-sm sm:text-base">
                        ${(p.sale_price || p.price).toFixed(0)}
                      </span>
                      {p.on_sale && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${p.price}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Slide-Up Bottom Drawer for Mobile Filters (using shadcn/ui Sheet) */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] max-h-[85vh] rounded-t-3xl border-t border-border bg-background p-0 flex flex-col shadow-2xl"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
        >
          {/* Drawer Handle */}
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted-foreground/30 shrink-0" />

          {/* Drawer Header */}
          <SheetHeader className="border-b border-border px-6 py-4 flex flex-row items-center justify-between space-y-0 text-left">
            <div className="flex items-center gap-2">
              <SheetTitle className="font-heading text-xl font-bold text-foreground">Filters</SheetTitle>
              {activeFilterCount > 0 && (
                <Badge className="bg-kinetic text-white font-bold text-xs rounded-full px-2 py-0.5 border-none">
                  {activeFilterCount}
                </Badge>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="min-h-[44px] px-3 inline-flex items-center text-xs font-semibold text-kinetic hover:underline"
              >
                <RotateCcw size={13} className="mr-1" /> Reset
              </button>
            )}
          </SheetHeader>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6">
            <FilterSidebar
              brand={brand}
              category={category}
              gender={gender}
              sale={sale}
              size={size}
              color={color}
              maxPrice={maxPrice}
              onSetParam={setParam}
              onSetMaxPrice={setMaxPrice}
            />
          </div>

          {/* Drawer Footer with prominent "Apply" Button */}
          <div className="border-t border-border bg-card/80 p-4 glass">
            <Button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="w-full min-h-[48px] rounded-full bg-foreground py-3.5 text-sm font-bold text-background transition-colors hover:bg-kinetic hover:text-white shadow-lg active:scale-[0.99] border-none"
            >
              Apply Filters ({filtered.length} Results)
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}