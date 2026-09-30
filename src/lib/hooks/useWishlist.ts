import { useWishlistStore } from "@/lib/stores/wishlistStore";

export function useWishlist() {
  const wishlist = useWishlistStore((s) => s.wishlist);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const addToWishlist = useWishlistStore((s) => s.addToWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const inWishlist = useWishlistStore((s) => s.inWishlist);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  return {
    wishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    inWishlist,
    clearWishlist,
  };
}
