import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * @param {{ products?: import('@/types').Product[], loading?: boolean, columns?: number }} props
 */
export default function ProductGrid({
  products = [],
  loading = false,
  columns = 4,
}) {
  const shouldReduceMotion = useReducedMotion();

  const cols =
    {
      2: "grid-cols-2",
      3: "grid-cols-2 sm:grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4",
    }[columns] || "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4";

  if (loading) {
    return (
      <div className={`grid ${cols} gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-square rounded-2xl w-full" />
            <Skeleton className="h-3.5 w-1/3 rounded-full" />
            <Skeleton className="h-4 w-2/3 rounded-full" />
            <Skeleton className="h-4 w-1/4 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.02,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 12 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  if (shouldReduceMotion) {
    return (
      <div className={`grid ${cols} gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8`}>
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid ${cols} gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8`}
    >
      <AnimatePresence mode="popLayout">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            layout
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
            }}
            className="w-full"
          >
            <ProductCard product={p} index={i} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}