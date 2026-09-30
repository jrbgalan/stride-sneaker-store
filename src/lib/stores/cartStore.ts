import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product, CartItem, PromoCode } from "@/types";
import { getSettings } from "@/lib/storeSettings";

export interface CartTotals {
  cartCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface AddToCartOptions {
  size?: number | string;
  color?: string;
  quantity?: number;
}

export interface CartState {
  cart: CartItem[];
  promo: PromoCode | null;
  miniCartOpen: boolean;

  // Actions
  addToCart: (product: Product, options?: AddToCartOptions) => void;
  updateQty: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  setPromo: (promo: PromoCode | null) => void;
  setMiniCartOpen: (open: boolean) => void;

  // Calculation helpers
  getTotals: () => CartTotals;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      promo: null,
      miniCartOpen: false,

      addToCart: (product, options = {}) => {
        const size =
          options.size ??
          (product.sizes && product.sizes.length > 0
            ? product.sizes[Math.floor(product.sizes.length / 2)]
            : 9);
        const color = options.color ?? product.colors?.[0]?.name;
        const quantity = options.quantity ?? 1;
        const key = `${product.id}-${size}-${color}`;

        set((state) => {
          const existing = state.cart.find((i) => i.key === key);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.key === key ? { ...i, quantity: i.quantity + quantity } : i
              ),
              miniCartOpen: true,
            };
          }

          const price = product.sale_price || product.price;
          const newItem: CartItem = {
            key,
            product_id: product.id,
            name: product.name,
            brand: product.brand,
            image: product.images?.[0] || product.image,
            price,
            original_price: product.price,
            size,
            color,
            quantity,
            slug: product.slug,
          };

          return {
            cart: [...state.cart, newItem],
            miniCartOpen: true,
          };
        });
      },

      updateQty: (key, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((i) => i.key !== key) };
          }
          return {
            cart: state.cart.map((i) =>
              i.key === key ? { ...i, quantity } : i
            ),
          };
        });
      },

      removeFromCart: (key) => {
        set((state) => ({
          cart: state.cart.filter((i) => i.key !== key),
        }));
      },

      clearCart: () => {
        set({ cart: [], promo: null });
      },

      setPromo: (promo) => {
        set({ promo });
      },

      setMiniCartOpen: (open) => {
        set({ miniCartOpen: open });
      },

      getTotals: () => {
        const { cart, promo } = get();
        const settings = getSettings();

        const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        const subtotal = cart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        let discount = 0;
        if (promo) {
          if (promo.type === "percent") {
            discount = (subtotal * promo.value) / 100;
          } else {
            discount = Math.min(subtotal, promo.value);
          }
        }

        const discountedSubtotal = Math.max(0, subtotal - discount);
        const shipping =
          cart.length === 0
            ? 0
            : discountedSubtotal >= settings.free_shipping_threshold
            ? 0
            : settings.shipping_fee;

        const tax = discountedSubtotal * settings.tax_rate;
        const total = discountedSubtotal + shipping + tax;

        return {
          cartCount,
          subtotal,
          discount,
          shipping,
          tax,
          total,
        };
      },
    }),
    {
      name: "axis-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart, promo: state.promo }),
    }
  )
);
