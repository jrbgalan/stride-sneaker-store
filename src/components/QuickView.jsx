import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProductImage from "@/components/ProductImage";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SizeSelector from "@/components/shop/SizeSelector";
import StarRating from "@/components/StarRating";
import { useCart } from "@/lib/hooks/useCart";
import { useFlyToCart } from "@/lib/useFlyToCart";
import { pctOff, formatPrice } from "@/lib/products";
import { getProductMainImage } from "@/lib/productImages";
import { cn } from "@/lib/utils";

export default function QuickView({ product, open, onClose }) {
  const { addToCart } = useCart();
  const fly = useFlyToCart();
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(product?.colors?.[0]?.name || null);
  const [err, setErr] = useState(false);
  if (!product) return null;
  const off = pctOff(product.price, product.sale_price);
  const price = product.sale_price || product.price;

  const imageMeta = getProductMainImage(product.slug, color, product.images?.[0] || product.image);

  const handleAdd = (e) => {
    if (!size) {
      setErr(true);
      return;
    }
    fly(imageMeta.src, e.currentTarget);
    addToCart(product, { size, color, quantity: 1 });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl gap-0 overflow-y-auto max-h-[90vh] p-0 rounded-3xl">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Sneaker Image Container */}
          <div className="relative aspect-square sm:aspect-auto sm:min-h-[360px] overflow-hidden bg-secondary/80 p-6 sm:p-8">
            <ProductImage
              src={imageMeta.src}
              alt={imageMeta.alt || product.name}
              blurDataURL={imageMeta.blurDataURL}
              fittingType="contain"
              className="drop-shadow-md"
            />
            {off > 0 && (
              <Badge className="absolute left-4 top-4 rounded-full bg-kinetic text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wide shadow-sm border-none z-10">
                {off}% Off
              </Badge>
            )}
          </div>

          {/* Product Details Container */}
          <div className="flex flex-col p-5 sm:p-7">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {product.brand}
            </span>
            <h2 className="mt-1 font-heading text-xl sm:text-2xl font-bold tracking-tight">
              {product.name}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <StarRating rating={product.rating} size={14} />
              <span className="text-xs text-muted-foreground">
                {(product.rating || 5).toFixed(1)} ({product.review_count || 0})
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-2xl font-bold">
                {formatPrice(price)}
              </span>
              {off > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p className="mt-3 text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold">
                  Color: <span className="text-muted-foreground">{color}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.name)}
                      aria-label={c.name}
                      className={cn(
                        "min-h-[44px] min-w-[44px] rounded-full border-2 transition-all flex items-center justify-center",
                        color === c.name
                          ? "border-kinetic scale-110 shadow-md ring-2 ring-kinetic/30"
                          : "border-border hover:scale-105"
                      )}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold">Select Size (UK)</p>
                {err && (
                  <span className="text-xs font-medium text-kinetic">
                    Please pick a size
                  </span>
                )}
              </div>
              <SizeSelector
                sizes={product.sizes}
                selectedSize={size}
                onSelectSize={(s) => {
                  setSize(s);
                  setErr(false);
                }}
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-border">
              <Button
                type="button"
                onClick={handleAdd}
                className="flex-1 min-h-[48px] rounded-full bg-foreground py-3 text-sm font-bold text-background transition-colors hover:bg-kinetic hover:text-white border-none"
              >
                Add to Cart
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 min-h-[48px] rounded-full border border-border py-3 text-center text-sm font-semibold transition-colors hover:bg-muted"
              >
                <Link to={`/product/${product.slug}`} onClick={onClose}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}