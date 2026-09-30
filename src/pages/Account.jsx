import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { Image } from "@/components/ui/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Package, Heart, MapPin, Settings, LogOut, ShoppingBag } from "lucide-react";

export default function Account() {
  const { wishlist } = useWishlist();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then((u) => { setUser(u); }).catch(() => {});
    base44.entities.Order.list("-created_date", 50)
      .then((o) => setOrders(o))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Profile", icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary font-heading text-2xl font-bold">
          {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tightest">
            {user?.full_name || "Account"}
          </h1>
          <p className="text-sm text-muted-foreground">{user?.email || "Guest user"}</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="flex flex-col gap-2">
            <TabsList className="no-scrollbar -mx-4 flex h-auto gap-2 overflow-x-auto bg-transparent p-1 px-4 lg:mx-0 lg:flex-col lg:items-stretch lg:px-0">
              {tabs.map((t) => (
                <TabsTrigger
                  key={t.id}
                  value={t.id}
                  className={cn(
                    "inline-flex min-h-[44px] shrink-0 items-center justify-start gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors border border-transparent",
                    "data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-sm",
                    "data-[state=inactive]:hover:bg-muted data-[state=inactive]:text-foreground/80"
                  )}
                >
                  <t.icon size={18} /> {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex gap-2 lg:flex-col pt-2 border-t border-border/60">
              {user?.role === "admin" && (
                <Button
                  asChild
                  variant="ghost"
                  className="inline-flex min-h-[44px] shrink-0 items-center justify-start gap-2.5 rounded-xl bg-kinetic/10 px-4 py-2.5 text-sm font-medium text-kinetic hover:bg-kinetic/20 hover:text-kinetic"
                >
                  <Link to="/admin">
                    <Settings size={18} /> Admin Dashboard
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => base44.auth.logout("/")}
                className="inline-flex min-h-[44px] shrink-0 items-center justify-start gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut size={18} /> Logout
              </Button>
            </div>
          </aside>

          <div className="min-w-0">
            <TabsContent value="orders" className="mt-0">
              <div>
                <h2 className="mb-5 font-heading text-2xl font-bold">My Orders</h2>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 rounded-2xl w-full" />
                    <Skeleton className="h-32 rounded-2xl w-full" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="rounded-2xl border border-border p-12 text-center bg-card">
                    <ShoppingBag size={40} className="mx-auto text-muted-foreground/40" />
                    <p className="mt-4 text-muted-foreground">No orders yet</p>
                    <Link to="/shop" className="mt-4 inline-block font-semibold text-kinetic hover:underline">
                      Start shopping →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div key={o.id} className="rounded-2xl border border-border bg-card p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                          <div>
                            <p className="font-mono text-sm font-semibold">{o.order_number}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(o.created_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold border-none",
                              o.status === "Delivered"
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : o.status === "Shipped"
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                : "bg-kinetic/10 text-kinetic"
                            )}
                          >
                            {o.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 pt-3">
                          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0">
                            {(o.items || []).slice(0, 4).map((it, i) => (
                              <div
                                key={i}
                                className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl bg-secondary"
                              >
                                <img
                                  src={it.image}
                                  alt={it.name}
                                  className="h-full w-full object-contain p-1"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="ml-auto shrink-0 flex flex-col justify-center text-right pl-2">
                            <span className="text-xs text-muted-foreground">Total</span>
                            <span className="font-semibold">${(o.total || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="wishlist" className="mt-0">
              <div>
                <h2 className="mb-5 font-heading text-2xl font-bold">Wishlist</h2>
                {wishlist.length === 0 ? (
                  <p className="text-muted-foreground">
                    Your wishlist is empty.{" "}
                    <Link to="/shop" className="text-kinetic font-medium hover:underline">
                      Browse products
                    </Link>
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {wishlist.map((p) => (
                      <Link
                        key={p.id}
                        to={`/shop`}
                        className="rounded-2xl border border-border bg-card p-3 transition-transform hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="aspect-square overflow-hidden rounded-xl bg-secondary">
                          <Image
                            src={p.image || p.images?.[0]}
                            alt={p.name}
                            fittingType="fit"
                            className="h-full w-full object-contain p-2"
                          />
                        </div>
                        <p className="mt-2 text-sm font-medium truncate">{p.name}</p>
                        <p className="text-sm font-semibold">${(p.price || 0).toFixed(0)}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="addresses" className="mt-0">
              <div>
                <h2 className="mb-5 font-heading text-2xl font-bold">Saved Addresses</h2>
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground bg-card/50">
                  <MapPin size={32} className="mx-auto mb-2 text-muted-foreground/60" />
                  No saved addresses yet. Add one at checkout.
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <div className="max-w-md">
                <h2 className="mb-5 font-heading text-2xl font-bold">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Full name</label>
                    <input
                      defaultValue={user?.full_name || ""}
                      className="h-11 min-h-[44px] w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:border-kinetic"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Email</label>
                    <input
                      defaultValue={user?.email || ""}
                      disabled
                      className="h-11 min-h-[44px] w-full rounded-xl border border-border bg-secondary px-4 text-sm text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">New password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 min-h-[44px] w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:border-kinetic"
                    />
                  </div>
                  <Button
                    type="button"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:bg-kinetic hover:text-white border-none"
                  >
                    Save changes
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}