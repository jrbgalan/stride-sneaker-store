import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, ArrowLeft, Truck, CheckCircle2 } from "lucide-react";
import { Image } from "@/components/ui/image";

const SNEAKER_HERO = "https://media.base44.com/images/public/6abc61b8495468ff0f72fffb/ec3817df2_generated_a6bc0b32.jpg";

export default function AuthLayout({ icon: Icon, title, subtitle, footer = null, children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:grid lg:grid-cols-2">
      {/* 
        Form Section: 
        On mobile (< lg), order-1 puts this ON TOP.
        On desktop (lg+), sits on the left column.
      */}
      <div className="order-1 flex flex-col justify-between px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link
            to="/"
            className="font-heading text-2xl sm:text-3xl font-bold tracking-tightest select-none flex items-center min-h-[44px]"
            aria-label="AXIS home"
          >
            AXIS
          </Link>
          <Link
            to="/"
            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-full hover:bg-secondary/60"
          >
            <ArrowLeft size={16} /> Return to Store
          </Link>
        </div>

        {/* Center Form Card */}
        <div className="mx-auto w-full max-w-md my-auto">
          <div className="text-center mb-8">
            {Icon && (
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-foreground text-background shadow-md mb-4 ring-4 ring-secondary/50">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
            )}
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div className="bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-8">
            {children}
          </div>

          {footer && (
            <p className="text-center text-sm text-muted-foreground mt-6 leading-relaxed">
              {footer}
            </p>
          )}
        </div>

        {/* Subtle Bottom Meta on Form Side */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AXIS Flagship. All rights reserved.
        </div>
      </div>

      {/* 
        Visual Showcase Section:
        On mobile (< lg), order-2 stacks this BELOW the form.
        On desktop (lg+), sits on the right column.
      */}
      <div className="order-2 relative bg-secondary/50 border-t lg:border-t-0 lg:border-l border-border flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-hidden">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-kinetic/15 blur-3xl" />
          <div className="absolute left-10 bottom-10 h-72 w-72 rounded-full bg-kinetic/10 blur-3xl" />
        </div>

        {/* Brand Tagline Header */}
        <div className="relative z-10 hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-kinetic shadow-sm backdrop-blur-sm">
            <Sparkles size={13} /> The Elite Footwear Flagship
          </span>
        </div>

        {/* Center Showcase Artwork */}
        <div className="relative z-10 my-auto py-8 text-center lg:text-left">
          <div className="relative mx-auto lg:mx-0 max-w-sm aspect-square mb-6">
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-kinetic/20 via-transparent to-kinetic/10 blur-2xl" />
            <Image
              src={SNEAKER_HERO}
              alt="AXIS Flagship Sneaker"
              fittingType="fit"
              className="relative h-full w-full object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
            />
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl font-bold tracking-tightest leading-tight text-foreground">
            Move with <span className="text-kinetic">precision.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
            A high-velocity visual ecosystem for elite footwear. Engineered for those who refuse to stand still.
          </p>

          {/* Pillars & Authenticity */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-kinetic mb-1.5" />
              <p className="text-xs font-bold text-foreground">100% Authentic</p>
              <p className="text-[11px] text-muted-foreground">Direct from source</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-sm">
              <Truck className="h-5 w-5 text-kinetic mb-1.5" />
              <p className="text-xs font-bold text-foreground">Fast Delivery</p>
              <p className="text-[11px] text-muted-foreground">Free on orders $100+</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-sm">
              <CheckCircle2 className="h-5 w-5 text-kinetic mb-1.5" />
              <p className="text-xs font-bold text-foreground">Easy 30d Returns</p>
              <p className="text-[11px] text-muted-foreground">Hassle-free guarantee</p>
            </div>
          </div>
        </div>

        {/* Editorial Quote */}
        <div className="relative z-10 pt-4 border-t border-border/60 text-xs text-muted-foreground text-center lg:text-left">
          "The curation here is unmatched. AXIS is how sneaker shopping should feel."
        </div>
      </div>
    </div>
  );
}
