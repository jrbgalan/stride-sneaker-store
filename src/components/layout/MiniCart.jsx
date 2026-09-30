import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/useCart";
import { formatPrice } from "@/lib/products";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export default function MiniCart() {
  const { cart, subtotal, miniCartOpen, setMiniCartOpen, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const FREE_SHIP = 100;
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100);

  return (
    <Sheet open={miniCartOpen} onOpenChange={setMiniCartOpen}>
      <SheetContent
        side="right"
        className="w-full max-w-md p-0 flex flex-col sm:max-w-md border-l border-border bg-background shadow-2xl"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
      >
        {/* Header */}
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
            <ShoppingBag size={18} /> Your Cart ({cart.length})
          </SheetTitle>
        </SheetHeader>

        {/* Free Shipping Progress */}
        {cart.length > 0 && (
          <div className="px-5 py-3 bg-secondary/30 border-b border-border/50">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-muted-foreground font-medium">
                {subtotal >= FREE_SHIP
                  ? "🎉 You've unlocked free shipping!"
                  : `$${(FREE_SHIP - subtotal).toFixed(2)} away from free shipping`}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-kinetic transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
                <ShoppingBag size={36} className="text-muted-foreground/60" />
              </div>
              <div>
                <p className="font-heading text-lg font-bold">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Looks like you haven't added any sneakers yet.</p>
              </div>
              <Button
                onClick={() => {
                  setMiniCartOpen(false);
                  navigate("/shop");
                }}
                className="min-h-[48px] rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background hover:bg-kinetic hover:text-white transition-colors"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-4 divide-y divide-border/60">
              {cart.map((item, idx) => (
                <li key={item.key} className={cn("flex gap-3", idx > 0 && "pt-4")}>
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-secondary">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fittingType="fit"
                      className="h-full w-full object-contain p-2"
                    />
                  </div>

                  <div className="flex flex-1 flex-col min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-mono text-[9px] uppercase text-muted-foreground truncate">
                          {item.brand}
                        </p>
                        <p className="text-sm font-medium leading-tight truncate">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Size {item.size} · {item.color}
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeFromCart(item.key)}
                        className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      {/* Quantity Stepper with 44px tap targets */}
                      <div className="inline-flex items-center rounded-full border border-border bg-card">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQty(item.key, item.quantity - 1)}
                          className="min-h-[44px] min-w-[44px] grid place-items-center rounded-full hover:bg-muted active:scale-95 transition-all"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-semibold tabular-nums select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQty(item.key, item.quantity + 1)}
                          className="min-h-[44px] min-w-[44px] grid place-items-center rounded-full hover:bg-muted active:scale-95 transition-all"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className="text-sm font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3 bg-card/60">
            <div className="flex justify-between text-base font-semibold">
              <span className="text-muted-foreground font-normal">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping & taxes calculated at checkout
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setMiniCartOpen(false);
                  navigate("/cart");
                }}
                className="w-full min-h-[48px] rounded-full border border-border py-3 text-sm font-semibold transition-colors hover:bg-muted"
              >
                View Cart
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setMiniCartOpen(false);
                  navigate("/checkout");
                }}
                className="w-full min-h-[48px] rounded-full bg-kinetic py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 shadow-md border-none"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}