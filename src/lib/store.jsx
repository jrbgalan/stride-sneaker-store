import React from "react";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";

export function StoreProvider({ children }) {
  return <>{children}</>;
}

export function useStore() {
  const cart = useCart();
  const wishlist = useWishlist();

  return {
    ...cart,
    ...wishlist,
  };
}

export { useCart } from "@/lib/hooks/useCart";
export { useWishlist } from "@/lib/hooks/useWishlist";