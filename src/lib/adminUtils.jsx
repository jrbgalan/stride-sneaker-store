import React from "react";
import { cn } from "@/lib/utils";

export function StatusPill({ status }) {
  const map = {
    Processing: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Shipped: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    Delivered: "bg-green-500/10 text-green-600 dark:text-green-400",
    Cancelled: "bg-destructive/10 text-destructive",
    Refunded: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };
  return <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", map[status] || "bg-secondary text-muted-foreground")}>{status}</span>;
}

export function StockBadge({ stock }) {
  const s = stock || 0;
  const cls = s === 0 ? "bg-destructive/10 text-destructive" : s <= 5 ? "bg-kinetic/10 text-kinetic" : "bg-green-500/10 text-green-600 dark:text-green-400";
  const label = s === 0 ? "Out of stock" : s <= 5 ? "Low stock" : "In stock";
  return <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", cls)}>{label} · {s}</span>;
}

export function Empty({ text = "Nothing here yet", icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
      {Icon && <Icon size={32} className="mb-2 opacity-40" />}
      <p className="text-sm">{text}</p>
    </div>
  );
}

export function CardSkeleton({ lines = 4 }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="mb-4 h-4 w-full rounded shimmer" style={{ width: `${100 - i * 15}%` }} />
      ))}
    </div>
  );
}