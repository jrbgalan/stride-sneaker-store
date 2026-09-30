import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { BRANDS, CATEGORIES, ALL_SIZES, COLOR_OPTIONS, pctOff, formatPrice } from "@/lib/products";
import { StockBadge, Empty } from "@/lib/adminUtils";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Search, Plus, LayoutGrid, List, Pencil, Copy, Trash2, X, ChevronLeft, ChevronRight, Package } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [fBrand, setFBrand] = useState("");
  const [fStock, setFStock] = useState("");
  const [view, setView] = useState("table");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(null); // null | "new" | product
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = () => {
    setLoading(true);
    base44.entities.Product.list("-created_date", 500).then((p) => { setProducts(p); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let r = [...products];
    if (q) { const ql = q.toLowerCase(); r = r.filter((p) => p.name.toLowerCase().includes(ql) || p.brand.toLowerCase().includes(ql)); }
    if (fBrand) r = r.filter((p) => p.brand === fBrand);
    if (fStock === "out") r = r.filter((p) => (p.stock || 0) === 0);
    if (fStock === "low") r = r.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 5);
    if (fStock === "in") r = r.filter((p) => (p.stock || 0) > 5);
    return r;
  }, [products, q, fBrand, fStock]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const allSelected = pageItems.length > 0 && pageItems.every((p) => selected.includes(p.id));
  const toggleAll = () => setSelected(allSelected ? selected.filter((id) => !pageItems.some((p) => p.id === id)) : [...new Set([...selected, ...pageItems.map((p) => p.id)])]);

  const handleDelete = async (id) => {
    try { await base44.entities.Product.delete(id); setProducts((prev) => prev.filter((p) => p.id !== id)); } catch {}
    setConfirmDelete(null);
  };

  const handleDuplicate = async (p) => {
    const { id: _id, created_date: _cd, updated_date: _ud, created_by_id: _cbid, ...rest } = p;
    try { await base44.entities.Product.create({ ...rest, name: `${p.name} (Copy)`, slug: `${p.slug}-copy-${Date.now().toString().slice(-4)}` }); load(); } catch {}
  };

  const bulkDelete = async () => {
    await Promise.all(selected.map((id) => base44.entities.Product.delete(id).catch(() => {})));
    setSelected([]);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} total</p>
        </div>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-kinetic hover:text-white">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-kinetic" />
        </div>
        <select value={fBrand} onChange={(e) => setFBrand(e.target.value)} className="rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-kinetic">
          <option value="">All brands</option>
          {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={fStock} onChange={(e) => setFStock(e.target.value)} className="rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-kinetic">
          <option value="">All stock</option>
          <option value="in">In stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
        <div className="flex rounded-full border border-border p-1">
          <button onClick={() => setView("table")} className={cn("grid h-8 w-8 place-items-center rounded-full", view === "table" ? "bg-foreground text-background" : "")}><List size={16} /></button>
          <button onClick={() => setView("grid")} className={cn("grid h-8 w-8 place-items-center rounded-full", view === "grid" ? "bg-foreground text-background" : "")}><LayoutGrid size={16} /></button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5">
          <span className="text-sm font-medium">{selected.length} selected</span>
          <button onClick={bulkDelete} className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive hover:underline"><Trash2 size={14} /> Delete selected</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded-2xl shimmer" />)}</div>
      ) : filtered.length === 0 ? (
        <Empty text="No products found" icon={Package} />
      ) : view === "table" ? (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border text-left text-xs text-muted-foreground">
                  <TableHead className="p-4 w-12"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 accent-kinetic" /></TableHead>
                  <TableHead className="p-4 font-medium">Product</TableHead>
                  <TableHead className="p-4 font-medium">Brand</TableHead>
                  <TableHead className="p-4 font-medium">Price</TableHead>
                  <TableHead className="p-4 font-medium">Stock</TableHead>
                  <TableHead className="p-4 font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((p) => (
                  <TableRow key={p.id} className="border-b border-border/50 hover:bg-muted/40">
                    <TableCell className="p-4"><input type="checkbox" checked={selected.includes(p.id)} onChange={() => setSelected((s) => s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id])} className="h-4 w-4 accent-kinetic" /></TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-secondary"><Image src={p.images?.[0]} alt={p.name} fittingType="fit" className="h-full w-full object-contain p-1" /></div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 text-muted-foreground">{p.brand}</TableCell>
                    <TableCell className="p-4">
                      <span className="font-semibold">{formatPrice(p.sale_price || p.price)}</span>
                      {p.on_sale && <span className="ml-1.5 text-xs text-muted-foreground line-through">{formatPrice(p.price)}</span>}
                    </TableCell>
                    <TableCell className="p-4"><StockBadge stock={p.stock} /></TableCell>
                    <TableCell className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(p)} className="min-h-[44px] min-w-[44px] grid place-items-center rounded-xl hover:bg-muted transition-colors" aria-label="Edit"><Pencil size={15} /></button>
                        <button onClick={() => handleDuplicate(p)} className="min-h-[44px] min-w-[44px] grid place-items-center rounded-xl hover:bg-muted transition-colors" aria-label="Duplicate"><Copy size={15} /></button>
                        <button onClick={() => setConfirmDelete(p)} className="min-h-[44px] min-w-[44px] grid place-items-center rounded-xl text-destructive hover:bg-destructive/10 transition-colors" aria-label="Delete"><Trash2 size={15} /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination page={page} pageCount={pageCount} setPage={setPage} />
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {pageItems.map((p) => (
              <div key={p.id} className="group rounded-2xl border border-border bg-card p-3">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
                  <Image src={p.images?.[0]} alt={p.name} fittingType="fit" className="h-full w-full object-contain p-3" />
                  <div className="absolute inset-x-2 bottom-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => setEditing(p)} className="flex-1 min-h-[44px] rounded-full bg-card/90 py-1.5 text-xs font-semibold hover:bg-foreground hover:text-background flex items-center justify-center"><Pencil size={12} className="inline mr-1" /> Edit</button>
                    <button onClick={() => setConfirmDelete(p)} className="flex-1 min-h-[44px] rounded-full bg-card/90 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive hover:text-white flex items-center justify-center"><Trash2 size={12} className="inline mr-1" /> Delete</button>
                  </div>
                </div>
                <p className="mt-2 truncate text-sm font-medium">{p.name}</p>
                <p className="font-mono text-[10px] uppercase text-muted-foreground">{p.brand}</p>
                <div className="mt-1 flex items-center justify-between"><span className="font-semibold text-sm">{formatPrice(p.sale_price || p.price)}</span><StockBadge stock={p.stock} /></div>
              </div>
            ))}
          </div>
          <Pagination page={page} pageCount={pageCount} setPage={setPage} />
        </>
      )}

      {editing && <ProductEditor product={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={load} />}
      {confirmDelete && (
        <ConfirmDialog
          title={`Delete ${confirmDelete.name}?`}
          message="This action cannot be undone."
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

function Pagination({ page, pageCount, setPage }) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="grid min-h-[44px] min-w-[44px] place-items-center rounded-full border border-border disabled:opacity-40 hover:bg-muted transition-colors"><ChevronLeft size={16} /></button>
      <span className="text-sm font-medium px-2">{page + 1} / {pageCount}</span>
      <button onClick={() => setPage(Math.min(pageCount - 1, page + 1))} disabled={page === pageCount - 1} className="grid min-h-[44px] min-w-[44px] place-items-center rounded-full border border-border disabled:opacity-40 hover:bg-muted transition-colors"><ChevronRight size={16} /></button>
    </div>
  );
}

function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-foreground/40 backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 animate-scale-in shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-heading text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onCancel} className="flex-1 min-h-[44px] rounded-full border border-border py-2.5 text-sm font-semibold hover:bg-muted">Cancel</button>
          <button onClick={onConfirm} className="flex-1 min-h-[44px] rounded-full bg-destructive py-2.5 text-sm font-semibold text-white hover:opacity-90">Delete</button>
        </div>
      </div>
    </div>
  );
}

