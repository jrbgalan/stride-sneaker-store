"use client";

import React, { useEffect, useState, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function CountUp({
  end,
  duration = 0.6,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setValue(end);
      return;
    }

    let startTime: number | null = null;
    const durMs = Math.min(duration * 1000, 600); // keep under 600ms

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durMs, 1);
      // Ease out quad
      const easeOut = 1 - (1 - progress) * (1 - progress);
      const current = easeOut * end;
      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, end, duration, shouldReduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

