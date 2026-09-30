"use client";

import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import ProductImage from "@/components/ProductImage";
import MagneticButton from "@/components/MagneticButton";
import CountUp from "@/components/CountUp";
import { ArrowRight, Sparkles } from "lucide-react";
import { getProductMainImage } from "@/lib/productImages";

export default function Hero() {
  const [slide, setSlide] = useState(0);
  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const heroImageMeta = getProductMainImage("air-jordan-1-retro-high-og");
  const promos = ["Just Do It — Up to 70% Off", "New Season Drops", "Free Shipping over $100"];

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % promos.length), 3500);
    return () => clearInterval(t);
  }, [promos.length]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const shoeParallaxY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  const headlineWords = [
    { text: "Move", kinetic: false },
    { text: "with", kinetic: false },
    { text: "precision.", kinetic: true },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-secondary/40">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-kinetic/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-kinetic/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-[1600px] items-center gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
        {/* Left Column: Copy & Actions */}
        <div className="order-2 lg:order-1">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-kinetic">
            <Sparkles size={12} /> {promos[slide]}
          </p>

          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="font-heading text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tightest flex flex-wrap gap-x-3 gap-y-1"
          >
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className={word.kinetic ? "text-kinetic inline-block" : "inline-block"}
              >
                {word.text}
              </motion.span>
            ))}
          </motion.h1>

          <p className="mt-5 max-w-md text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
            A curated flagship for elite footwear. Engineered for those who refuse to stand still.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <MagneticButton>
              <Link
                to="/shop"
                className="group min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-bold text-background transition-all hover:bg-kinetic hover:text-white hover:shadow-lg hover:shadow-kinetic/30"
              >
                Shop Now{" "}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </MagneticButton>

            <Link
              to="/shop?sort=new"
              className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-8 py-3.5 text-sm font-semibold transition-all hover:border-kinetic hover:text-kinetic"
            >
              New Arrivals
            </Link>
          </div>

          {/* Stats with CountUp Animation */}
          <div className="mt-8 flex items-center justify-between sm:justify-start gap-4 sm:gap-8 border-t border-border/50 pt-6">
            <div>
              <p className="font-heading text-xl sm:text-2xl font-bold">
                <CountUp end={2} suffix="M+" />
              </p>
              <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground">
                Happy customers
              </p>
            </div>
            <div>
              <p className="font-heading text-xl sm:text-2xl font-bold">
                <CountUp end={500} suffix="+" />
              </p>
              <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground">
                Premium styles
              </p>
            </div>
            <div>
              <p className="font-heading text-xl sm:text-2xl font-bold">
                <CountUp end={4.9} decimals={1} suffix="★" />
              </p>
              <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground">
                Average rating
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual with Animated Gradient & Parallax Floating Shoe */}
        <motion.div
          style={{ y: shouldReduceMotion ? 0 : shoeParallaxY }}
          className="relative order-1 lg:order-2 flex items-center justify-center"
        >
          {/* Subtle background typographic brand mark */}
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <span className="font-heading text-[28vw] font-bold leading-none tracking-tightest text-foreground/5 lg:text-[16rem] select-none">
              AXIS
            </span>
          </div>

          <div className="relative aspect-square w-full max-w-[540px]">
            {/* Animated radial gradient pulse */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [0.94, 1.08, 0.94],
                      opacity: [0.45, 0.7, 0.45],
                    }
              }
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-6 rounded-full bg-gradient-to-tr from-kinetic/35 via-kinetic/15 to-transparent blur-3xl pointer-events-none"
            />

            {/* Floating loop container for shoe */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [-8, 8, -8],
                      rotate: [-1.2, 1.2, -1.2],
                    }
              }
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative h-full w-full p-4"
            >
              <ProductImage
                src={heroImageMeta.src}
                alt={heroImageMeta.alt}
                blurDataURL={heroImageMeta.blurDataURL}
                priority
                fittingType="contain"
                className="drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}