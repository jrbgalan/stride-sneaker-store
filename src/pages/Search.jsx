import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ProductGrid from "@/components/ProductGrid";
import { Search as SearchIcon, X } from "lucide-react";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [input, setInput] = useState(q);
  const [all, setAll] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setInput(q);
    base44.entities.Product.list("-created_date", 200)
      .then((p) => {
        setAll(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    setRecent(JSON.parse(localStorage.getItem("axis-recent-searches") || "[]"));
  }, [q]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const ql = q.toLowerCase();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(ql) ||
        p.brand.toLowerCase().includes(ql) ||
        p.category.toLowerCase().includes(ql)
    );
  }, [all, q]);

  const submit = (e) => {
    e?.preventDefault();
    const val = input.trim();
    if (!val) return;
    const recs = [val, ...recent.filter((r) => r.toLowerCase() !== val.toLowerCase())].slice(0, 6);
    localStorage.setItem("axis-recent-searches", JSON.stringify(recs));
    setParams({ q: val });
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
      <form onSubmit={submit} className="relative mx-auto max-w-2xl">
        <SearchIcon
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search sneakers, brands, categories…"
          className="w-full min-h-[50px] rounded-full border border-border bg-card py-3 sm:py-4 pl-12 pr-4 text-base sm:text-lg outline-none focus:border-kinetic shadow-sm"
        />
      </form>

      {!q && (
        <div className="mx-auto mt-8 max-w-2xl">
          {recent.length > 0 && (
            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Recent searches
              </p>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setInput(r);
                      setParams({ q: r });
                    }}
                    className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <span>{r}</span>
                    <X size={13} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-8">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Popular
            </p>
            <div className="flex flex-wrap gap-2">
              {["Nike", "Jordan", "Running", "On Sale", "Adidas Samba"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setInput(s);
                    setParams({ q: s });
                  }}
                  className="min-h-[44px] inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-kinetic transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {q && (
        <div className="mt-8">
          <p className="mb-6 text-sm text-muted-foreground">
            {loading ? "Searching…" : `${results.length} results for "${q}"`}
          </p>
          {results.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-heading text-2xl font-bold">No results found</p>
              <p className="mt-2 text-muted-foreground">Try a different search term</p>
            </div>
          ) : (
            <ProductGrid products={results} columns={4} />
          )}
        </div>
      )}
    </div>
  );
}