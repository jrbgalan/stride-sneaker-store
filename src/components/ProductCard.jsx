"use client";

import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import ProductImage from "@/components/ProductImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/StarRating";
import WishlistButton from "@/components/WishlistButton";
import QuickView from "@/components/QuickView";
import { useStore } from "@/lib/store";
import { useFlyToCart } from "@/lib/useFlyToCart";
import { pctOff, formatPrice } from "@/lib/products";
import { getProductMainImage } from "@/lib/productImages";
import { cn } from "@/lib/utils";

export default function ProductCard({ product, _index = 0 }) {
  const { addToCart } = useStore();
  const fly = useFlyToCart();
  const [quickOpen, setQuickOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name);
  const imgRef = useRef(null);
  const cardRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const off = pctOff(product.price, product.sale_price);
  const price = product.sale_price || product.price;

  // Spring physics for 3D cursor-follow tilt
  const springConfig = { damping: 20, stiffness: 180 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Subtle tilt angle capped within +/- 7 degrees
    rotateX.set((-y / rect.height) * 12);
    rotateY.set((x / rect.width) * 12);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  // Get matching image for current color
  const imageMeta = getProductMainImage(
    product.slug,
    selectedColor,
    product.images?.[0] || product.image
  );

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fly(imageMeta.src, imgRef.current);
    addToCart(product, {
      size: product.sizes?.[Math.floor(product.sizes.length / 2)] || 9,
      color: selectedColor || product.colors?.[0]?.name,
      quantity: 1,
    });
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: 1000,
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={shouldReduceMotion ? undefined : { y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
        className="w-full flex flex-col group/card"
      >
        <Link
          to={`/product/${product.slug}`}
          className="group relative flex flex-col w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic rounded-3xl"
          aria-label={`View details for ${product.brand} ${product.name}`}
        >
          {/* Card Media Container with 3D depth and soft shadow lift */}
          <div
            ref={imgRef}
            className="relative aspect-square overflow-hidden rounded-3xl bg-secondary/80 border border-border/40 shadow-sm transition-all duration-300 group-hover/card:shadow-2xl group-hover/card:shadow-black/10 group-hover/card:border-border"
          >
            {/* Product Image with shared-element transition and zoom */}
            <div className="h-full w-full p-4 sm:p-5 transition-transform duration-500 ease-out group-hover/card:scale-105">
              <ProductImage
                src={imageMeta.src}
                alt={imageMeta.alt || `${product.brand} ${product.name}`}
                blurDataURL={imageMeta.blurDataURL}
                layoutId={`product-hero-${product.slug}`}
                fittingType="contain"
                className="drop-shadow-md"
              />
            </div>

            {/* Sale Badge */}
            {off > 0 && (
              <Badge
                className="absolute left-3 top-3 rounded-full bg-kinetic text-white font-bold uppercase tracking-wider px-2.5 py-1 text-[10px] sm:text-[11px] shadow-sm pointer-events-none border-none z-10"
              >
                {off}% Off
              </Badge>
            )}

            {/* Wishlist Button */}
            <div className="absolute right-2.5 top-2.5 z-20 rounded-full bg-card/85 backdrop-blur-md shadow-sm">
              <WishlistButton product={product} size={18} />
            </div>

            {/* Desktop Quick Actions */}
            <div className="absolute inset-x-3 bottom-3 hidden sm:flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 z-20">
              <Button
                type="button"
                onClick={handleAdd}
                className="flex-1 min-h-[44px] rounded-full bg-foreground px-3 py-2 text-xs font-semibold uppercase tracking-wider text-background transition-colors hover:bg-kinetic hover:text-white border-none shadow-md"
              >
                Add to Cart
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickOpen(true);
                }}
                className="min-h-[44px] rounded-full bg-card/90 backdrop-blur-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-kinetic hover:text-white border-border shadow-sm"
              >
                Quick View
              </Button>
            </div>
          </div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 1 && (
            <div className="mt-2.5 flex items-center gap-1.5 px-0.5" onClick={(e) => e.preventDefault()}>
              {product.colors.map((c) => {
                const isSelected = selectedColor === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    aria-label={`Select ${c.name}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedColor(c.name);
                    }}
                    className={cn(
                      "h-3.5 w-3.5 rounded-full border border-border/80 transition-all duration-200",
                      isSelected
                        ? "ring-2 ring-kinetic ring-offset-2 ring-offset-background scale-110"
                        : "hover:scale-115 opacity-75 hover:opacity-100"
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          )}

          {/* Typography & Pricing */}
          <div className="mt-2 flex flex-col gap-0.5 sm:gap-1 px-0.5">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground truncate">
              {product.brand}
            </span>
            <h3 className="font-heading text-xs sm:text-sm font-semibold leading-snug tracking-tight line-clamp-1 group-hover/card:text-kinetic transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-xs sm:text-sm font-bold text-foreground">
                {formatPrice(price)}
              </span>
              {off > 0 && (
                <span className="text-[11px] sm:text-xs text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {product.rating && (
              <div className="mt-0.5">
                <StarRating rating={product.rating} count={product.review_count} size={11} />
              </div>
            )}
          </div>
        </Link>
      </motion.div>

      {/* Quick View Modal */}
      {quickOpen && (
        <QuickView
          product={product}
          open={quickOpen}
          onClose={() => setQuickOpen(false)}
        />
      )}
    </>
  );
}