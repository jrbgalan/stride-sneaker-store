import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types";

export interface WishlistState {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],

      toggleWishlist: (product) => {
        set((state) => {
          const exists = state.wishlist.some((p) => p.id === product.id);
          if (exists) {
            return {
              wishlist: state.wishlist.filter((p) => p.id !== product.id),
            };
          }
          return {
            wishlist: [
              ...state.wishlist,
              {
                id: product.id,
                name: product.name,
                brand: product.brand,
                image: product.images?.[0] || product.image,
                images: product.images,
                price: product.sale_price || product.price,
                original_price: product.price,
                slug: product.slug,
                category: product.category,
                gender: product.gender,
              } as Product,
            ],
          };
        });
      },

      addToWishlist: (product) => {
        set((state) => {
          if (state.wishlist.some((p) => p.id === product.id)) return state;
          return {
            wishlist: [
              ...state.wishlist,
              {
                id: product.id,
                name: product.name,
                brand: product.brand,
                image: product.images?.[0] || product.image,
                images: product.images,
                price: product.sale_price || product.price,
                original_price: product.price,
                slug: product.slug,
                category: product.category,
                gender: product.gender,
              } as Product,
            ],
          };
        });
      },

      removeFromWishlist: (id) => {
        set((state) => ({
          wishlist: state.wishlist.filter((p) => p.id !== id),
        }));
      },

      inWishlist: (id) => {
        return get().wishlist.some((p) => p.id === id);
      },

      clearWishlist: () => {
        set({ wishlist: [] });
      },
    }),
    {
      name: "axis-wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
