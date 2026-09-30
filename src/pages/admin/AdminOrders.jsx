import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { formatPrice } from "@/lib/products";
import { StatusPill, Empty } from "@/lib/adminUtils";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Search, Download, X, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;
const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState(null);

  const load = () => {
    setLoading(true);
    base44.entities.Order.list("-created_date", 500).then((o) => { setOrders(o); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let r = [...orders];
    if (q) { const ql = q.toLowerCase(); r = r.filter((o) => o.order_number?.toLowerCase().includes(ql) || o.shipping_address?.name?.toLowerCase().includes(ql)); }
    if (fStatus) r = r.filter((o) => o.status === fStatus);
    return r;
  }, [orders, q, fStatus]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const exportCSV = () => {
    const rows = [["Order", "Customer", "Email", "Date", "Items", "Total", "Status"]];
    filtered.forEach((o) => rows.push([o.order_number, o.shipping_address?.name || "", o.shipping_address?.email || "", new Date(o.created_date).toLocaleDateString(), (o.items || []).length, o.total, o.status]));
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "orders.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const updateStatus = async (id, status) => {
    try { await base44.entities.Order.update(id, { status }); load(); setDetail((d) => d?.id === id ? { ...d, status } : d); } catch {}
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">{orders.length} total</p>
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by order # or customer…" className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-kinetic" />
        </div>
        <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-kinetic">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 rounded-2xl shimmer" />)}</div>
      ) : filtered.length === 0 ? (
        <Empty text="No orders found" icon={ShoppingCart} />
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="p-4 font-medium">Order</TableHead>
                  <TableHead className="p-4 font-medium">Customer</TableHead>
                  <TableHead className="p-4 font-medium">Date</TableHead>
                  <TableHead className="p-4 font-medium">Items</TableHead>
                  <TableHead className="p-4 font-medium">Total</TableHead>
                  <TableHead className="p-4 font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((o) => (
                  <TableRow
                    key={o.id}
                    onClick={() => setDetail(o)}
                    className="cursor-pointer border-b border-border/50 hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="p-4 font-mono text-xs">{o.order_number}</TableCell>
                    <TableCell className="p-4 font-medium">{o.shipping_address?.name || "—"}</TableCell>
                    <TableCell className="p-4 text-muted-foreground">
                      {new Date(o.created_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="p-4">{(o.items || []).length}</TableCell>
                    <TableCell className="p-4 font-semibold">{formatPrice(o.total)}</TableCell>
                    <TableCell className="p-4">
                      <StatusPill status={o.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="grid min-h-[44px] min-w-[44px] place-items-center rounded-full border border-border disabled:opacity-40 hover:bg-muted transition-colors"><ChevronLeft size={16} /></button>
              <span className="text-sm font-medium px-2">{page + 1} / {pageCount}</span>
              <button onClick={() => setPage(Math.min(pageCount - 1, page + 1))} disabled={page === pageCount - 1} className="grid min-h-[44px] min-w-[44px] place-items-center rounded-full border border-border disabled:opacity-40 hover:bg-muted transition-colors"><ChevronRight size={16} /></button>
            </div>
          )}
        </>
      )}

      {detail && <OrderDetail order={detail} onClose={() => setDetail(null)} onStatus={updateStatus} />}
    </div>
  );
}

function OrderDetail({ order, onClose, onStatus }) {
  const timeline = ["Processing", "Shipped", "Delivered"];
  const cancelled = order.status === "Cancelled";
  const currentIdx = timeline.indexOf(order.status);

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full w-full max-w-lg overflow-y-auto bg-background animate-slide-in-left shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div>
            <h2 className="font-heading text-xl font-bold">{order.order_number}</h2>
            <p className="text-xs text-muted-foreground">{new Date(order.created_date).toLocaleString()}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-muted transition-colors -mr-2"><X size={22} /></button>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Items</h3>
            <div className="space-y-3">
              {order.items?.map((it, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-secondary"><img src={it.image} alt={it.name} className="h-full w-full object-contain p-1" /></div>
                  <div className="flex-1"><p className="text-sm font-medium">{it.name}</p><p className="text-xs text-muted-foreground">Size {it.size} · {it.color} · ×{it.quantity}</p></div>
                  <span className="text-sm font-semibold">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-border p-4"><p className="mb-1 font-mono text-[10px] uppercase text-muted-foreground">Customer</p><p className="font-medium">{order.shipping_address?.name}</p><p className="text-muted-foreground">{order.shipping_address?.email}</p><p className="text-muted-foreground">{order.shipping_address?.phone}</p></div>
            <div className="rounded-xl border border-border p-4"><p className="mb-1 font-mono text-[10px] uppercase text-muted-foreground">Shipping Address</p><p className="text-muted-foreground">{order.shipping_address?.address}</p><p className="text-muted-foreground">{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zip}</p><p className="text-muted-foreground">{order.shipping_address?.country}</p></div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-kinetic"><span>Discount</span><span>−{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(order.tax)}</span></div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>

          <div>
            <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Status Timeline</h3>
            {cancelled ? (
              <p className="text-sm font-semibold text-destructive">Order cancelled</p>
            ) : (
              <div className="flex items-center gap-2">
                {timeline.map((s, i) => (
                  <div key={s} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className={cn("grid h-8 w-8 place-items-center rounded-full text-xs font-semibold", i <= currentIdx ? "bg-kinetic text-white" : "bg-secondary text-muted-foreground")}>{i + 1}</div>
                    <span className={cn("text-[10px]", i <= currentIdx ? "text-foreground font-medium" : "text-muted-foreground")}>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Update Status</h3>
            <select value={order.status} onChange={(e) => onStatus(order.id, e.target.value)} className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-kinetic">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}