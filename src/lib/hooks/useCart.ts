import { useMemo } from "react";
import { useCartStore } from "@/lib/stores/cartStore";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import type { CartItem, Product } from "@/types";

export function useCart() {
  const cart = useCartStore((s) => s.cart);
  const promo = useCartStore((s) => s.promo);
  const miniCartOpen = useCartStore((s) => s.miniCartOpen);
  const addToCart = useCartStore((s) => s.addToCart);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const setPromo = useCartStore((s) => s.setPromo);
  const setMiniCartOpen = useCartStore((s) => s.setMiniCartOpen);
  const getTotals = useCartStore((s) => s.getTotals);

  const totals = useMemo(() => getTotals(), [cart, promo]);

  const moveToWishlist = (item: CartItem) => {
    useWishlistStore.getState().addToWishlist({
      id: item.product_id,
      name: item.name,
      brand: item.brand,
      category: "Sneakers",
      gender: "Unisex",
      image: item.image,
      price: item.price,
      sale_price: item.price,
      slug: item.slug || item.product_id,
    });
    removeFromCart(item.key);
  };

  return {
    cart,
    promo,
    miniCartOpen,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    setPromo,
    setMiniCartOpen,
    moveToWishlist,
    ...totals,
  };
}
