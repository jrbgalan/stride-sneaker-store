import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/theme";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Ticket,
  Settings,
  ArrowLeft,
  Menu,
  X,
  Bell,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/promos", label: "Promo Codes", icon: Ticket },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5 border-b border-border/40">
        <div className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold tracking-tightest">AXIS</span>
          <span className="rounded bg-kinetic/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-kinetic">
            Admin
          </span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-muted"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "min-h-[44px] flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <n.icon size={18} /> {n.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          to="/"
          className="min-h-[44px] flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft size={18} /> Back to Store
        </Link>
        <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-kinetic text-sm font-bold text-white shrink-0">
            {(user?.full_name || user?.email || "A").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.full_name || "Admin"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card lg:block">
        {SidebarContent}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-card border-r border-border animate-slide-in-left shadow-2xl">
            {SidebarContent}
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 glass px-4 sm:px-6">
          <button
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-muted -ml-2"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <h1 className="font-heading text-lg font-bold">Dashboard</h1>
          <div className="ml-auto flex items-center gap-1">
            <button
              className="hidden sm:grid min-h-[44px] min-w-[44px] place-items-center rounded-full transition-colors hover:bg-muted"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              className="relative grid min-h-[44px] min-w-[44px] place-items-center rounded-full transition-colors hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-kinetic" />
            </button>
            <button
              onClick={toggle}
              className="grid min-h-[44px] min-w-[44px] place-items-center rounded-full transition-colors hover:bg-muted"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}