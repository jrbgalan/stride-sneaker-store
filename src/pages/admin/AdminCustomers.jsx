import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { formatPrice } from "@/lib/products";
import { Empty } from "@/lib/adminUtils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Search, X, Users, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminCustomers() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    base44.entities.Order.list("-created_date", 500).then((o) => { setOrders(o); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const customers = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const email = o.shipping_address?.email;
      if (!email) return;
      if (!map[email]) map[email] = { name: o.shipping_address?.name || "—", email, orders: 0, spent: 0, joined: o.created_date, address: o.shipping_address };
      map[email].orders += 1;
      map[email].spent += o.total || 0;
      if (new Date(o.created_date) < new Date(map[email].joined)) map[email].joined = o.created_date;
    });
    return Object.values(map).sort((a, b) => b.spent - a.spent);
  }, [orders]);

  const filtered = useMemo(() => {
    if (!q) return customers;
    const ql = q.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(ql) || c.email.toLowerCase().includes(ql));
  }, [customers, q]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground">{customers.length} total</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…" className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-kinetic" />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-2xl shimmer" />)}</div>
      ) : filtered.length === 0 ? (
        <Empty text="No customers yet" icon={Users} />
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="p-4 font-medium">Customer</TableHead>
                  <TableHead className="p-4 font-medium">Orders</TableHead>
                  <TableHead className="p-4 font-medium">Total Spent</TableHead>
                  <TableHead className="p-4 font-medium">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((c) => (
                  <TableRow
                    key={c.email}
                    onClick={() => setDetail(c)}
                    className="cursor-pointer border-b border-border/50 hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-kinetic/10 text-sm font-bold text-kinetic">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">{c.orders}</TableCell>
                    <TableCell className="p-4 font-semibold">{formatPrice(c.spent)}</TableCell>
                    <TableCell className="p-4 text-muted-foreground">
                      {new Date(c.joined).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="grid h-11 w-11 place-items-center rounded-full border border-border disabled:opacity-40" aria-label="Previous page"><ChevronLeft size={16} /></button>
              <span className="text-sm font-medium">{page + 1} / {pageCount}</span>
              <button onClick={() => setPage(Math.min(pageCount - 1, page + 1))} disabled={page === pageCount - 1} className="grid h-11 w-11 place-items-center rounded-full border border-border disabled:opacity-40" aria-label="Next page"><ChevronRight size={16} /></button>
            </div>
          )}
        </>
      )}

      {detail && (
        <div className="fixed inset-0 z-[70] flex justify-end bg-foreground/40 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-background p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold">Customer Details</h2>
              <button onClick={() => setDetail(null)} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-full hover:bg-muted"><X size={22} /></button>
            </div>
            <div className="mb-6 flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-kinetic text-lg font-bold text-white">{detail.name.charAt(0).toUpperCase()}</div>
              <div><p className="font-heading text-lg font-bold">{detail.name}</p><p className="text-sm text-muted-foreground">{detail.email}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border p-4"><p className="font-mono text-[10px] uppercase text-muted-foreground">Orders</p><p className="font-heading text-2xl font-bold">{detail.orders}</p></div>
              <div className="rounded-xl border border-border p-4"><p className="font-mono text-[10px] uppercase text-muted-foreground">Total Spent</p><p className="font-heading text-2xl font-bold">{formatPrice(detail.spent)}</p></div>
            </div>
            <div className="mt-4 rounded-xl border border-border p-4 text-sm">
              <p className="mb-1 font-mono text-[10px] uppercase text-muted-foreground">Shipping Address</p>
              <p className="text-muted-foreground">{detail.address?.address}</p>
              <p className="text-muted-foreground">{detail.address?.city}, {detail.address?.state} {detail.address?.zip}</p>
              <p className="text-muted-foreground">{detail.address?.country}</p>
              <p className="mt-2 text-muted-foreground">{detail.address?.phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}