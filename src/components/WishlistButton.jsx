"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { cn } from "@/lib/utils";

export default function WishlistButton({ product, className, size = 20 }) {
  const { inWishlist, toggleWishlist } = useWishlist();
  const active = inWishlist(product.id);
  const [justToggled, setJustToggled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!active) {
      setJustToggled(true);
      setTimeout(() => setJustToggled(false), 500);
    }
  };

  const burstParticles = [
    { x: 0, y: -14 },
    { x: 12, y: -8 },
    { x: 12, y: 8 },
    { x: 0, y: 14 },
    { x: -12, y: 8 },
    { x: -12, y: -8 },
  ];

  return (
    <button
      type="button"
      aria-label={active ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      aria-pressed={active}
      onClick={handleClick}
      className={cn(
        "relative min-h-[44px] min-w-[44px] grid place-items-center rounded-full transition-transform duration-200 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic",
        className
      )}
    >
      {/* Burst particles */}
      <AnimatePresence>
        {!shouldReduceMotion && justToggled && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            {burstParticles.map((p, i) => (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{ x: p.x, y: p.y, scale: 1, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.42, ease: "easeOut" }}
                className="absolute h-1.5 w-1.5 rounded-full bg-kinetic"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        animate={
          !shouldReduceMotion && justToggled
            ? {
                scale: [1, 1.45, 0.85, 1.1, 1],
                rotate: [0, -12, 12, -6, 0],
              }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Heart
          size={size}
          className={cn(
            "transition-colors duration-200",
            active ? "fill-kinetic text-kinetic" : "text-foreground/75 hover:text-foreground"
          )}
        />
      </motion.div>
    </button>
  );
}