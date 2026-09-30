"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  asChild?: boolean;
}

export default function MagneticButton({
  children,
  strength = 0.25,
  className,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    }
  }, []);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !canHover || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (shouldReduceMotion || !canHover) {
    return <div className={cn("inline-block", className)} {...props}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("inline-block", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

