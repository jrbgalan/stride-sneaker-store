import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function SectionHeader({ title, subtitle, to = null, actionLabel = "View all" }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {subtitle && <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{subtitle}</p>}
        <h2 className="font-heading text-2xl font-bold tracking-tightest sm:text-3xl">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="group flex shrink-0 items-center gap-1 text-sm font-medium text-foreground/70 transition-colors hover:text-kinetic">
          {actionLabel}
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}