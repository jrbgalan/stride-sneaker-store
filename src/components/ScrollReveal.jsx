import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion[Tag] || motion.div;

  if (shouldReduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionComponent
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.45,
        delay: delay > 0 ? Math.min(delay / 1000, 0.25) : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </MotionComponent>
  );
}