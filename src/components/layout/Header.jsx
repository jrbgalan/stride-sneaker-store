import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Flame,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { base44 } from "@/api/base44Client";
import { BRANDS, CATEGORIES } from "@/lib/products";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import AnnouncementBar from "./AnnouncementBar";

export default function Header() {
  const { cartCount, wishlist, setMiniCartOpen } = useStore();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [brandsOpen, setBrandsOpen] = useState(true);
  const [catsOpen, setCatsOpen] = useState(true);
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    base44.entities.Product.list("-created_date", 100)
      .then(setAllProducts)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const ql = q.toLowerCase();
    setResults(
      allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(ql) ||
            p.brand.toLowerCase().includes(ql) ||
            p.category.toLowerCase().includes(ql)
        )
        .slice(0, 6)
    );
  }, [q, allProducts]);

  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const submitSearch = (e) => {
    e?.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    navigate(`/shop?q=${encodeURIComponent(q)}`);
  };

  const handleMobileSearch = (e) => {
    e?.preventDefault();
    if (!mobileSearchQuery.trim()) return;
    setMobileOpen(false);
    navigate(`/shop?q=${encodeURIComponent(mobileSearchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "glass bg-background/85 border-b border-border shadow-sm"
            : "bg-background border-b border-border/40"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          {/* Mobile hamburger button with at least 44px tap target */}
          <button
            className="lg:hidden -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-secondary/60 transition-colors"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="font-heading text-2xl font-bold tracking-tightest select-none flex items-center min-h-[44px]"
            aria-label="AXIS home"
          >
            AXIS
          </Link>

          {/* Desktop Mega-Menu (completely hidden on mobile/tablet) */}
          <nav
            className="ml-6 hidden lg:flex items-center gap-1"
            onMouseLeave={() => setMegaOpen(null)}
          >
            <Link
              to="/shop"
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-medium hover:text-kinetic transition-colors"
            >
              Shop
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen("brands")}
            >
              <button
                type="button"
                className="min-h-[44px] flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-kinetic transition-colors"
              >
                Brands <ChevronDown size={14} />
              </button>
              {megaOpen === "brands" && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="grid w-[480px] grid-cols-2 gap-1.5 rounded-2xl border border-border bg-card p-4 shadow-xl animate-scale-in">
                    {BRANDS.map((b) => (
                      <Link
                        key={b}
                        to={`/shop?brand=${encodeURIComponent(b)}`}
                        className="min-h-[44px] flex items-center rounded-xl px-3 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setMegaOpen(null)}
                      >
                        <span className="font-heading font-semibold">{b}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen("cats")}
            >
              <button
                type="button"
                className="min-h-[44px] flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-kinetic transition-colors"
              >
                Categories <ChevronDown size={14} />
              </button>
              {megaOpen === "cats" && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="grid w-[480px] grid-cols-2 gap-1.5 rounded-2xl border border-border bg-card p-4 shadow-xl animate-scale-in">
                    {CATEGORIES.map((c) => (
                      <Link
                        key={c}
                        to={`/shop?category=${encodeURIComponent(c)}`}
                        className="min-h-[44px] flex items-center rounded-xl px-3 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setMegaOpen(null)}
                      >
                        <span className="font-heading font-semibold">{c}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/shop?sale=true"
              className="min-h-[44px] flex items-center gap-1 px-3 py-2 text-sm font-medium text-kinetic hover:opacity-80 transition-opacity"
            >
              <Flame size={14} /> Sale
            </Link>
            <Link
              to="/about"
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-medium hover:text-kinetic transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Desktop Search */}
          <div
            ref={searchRef}
            className="relative ml-auto flex-1 max-w-md hidden md:block"
          >
            <form onSubmit={submitSearch} className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search sneakers, brands…"
                aria-label="Search products"
                className="w-full rounded-full border border-border bg-secondary/60 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-kinetic focus:bg-card"
              />
            </form>
            {searchOpen && q.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-border bg-card p-2 shadow-xl animate-scale-in max-h-96 overflow-y-auto z-50">
                {results.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No matches for "{q}"
                  </p>
                ) : (
                  results.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.slug}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setQ("");
                      }}
                      className="flex items-center gap-3 rounded-xl p-2 min-h-[44px] hover:bg-muted transition-colors"
                    >
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-secondary">
                        <Image
                          src={p.images?.[0]}
                          alt={p.name}
                          fittingType="fit"
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="font-mono text-[10px] uppercase text-muted-foreground">
                          {p.brand}
                        </p>
                      </div>
                      <span className="ml-auto text-sm font-semibold">
                        ${(p.sale_price || p.price).toFixed(0)}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Action Icons with minimum 44px tap targets */}
          <div className="ml-auto flex items-center gap-0.5 md:ml-2">
            <button
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-secondary/60 transition-colors"
              aria-label="Search"
              onClick={() => navigate("/search")}
            >
              <Search size={20} />
            </button>

            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-secondary/60 transition-colors"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative hidden sm:flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-secondary/60 transition-colors"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-kinetic px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/account"
              aria-label="Account"
              className="hidden sm:flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-secondary/60 transition-colors"
            >
              <User size={20} />
            </Link>

            <button
              onClick={() => setMiniCartOpen(true)}
              aria-label="Shopping Cart"
              data-cart-target
              className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-secondary/60 transition-colors"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  data-cart-badge
                  className="absolute right-1 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-kinetic px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Clean Slide-in Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-in Menu Panel */}
          <div
            className="absolute inset-y-0 left-0 w-[86%] max-w-sm bg-background border-r border-border shadow-2xl flex flex-col animate-slide-in-left overflow-hidden"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="font-heading text-2xl font-bold tracking-tightest select-none flex items-center min-h-[44px]"
              >
                AXIS
              </Link>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggle}
                  aria-label="Toggle dark mode"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                >
                  {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
                </button>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Quick Search inside Drawer */}
            <div className="p-4 border-b border-border bg-secondary/30">
              <form onSubmit={handleMobileSearch} className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Search shoes, brands…"
                  className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-kinetic"
                />
              </form>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              {/* Primary Links */}
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between min-h-[44px] px-3 rounded-xl font-heading text-lg font-semibold hover:bg-secondary/60 hover:text-kinetic transition-colors"
                >
                  Home <ChevronRight size={16} className="text-muted-foreground" />
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between min-h-[44px] px-3 rounded-xl font-heading text-lg font-semibold hover:bg-secondary/60 hover:text-kinetic transition-colors"
                >
                  Shop All <ChevronRight size={16} className="text-muted-foreground" />
                </Link>
                <Link
                  to="/shop?sale=true"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between min-h-[44px] px-3 rounded-xl font-heading text-lg font-semibold text-kinetic hover:bg-kinetic/10 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Flame size={18} /> Sale Drops
                  </span>
                  <span className="rounded-full bg-kinetic px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                    Hot
                  </span>
                </Link>
              </div>

              {/* Brands Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setBrandsOpen(!brandsOpen)}
                  className="flex w-full items-center justify-between min-h-[44px] py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
                >
                  <span>Brands</span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform",
                      brandsOpen && "rotate-180"
                    )}
                  />
                </button>
                {brandsOpen && (
                  <div className="grid grid-cols-2 gap-2 pt-2 animate-scale-in">
                    {BRANDS.map((b) => (
                      <Link
                        key={b}
                        to={`/shop?brand=${encodeURIComponent(b)}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center min-h-[44px] px-3.5 py-2 rounded-xl bg-secondary/50 text-sm font-medium hover:bg-muted hover:text-kinetic transition-colors truncate"
                      >
                        {b}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setCatsOpen(!catsOpen)}
                  className="flex w-full items-center justify-between min-h-[44px] py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
                >
                  <span>Categories</span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform",
                      catsOpen && "rotate-180"
                    )}
                  />
                </button>
                {catsOpen && (
                  <div className="grid grid-cols-2 gap-2 pt-2 animate-scale-in">
                    {CATEGORIES.map((c) => (
                      <Link
                        key={c}
                        to={`/shop?category=${encodeURIComponent(c)}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center min-h-[44px] px-3.5 py-2 rounded-xl bg-secondary/50 text-sm font-medium hover:bg-muted hover:text-kinetic transition-colors truncate"
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Support & Informational Links */}
              <div className="pt-2 border-t border-border space-y-1">
                {[
                  { to: "/wishlist", label: "My Wishlist" },
                  { to: "/account", label: "My Account & Orders" },
                  { to: "/about", label: "About AXIS" },
                  { to: "/contact", label: "Contact Us" },
                  { to: "/faq", label: "FAQ & Help" },
                  { to: "/size-guide", label: "Size Guide" },
                  { to: "/shipping", label: "Shipping & Returns" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between min-h-[44px] px-3 rounded-lg text-sm text-foreground/80 hover:bg-secondary/40 hover:text-kinetic transition-colors"
                  >
                    {item.label}
                    <ArrowRight size={14} className="text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Drawer Footer with Account Action */}
            <div className="border-t border-border p-5 bg-card/50">
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 min-h-[48px] w-full rounded-full bg-foreground text-background font-semibold text-sm hover:bg-kinetic hover:text-white transition-colors"
              >
                <User size={16} /> My Account
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Free shipping on all US orders over $100
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}