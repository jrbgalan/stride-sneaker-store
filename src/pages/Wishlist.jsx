import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useCart } from "@/lib/hooks/useCart";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:py-24 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-secondary">
          <Heart size={36} className="text-muted-foreground/50" />
        </div>
        <h1 className="mt-6 font-heading text-3xl sm:text-4xl font-bold tracking-tightest">
          Your wishlist is empty
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Save your favorite sneakers and they'll appear here.
        </p>
        <Button
          asChild
          className="mt-8 min-h-[48px] rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background hover:bg-kinetic hover:text-white transition-colors border-none"
        >
          <Link to="/shop">
            Discover products <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-heading text-2xl sm:text-4xl font-bold tracking-tightest">
            Wishlist
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {wishlist.length} saved item{wishlist.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {wishlist.map((p, i) => (
          <div key={p.id} className="flex flex-col">
            <ProductCard
              product={{
                ...p,
                images: p.images || [p.image],
                sizes: p.sizes || [9],
                colors: p.colors || [{ name: "Default", hex: "#ccc" }],
                rating: p.rating || 4.5,
                review_count: p.review_count || 0,
              }}
              index={i}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                addToCart(
                  { ...p, id: p.id },
                  { size: 9, color: "Default" }
                )
              }
              className="mt-2 min-h-[44px] rounded-full border border-border py-2.5 px-4 text-xs font-semibold uppercase tracking-wide hover:bg-foreground hover:text-background transition-colors flex items-center justify-center"
            >
              Add to cart
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}