"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { BRANDS } from "@/lib/products";

export default function BrandStrip() {
  const shouldReduceMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items for continuous seamless loop
  const duplicatedBrands = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section className="border-y border-border bg-background py-8 sm:py-10 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 mb-5">
        <p className="text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Curated Brand Roster
        </p>
      </div>

      {shouldReduceMotion ? (
        <div className="mx-auto max-w-[1600px] px-4 grid grid-cols-3 gap-2 sm:gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {BRANDS.map((b) => (
            <Link
              key={b}
              to={`/shop?brand=${encodeURIComponent(b)}`}
              className="flex min-h-[56px] items-center justify-center rounded-2xl border border-border bg-secondary/40 px-3 hover:border-kinetic hover:text-kinetic transition-colors"
            >
              <span className="font-heading text-sm font-bold">{b}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-background to-transparent z-10" />

          <motion.div
            className="flex gap-4 sm:gap-6 w-max"
            animate={{
              x: isPaused ? undefined : ["0%", "-33.333%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "linear",
            }}
          >
            {duplicatedBrands.map((b, index) => (
              <Link
                key={`${b}-${index}`}
                to={`/shop?brand=${encodeURIComponent(b)}`}
                className="group flex items-center justify-center min-w-[140px] sm:min-w-[170px] h-16 sm:h-20 rounded-2xl border border-border bg-secondary/30 px-6 transition-all duration-300 hover:border-kinetic hover:bg-card hover:shadow-lg hover:shadow-kinetic/10 hover:-translate-y-0.5"
              >
                <span className="font-heading text-sm sm:text-base lg:text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-kinetic">
                  {b}
                </span>
              </Link>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
}