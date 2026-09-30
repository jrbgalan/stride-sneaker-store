import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/hooks/useCart";
import { base44 } from "@/api/base44Client";
import { formatPrice } from "@/lib/products";
import QuantityStepper from "@/components/QuantityStepper";
import { Trash2, Heart, ArrowRight, Tag, X } from "lucide-react";
import { getSettings } from "@/lib/storeSettings";

export default function Cart() {
  const {
    cart,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    promo,
    setPromo,
    updateQty,
    removeFromCart,
    moveToWishlist,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const settings = getSettings();
  const FREE_SHIP = settings.free_shipping_threshold;
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100);

  const applyCode = async () => {
    if (!code.trim()) return;
    try {
      const res = await base44.entities.PromoCode.filter(
        { code: code.trim().toUpperCase(), active: true },
        "-created_date",
        1
      );
      if (res[0]) {
        setPromo(res[0]);
        setErr("");
        setCode("");
      } else {
        setErr("Invalid promo code");
      }
    } catch {
      setErr("Invalid promo code");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-24 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tightest">
          Your cart is empty
        </h1>
        <p className="mt-3 text-muted-foreground">
          Looks like you haven't added anything yet.
        </p>
        <Button
          asChild
          className="mt-8 min-h-[48px] rounded-full bg-foreground px-8 text-sm font-semibold text-background hover:bg-kinetic hover:text-white transition-colors border-none"
        >
          <Link to="/shop">
            Continue Shopping <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-4xl font-bold tracking-tightest">
        Shopping Cart
      </h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-4 rounded-2xl bg-secondary/50 p-4">
            <p className="mb-2 text-sm font-medium">
              {subtotal >= FREE_SHIP
                ? "🎉 You've unlocked free shipping!"
                : `Add $${(FREE_SHIP - subtotal).toFixed(2)} more for free shipping`}
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-kinetic transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <ul className="divide-y divide-border">
            {cart.map((item) => (
              <li key={item.key} className="flex gap-3 sm:gap-4 py-6">
                <Link
                  to={`/product/${item.slug}`}
                  className="h-20 w-20 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl bg-secondary"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fittingType="fit"
                    className="h-full w-full object-contain p-2"
                  />
                </Link>
                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase text-muted-foreground truncate">
                        {item.brand}
                      </p>
                      <p className="font-heading text-base sm:text-lg font-medium truncate">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Size {item.size} · {item.color}
                      </p>
                    </div>
                    <span className="font-semibold text-sm sm:text-base shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-2 sm:gap-3 pt-3">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(q) => updateQty(item.key, q)}
                    />
                    <button
                      type="button"
                      onClick={() => moveToWishlist(item)}
                      className="min-h-[44px] inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-kinetic px-2 py-1 transition-colors"
                    >
                      <Heart size={15} /> Move to wishlist
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.key)}
                      className="min-h-[44px] inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-destructive px-2 py-1 transition-colors"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={clearCart}
            className="mt-4 min-h-[44px] inline-flex items-center text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear cart
          </button>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="font-heading text-xl font-bold">Order Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-kinetic font-medium">
                <span>Discount ({promo?.code})</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-5">
            {promo ? (
              <div className="flex min-h-[44px] items-center justify-between rounded-xl bg-kinetic/10 px-4 py-2.5 text-sm">
                <span className="inline-flex items-center gap-2 font-medium">
                  <Tag size={14} className="text-kinetic" /> {promo.code} applied
                </span>
                <button
                  type="button"
                  onClick={() => setPromo(null)}
                  aria-label="Remove promo"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Promo code (WELCOME10)"
                  className="h-11 min-h-[44px] flex-1 rounded-full border border-border px-4 text-sm outline-none focus:border-kinetic"
                />
                <Button
                  type="button"
                  onClick={applyCode}
                  className="h-11 min-h-[44px] rounded-full bg-foreground px-5 text-sm font-semibold text-background hover:bg-kinetic hover:text-white transition-colors border-none"
                >
                  Apply
                </Button>
              </div>
            )}
            {err && <p className="mt-1.5 text-xs text-kinetic">{err}</p>}
          </div>

          <Button
            type="button"
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full min-h-[48px] rounded-full bg-kinetic py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 shadow-md border-none"
          >
            Proceed to Checkout
          </Button>
          <Link
            to="/shop"
            className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground min-h-[44px] flex items-center justify-center"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}