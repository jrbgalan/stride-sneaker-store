"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

export interface ProductImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string;
  fittingType?: "contain" | "cover" | "fill";
  containerClassName?: string;
  layoutId?: string;
  showFallbackOnError?: boolean;
}

export default function ProductImage({
  src,
  alt = "Product image",
  blurDataURL,
  fill = true,
  width,
  height,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  className,
  containerClassName,
  fittingType = "contain",
  layoutId,
  showFallbackOnError = true,
  ...rest
}: ProductImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If no source provided or error occurred
  if (!src || (hasError && showFallbackOnError)) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-2xl bg-secondary/60 text-muted-foreground/60 transition-colors",
          fill ? "h-full w-full" : "",
          containerClassName
        )}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          <Package className="h-10 w-10 stroke-[1.25] opacity-60" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Image Unavailable
          </span>
        </div>
      </div>
    );
  }

  // Object fit class
  const fitClass =
    fittingType === "cover"
      ? "object-cover"
      : fittingType === "fill"
      ? "object-fill"
      : "object-contain";

  const imgComponent = (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width || 600 : undefined}
      height={!fill ? height || 600 : undefined}
      sizes={sizes}
      priority={priority}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      draggable={false}
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      className={cn(
        fitClass,
        "transition-opacity duration-500 ease-out",
        isLoaded ? "opacity-100" : "opacity-0",
        className
      )}
      {...rest}
    />
  );

  if (layoutId) {
    return (
      <motion.div
        layoutId={layoutId}
        className={cn("relative overflow-hidden", fill ? "h-full w-full" : "", containerClassName)}
        style={!fill && width && height ? { width, height } : undefined}
      >
        {imgComponent}
      </motion.div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden", fill ? "h-full w-full" : "", containerClassName)}
      style={!fill && width && height ? { width, height } : undefined}
    >
      {imgComponent}
    </div>
  );
}