function ProductEditor({ product, onClose, onSaved }) {
  const [form, setForm] = useState(product ? { ...product } : { name: "", slug: "", brand: BRANDS[0], category: CATEGORIES[0], gender: "Unisex", price: 0, sale_price: 0, on_sale: false, stock: 0, sizes: [7, 8, 9, 10, 11], colors: [], images: [], description: "", details: "", sku: "", weight: "", featured: false, best_seller: false, trending: false, new_arrival: true, rating: 4.5, review_count: 0 });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const off = pctOff(form.price, form.sale_price);

  const save = async () => {
    setSaving(true);
    const payload = { ...form, slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), on_sale: form.sale_price > 0 && form.sale_price < form.price };
    try {
      if (product?.id) await base44.entities.Product.update(product.id, payload);
      else await base44.entities.Product.create(payload);
      onSaved(); onClose();
    } catch { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full w-full max-w-lg overflow-y-auto bg-background animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <h2 className="font-heading text-xl font-bold">{product ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} aria-label="Close"><X size={22} /></button>
        </div>
        {dirty && <div className="bg-kinetic/10 px-6 py-2 text-xs font-medium text-kinetic">You have unsaved changes</div>}
        <div className="space-y-6 p-6">
          <Section title="Basic Info">
            <Field label="Name"><input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} /></Field>
            <Field label="Slug"><input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" className={inputCls} /></Field>
            <Field label="Brand"><select value={form.brand} onChange={(e) => set("brand", e.target.value)} className={inputCls}>{BRANDS.map((b) => <option key={b}>{b}</option>)}</select></Field>
            <Field label="Category"><select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Gender"><select value={form.gender} onChange={(e) => set("gender", e.target.value)} className={inputCls}>{["Men", "Women", "Kids", "Unisex"].map((g) => <option key={g}>{g}</option>)}</select></Field>
            <Field label="Description"><textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={inputCls} /></Field>
          </Section>

          <Section title="Pricing">
            <Field label="Price ($"><input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} className={inputCls} /></Field>
            <Field label="Sale Price ($)"><input type="number" value={form.sale_price} onChange={(e) => set("sale_price", Number(e.target.value))} className={inputCls} /></Field>
            {off > 0 && <p className="text-sm font-semibold text-kinetic">{off}% OFF preview</p>}
          </Section>

          <Section title="Sizes & Stock">
            <Field label="Total Stock"><input type="number" value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} className={inputCls} /></Field>
            <Field label="Sizes">
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map((s) => (
                  <button key={s} type="button" onClick={() => set("sizes", form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s])} className={cn("h-9 w-9 rounded-lg border text-sm font-medium", form.sizes.includes(s) ? "border-foreground bg-foreground text-background" : "border-border")}>{s}</button>
                ))}
              </div>
            </Field>
          </Section>

          <Section title="Colors">
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => {
                const sel = form.colors.some((x) => x.name === c.name);
                return (
                  <button key={c.name} type="button" onClick={() => set("colors", sel ? form.colors.filter((x) => x.name !== c.name) : [...form.colors, c])} className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs", sel ? "border-kinetic" : "border-border")}>
                    <span className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: c.hex }} /> {c.name}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Images">
            <Field label="Image URLs (one per line)">
              <textarea value={(form.images || []).join("\n")} onChange={(e) => set("images", e.target.value.split("\n").filter(Boolean))} rows={3} className={inputCls} placeholder="https://…" />
            </Field>
            {form.images?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.images.map((img, i) => (
                  <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg bg-secondary">
                    <img src={img} alt="" className="h-full w-full object-contain p-1" />
                    <button onClick={() => set("images", form.images.filter((_, j) => j !== i))} className="absolute right-0 top-0 grid h-5 w-5 place-items-center bg-destructive text-white"><X size={10} /></button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Flags">
            <div className="flex flex-wrap gap-4">
              {[["featured", "Featured"], ["best_seller", "Best Seller"], ["trending", "Trending"], ["new_arrival", "New Arrival"]].map(([k, l]) => (
                <label key={k} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form[k]} onChange={(e) => set(k, e.target.checked)} className="h-4 w-4 accent-kinetic" /> {l}</label>
              ))}
            </div>
          </Section>
        </div>
        <div className="sticky bottom-0 flex gap-3 border-t border-border bg-background px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-full border border-border py-3 text-sm font-semibold hover:bg-muted">Cancel</button>
          <button onClick={save} disabled={saving} className="flex-1 rounded-full bg-foreground py-3 text-sm font-semibold text-background hover:bg-kinetic hover:text-white disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-kinetic";

function Section({ title, children }) {
  return <div><h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{title}</h3><div className="space-y-3">{children}</div></div>;
}
function Field({ label, children }) {
  return <div><label className="mb-1.5 block text-sm font-medium">{label}</label>{children}</div>;
}