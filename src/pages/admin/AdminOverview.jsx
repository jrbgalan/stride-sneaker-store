import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Receipt, AlertTriangle, Package } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";
import { StatusPill, Empty, CardSkeleton } from "@/lib/adminUtils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const BRAND_COLORS = ["#FF4B2B", "#0E0E10", "#6B7280", "#16A34A", "#1E40AF", "#F97316", "#EC4899"];

function Sparkline({ data }) {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={data}><Line type="monotone" dataKey="v" stroke="#FF4B2B" strokeWidth={2} dot={false} /></LineChart>
    </ResponsiveContainer>
  );
}

export default function AdminOverview() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30D");

  useEffect(() => {
    Promise.all([
      base44.entities.Order.list("-created_date", 200).catch(() => []),
      base44.entities.Product.list("-created_date", 200).catch(() => []),
    ]).then(([o, p]) => { setOrders(o); setProducts(p); setLoading(false); });
  }, []);

  const revenue = useMemo(() => orders.reduce((s, o) => s + (o.total || 0), 0), [orders]);
  const aov = orders.length ? revenue / orders.length : 0;
  const customers = useMemo(() => new Set(orders.map((o) => o.shipping_address?.email).filter(Boolean)).size, [orders]);

  const days = range === "7D" ? 7 : range === "30D" ? 30 : range === "90D" ? 90 : 365;
  const chartData = useMemo(() => {
    const arr = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(5, 10);
      const dayRev = orders.filter((o) => new Date(o.created_date).toISOString().slice(5, 10) === key).reduce((s, o) => s + (o.total || 0), 0);
      arr.push({ date: key, revenue: dayRev });
    }
    return arr;
  }, [orders, days]);

  const brandData = useMemo(() => {
    const map = {};
    orders.forEach((o) => o.items?.forEach((it) => { map[it.name] = (map[it.name] || 0) + (it.price || 0) * (it.quantity || 0); }));
    if (Object.keys(map).length === 0) products.forEach((p) => { map[p.brand] = (map[p.brand] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value).slice(0, 7);
  }, [orders, products]);

  const topProducts = useMemo(() => [...products].sort((a, b) => (b.review_count || 0) - (a.review_count || 0)).slice(0, 5), [products]);
  const lowStock = useMemo(() => products.filter((p) => (p.stock || 0) <= 5).sort((a, b) => (a.stock || 0) - (b.stock || 0)).slice(0, 5), [products]);
  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);

  const kpis = [
    { label: "Total Revenue", value: formatPrice(revenue), icon: DollarSign, trend: 12.5, up: true, spark: chartData.slice(-7).map((d, i) => ({ v: d.revenue || i * 50 + 20 })) },
    { label: "Orders", value: orders.length, icon: ShoppingCart, trend: 8.2, up: true, spark: chartData.slice(-7).map((d, i) => ({ v: i * 3 + 2 })) },
    { label: "Customers", value: customers, icon: Users, trend: -2.4, up: false, spark: chartData.slice(-7).map((d, i) => ({ v: i * 2 + 1 })) },
    { label: "Avg. Order Value", value: formatPrice(aov), icon: Receipt, trend: 5.1, up: true, spark: chartData.slice(-7).map((d, i) => ({ v: aov * (0.8 + i * 0.05) || i * 30 })) },
  ];

  if (loading) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-kinetic/10 text-kinetic"><k.icon size={20} /></div>
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", k.up ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-destructive/10 text-destructive")}>
                {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {Math.abs(k.trend)}%
              </span>
            </div>
            <p className="mt-4 font-heading text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <div className="mt-2"><Sparkline data={k.spark} /></div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold">Revenue</h2>
            <div className="flex gap-1 rounded-full border border-border p-1">
              {["7D", "30D", "90D", "1Y"].map((r) => (
                <button key={r} onClick={() => setRange(r)} className={cn("flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-3.5 text-xs font-medium transition-colors", range === r ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>{r}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4B2B" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FF4B2B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
              <Area type="monotone" dataKey="revenue" stroke="#FF4B2B" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-heading text-lg font-bold">Sales by Brand</h2>
          {brandData.length === 0 ? <Empty text="No sales data yet" icon={Package} /> : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={brandData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {brandData.map((_, i) => <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {brandData.slice(0, 5).map((b, i) => (
                  <div key={b.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: BRAND_COLORS[i % BRAND_COLORS.length] }} />
                    <span className="flex-1 truncate">{b.name}</span>
                    <span className="font-mono text-muted-foreground">{b.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-heading text-lg font-bold">Top Selling Products</h2>
          {topProducts.length === 0 ? <Empty text="No products yet" icon={Package} /> : (
            <div className="space-y-3">
              {topProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-secondary"><Image src={p.images?.[0]} alt={p.name} fittingType="fit" className="h-full w-full object-contain p-1" /></div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{p.name}</p><p className="font-mono text-[10px] uppercase text-muted-foreground">{p.brand}</p></div>
                  <span className="text-sm font-semibold">{formatPrice(p.sale_price || p.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold"><AlertTriangle size={18} className="text-kinetic" /> Low Stock Alerts</h2>
          {lowStock.length === 0 ? <Empty text="All products well stocked" icon={Package} /> : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <Link to="/admin/products" key={p.id} className="flex min-h-[44px] items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-secondary"><Image src={p.images?.[0]} alt={p.name} fittingType="fit" className="h-full w-full object-contain p-1" /></div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{p.name}</p><p className="font-mono text-[10px] uppercase text-muted-foreground">{p.brand}</p></div>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", (p.stock || 0) === 0 ? "bg-destructive/10 text-destructive" : "bg-kinetic/10 text-kinetic")}>{p.stock || 0} left</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-heading text-lg font-bold">Recent Orders</h2>
        {recentOrders.length === 0 ? <Empty text="No orders yet" icon={ShoppingCart} /> : (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border text-left text-xs">
                  <TableHead className="py-3 font-medium">Order</TableHead>
                  <TableHead className="py-3 font-medium">Customer</TableHead>
                  <TableHead className="py-3 font-medium">Total</TableHead>
                  <TableHead className="py-3 font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((o) => (
                  <TableRow key={o.id} className="border-b border-border/50">
                    <TableCell className="py-3 font-mono text-xs">{o.order_number}</TableCell>
                    <TableCell className="py-3 font-medium">{o.shipping_address?.name || "—"}</TableCell>
                    <TableCell className="py-3 font-semibold">{formatPrice(o.total)}</TableCell>
                    <TableCell className="py-3"><StatusPill status={o.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}