import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const { pathname } = useLocation();
  const { cartCount, wishlist, setMiniCartOpen, miniCartOpen } = useStore();

  const items = [
    {
      to: "/",
      icon: Home,
      label: "Home",
      isActive: (p) => p === "/",
    },
    {
      to: "/shop",
      icon: LayoutGrid,
      label: "Shop",
      isActive: (p) => p.startsWith("/shop") || p.startsWith("/product/"),
    },
    {
      to: "/wishlist",
      icon: Heart,
      label: "Wishlist",
      badge: wishlist.length,
      isActive: (p) => p.startsWith("/wishlist"),
    },
    {
      action: () => setMiniCartOpen(true),
      icon: ShoppingBag,
      label: "Cart",
      badge: cartCount,
      isCart: true,
      isActive: (p) => miniCartOpen || p.startsWith("/cart"),
    },
    {
      to: "/account",
      icon: User,
      label: "Profile",
      isActive: (p) =>
        p.startsWith("/account") ||
        p.startsWith("/profile") ||
        p.startsWith("/login") ||
        p.startsWith("/register"),
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass bg-background/95 border-t border-border shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: "max(0.25rem, env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="flex items-stretch justify-around px-1 max-w-lg mx-auto">
        {items.map((it) => {
          const active = it.isActive(pathname);
          const Icon = it.icon;

          const content = (
            <span
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 w-full min-h-[54px] py-1.5 transition-all duration-200 select-none",
                active ? "text-kinetic font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active top indicator pill */}
              {active && (
                <span className="absolute top-0.5 h-1 w-7 rounded-full bg-kinetic shadow-sm animate-scale-in" />
              )}

              <span className="relative flex items-center justify-center">
                <Icon
                  size={20}
                  className={cn(
                    "transition-transform duration-200",
                    active && "scale-110"
                  )}
                  strokeWidth={active ? 2.3 : 1.8}
                />

                {/* Badge */}
                {it.badge > 0 && (
                  <span
                    data-cart-badge={it.isCart ? "" : undefined}
                    className="absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-kinetic px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-background"
                  >
                    {it.badge > 99 ? "99+" : it.badge}
                  </span>
                )}
              </span>

              <span
                className={cn(
                  "text-[10px] tracking-tight leading-none",
                  active ? "font-bold text-kinetic" : "font-medium"
                )}
              >
                {it.label}
              </span>
            </span>
          );

          if (it.to) {
            return (
              <Link
                key={it.label}
                to={it.to}
                className="flex-1 min-w-[44px] min-h-[54px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic rounded-lg"
                aria-label={it.label}
                aria-current={active ? "page" : undefined}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={it.label}
              type="button"
              onClick={it.action}
              data-cart-target={it.isCart}
              className="flex-1 min-w-[44px] min-h-[54px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic rounded-lg"
              aria-label={`${it.label} (${cartCount} items)`}
              aria-pressed={active}
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}