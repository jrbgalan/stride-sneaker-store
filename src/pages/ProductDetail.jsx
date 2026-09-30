import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import ProductImage from "@/components/ProductImage";
import PhotoCredits from "@/components/PhotoCredits";
import MagneticButton from "@/components/MagneticButton";
import StarRating from "@/components/StarRating";
import WishlistButton from "@/components/WishlistButton";
import QuantityStepper from "@/components/QuantityStepper";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import SizeSelector from "@/components/shop/SizeSelector";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/hooks/useCart";
import { useFlyToCart } from "@/lib/useFlyToCart";
import { pctOff, formatPrice } from "@/lib/products";
import { getProductImages } from "@/lib/productImages";
import { cn } from "@/lib/utils";
import { ChevronRight, Truck, RefreshCw, ShieldCheck, Check, ZoomIn } from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setMiniCartOpen } = useCart();
  const fly = useFlyToCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50, show: false });
  const shouldReduceMotion = useReducedMotion();
  const imgRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    base44.entities.Product.filter({ slug }, "-created_date", 1).then(async (res) => {
      const p = res[0];
      setProduct(p);
      if (p) {
        setColor(p.colors?.[0]?.name || null);
        setActiveImg(0);
        const rel = await base44.entities.Product.filter({ brand: p.brand }, "-created_date", 6);
        setRelated(rel.filter((r) => r.id !== p.id).slice(0, 4));

        base44.entities.Review.filter({ product_id: p.id, hidden: false }, "-created_date", 20).then(setReviews).catch(() => {});

        try {
          const recents = JSON.parse(localStorage.getItem("axis-recents")) || [];
          const next = [p, ...recents.filter((x) => x.id !== p.id)].slice(0, 8);
          localStorage.setItem("axis-recents", JSON.stringify(next));
          setRecentlyViewed(next.filter((x) => x.id !== p.id));
        } catch {}
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-3xl w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-10 w-3/4 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-heading text-3xl font-bold">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block font-semibold text-kinetic hover:underline">
          Return to shop →
        </Link>
      </div>
    );
  }

  const off = pctOff(product.price, product.sale_price);
  const price = product.sale_price || product.price;
  const stock = product.stock ?? 10;
  const lowStock = stock > 0 && stock <= 5;

  // Load rich manifest gallery
  const galleryList = product ? getProductImages(product.slug, product.images) : [];
  const currentPhoto = galleryList[activeImg] || galleryList[0];

  const handleColorChange = (c) => {
    setColor(c.name);
    // Find matching photo in gallery
    const matchIdx = galleryList.findIndex(
      (img) =>
        img.colorName &&
        (img.colorName.toLowerCase().includes(c.name.toLowerCase()) ||
          c.name.toLowerCase().includes(img.colorName.toLowerCase()))
    );
    if (matchIdx !== -1) {
      setActiveImg(matchIdx);
    } else if (c.image) {
      const idx = galleryList.findIndex((img) => img.src === c.image);
      if (idx !== -1) setActiveImg(idx);
    }
  };

  const handleDragEnd = (_e, info) => {
    if (shouldReduceMotion) return;
    if (info.offset.x < -45) {
      setActiveImg((curr) => Math.min(curr + 1, galleryList.length - 1));
    } else if (info.offset.x > 45) {
      setActiveImg((curr) => Math.max(curr - 1, 0));
    }
  };

  const handleImageMouseMove = (e) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x, y, show: true });
  };

  const handleAdd = (buyNow = false, e) => {
    if (!size) { setSizeError(true); return; }
    if (e?.currentTarget) {
      fly(currentPhoto?.src || product.images?.[activeImg] || product.image, imgRef.current || e.currentTarget);
    }
    addToCart(product, { size, color, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    if (buyNow) {
      navigate("/checkout");
    } else {
      setMiniCartOpen(true);
    }
  };

  const ratingBreakdown = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => Math.round(r.rating) === s).length,
  }));

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 pb-44 sm:px-6 lg:px-8 lg:pb-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto no-scrollbar whitespace-nowrap py-1">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight size={12} className="shrink-0" />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight size={12} className="shrink-0" />
        <Link to={`/shop?brand=${encodeURIComponent(product.brand)}`} className="hover:text-foreground">
          {product.brand}
        </Link>
        <ChevronRight size={12} className="shrink-0" />
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div
            ref={imgRef}
            onMouseMove={handleImageMouseMove}
            onMouseEnter={() => setLensPos((p) => ({ ...p, show: true }))}
            onMouseLeave={() => setLensPos((p) => ({ ...p, show: false }))}
            className="group relative aspect-square overflow-hidden rounded-3xl bg-secondary/80 border border-border/50 select-none shadow-sm"
          >
            {/* Draggable container with spring swipe physics */}
            <motion.div
              drag={shouldReduceMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="h-full w-full cursor-grab active:cursor-grabbing p-6 sm:p-8"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImg}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="h-full w-full relative"
                  style={
                    lensPos.show && !shouldReduceMotion
                      ? {
                          transformOrigin: `${lensPos.x}% ${lensPos.y}%`,
                          transform: "scale(2.2)",
                          transition: "transform 0.15s ease-out",
                        }
                      : { transition: "transform 0.2s ease-out" }
                  }
                >
                  <ProductImage
                    src={currentPhoto?.src || product.images?.[activeImg]}
                    alt={currentPhoto?.alt || product.name}
                    blurDataURL={currentPhoto?.blurDataURL}
                    layoutId={`product-hero-${product.slug}`}
                    priority
                    fittingType="contain"
                    className="drop-shadow-xl pointer-events-none"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {off > 0 && (
              <Badge className="absolute left-5 top-5 rounded-full bg-kinetic text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide border-none shadow-sm z-10 pointer-events-none">
                {off}% OFF
              </Badge>
            )}

            {/* Magnifier indicator on desktop */}
            <div className="absolute right-4 bottom-4 hidden lg:flex items-center gap-1.5 rounded-full bg-card/85 backdrop-blur-md px-3 py-1.5 text-[11px] font-mono uppercase text-muted-foreground border border-border/60 pointer-events-none z-10 shadow-sm">
              <ZoomIn size={13} className="text-kinetic" /> Hover to magnify
            </div>
          </div>

          {/* Photo Credits Line */}
          <PhotoCredits
            photographer={currentPhoto?.photographer}
            photographerUrl={currentPhoto?.photographerUrl}
            sourceLink={currentPhoto?.sourceLink}
            className="mt-3 px-1"
          />

          {/* Thumbnail Strip with crossfade transition */}
          <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar py-1">
            {galleryList.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                aria-label={`View photo ${i + 1}`}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-secondary/80 border transition-all duration-200",
                  activeImg === i
                    ? "border-kinetic ring-2 ring-kinetic/30 scale-105 shadow-sm"
                    : "border-border/60 opacity-60 hover:opacity-100 hover:border-foreground"
                )}
              >
                <ProductImage
                  src={img.src}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  blurDataURL={img.blurDataURL}
                  fill
                  fittingType="contain"
                  className="p-2"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{product.brand}</p>
              <h1 className="mt-1 font-heading text-2xl sm:text-4xl font-bold tracking-tightest">{product.name}</h1>
              <div className="mt-3 flex items-center gap-3">
                <StarRating rating={product.rating} size={16} />
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} · {product.review_count} reviews
                </span>
              </div>
            </div>
            <div className="rounded-full bg-card p-1 shadow-sm border border-border">
              <WishlistButton product={product} size={22} />
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-heading text-3xl font-bold">{formatPrice(price)}</span>
            {off > 0 && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>}
            {off > 0 && (
              <Badge className="rounded-full bg-kinetic/10 px-2.5 py-1 text-xs font-semibold text-kinetic border-none">
                Save {off}%
              </Badge>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm">
            {stock > 0 ? (
              <span className={cn("flex items-center gap-1.5", lowStock ? "text-kinetic font-medium" : "text-muted-foreground")}>
                <span className={cn("h-2 w-2 rounded-full", lowStock ? "bg-kinetic" : "bg-green-500")} />
                {lowStock ? `Only ${stock} left in stock` : "In stock"}
              </span>
            ) : <span className="text-destructive font-medium">Out of stock</span>}
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">SKU {product.sku}</span>
          </div>

          {/* Color Selection */}
          {product.colors?.length > 0 && (
            <div className="mt-7">
              <p className="mb-3 text-sm font-medium">Color: <span className="text-muted-foreground">{color}</span></p>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleColorChange(c)}
                    aria-label={c.name}
                    title={c.name}
                    className={cn(
                      "min-h-[44px] min-w-[44px] rounded-full border-2 transition-all flex items-center justify-center",
                      color === c.name ? "border-kinetic scale-110 shadow-md ring-2 ring-kinetic/30" : "border-border hover:border-foreground"
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium">Size {size && <span className="text-muted-foreground">· UK {size}</span>}</p>
              <Link to="/size-guide" className="text-xs text-kinetic hover:underline font-medium">Size guide</Link>
            </div>
            <SizeSelector
              sizes={product.sizes}
              selectedSize={size}
              onSelectSize={(s) => {
                setSize(s);
                setSizeError(false);
              }}
              disabledSizes={stock <= 0 ? product.sizes : []}
            />
            {sizeError && <p className="mt-2 text-sm text-kinetic font-medium">Please select a size</p>}
          </div>

          {/* Quantity Stepper */}
          <div className="mt-7">
            <p className="mb-3 text-sm font-medium">Quantity</p>
            <QuantityStepper value={qty} onChange={setQty} />
          </div>

          {/* Desktop Actions */}
          <div className="mt-8 hidden flex-col gap-3 sm:flex-row lg:flex">
            <MagneticButton className="flex-1">
              <Button
                type="button"
                onClick={(e) => handleAdd(false, e)}
                className="w-full min-h-[52px] rounded-full bg-foreground py-4 text-sm font-semibold text-background transition-colors hover:bg-kinetic hover:text-white border-none shadow-md"
              >
                {added ? <span className="inline-flex items-center gap-2"><Check size={18} /> Added to cart</span> : "Add to Cart"}
              </Button>
            </MagneticButton>
            <MagneticButton className="flex-1">
              <Button
                type="button"
                onClick={(e) => handleAdd(true, e)}
                className="w-full min-h-[52px] rounded-full bg-kinetic py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 border-none shadow-md"
              >
                Buy Now
              </Button>
            </MagneticButton>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="rounded-xl border border-border p-3"><Truck size={18} className="mx-auto mb-1.5" /><p>Free shipping<br />over $100</p></div>
            <div className="rounded-xl border border-border p-3"><RefreshCw size={18} className="mx-auto mb-1.5" /><p>30-day<br />returns</p></div>
            <div className="rounded-xl border border-border p-3"><ShieldCheck size={18} className="mx-auto mb-1.5" /><p>Secure<br />payment</p></div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Truck size={14} /> Estimated delivery: 3–5 business days</p>
        </div>
      </div>

      {/* Accordions using shadcn Accordion */}
      <div className="mt-16 max-w-3xl">
        <Accordion type="single" collapsible defaultValue="description" className="space-y-3">
          <AccordionItem value="description" className="rounded-2xl border border-border bg-card px-5 overflow-hidden">
            <AccordionTrigger className="font-heading text-base font-semibold py-4 hover:no-underline">
              Description
            </AccordionTrigger>
            <AccordionContent className="text-foreground/80 leading-relaxed text-sm">
              {product.description}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="details" className="rounded-2xl border border-border bg-card px-5 overflow-hidden">
            <AccordionTrigger className="font-heading text-base font-semibold py-4 hover:no-underline">
              Materials & Details
            </AccordionTrigger>
            <AccordionContent className="space-y-2 font-mono text-sm text-muted-foreground">
              <p>{product.details}</p>
              <p>SKU: {product.sku}</p>
              <p>Weight: {product.weight}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping" className="rounded-2xl border border-border bg-card px-5 overflow-hidden">
            <AccordionTrigger className="font-heading text-base font-semibold py-4 hover:no-underline">
              Shipping & Returns
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm text-foreground/80 leading-relaxed">
              <p>Free standard shipping on all orders over $100. Standard delivery 3–5 business days, express 1–2 days.</p>
              <p>Returns accepted within 30 days in original condition. Free return shipping on orders over $100.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="reviews" className="rounded-2xl border border-border bg-card px-5 overflow-hidden">
            <AccordionTrigger className="font-heading text-base font-semibold py-4 hover:no-underline">
              Reviews ({reviews.length})
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="text-center">
                  <p className="font-heading text-5xl font-bold">{product.rating.toFixed(1)}</p>
                  <StarRating rating={product.rating} size={16} className="mt-1 justify-center" />
                  <p className="mt-1 text-xs text-muted-foreground">{product.review_count} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {ratingBreakdown.map((r) => (
                    <div key={r.stars} className="flex items-center gap-2 text-xs">
                      <span className="w-8 text-muted-foreground">{r.stars}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-kinetic"
                          style={{ width: `${reviews.length ? (r.count / reviews.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="w-6 text-muted-foreground">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                {reviews.map((r, i) => (
                  <div key={r.id || i} className="border-b border-border pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{r.title}</p>
                      <StarRating rating={r.rating} size={12} />
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">{r.user_name}</p>
                    <p className="mt-2 text-sm text-foreground/80">{r.body}</p>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeader title="You may also like" subtitle="Complete the set" to="/shop" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="mt-16">
          <SectionHeader title="Recently viewed" subtitle="Pick up where you left off" to="/shop" />
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            {recentlyViewed.map((p, i) => (
              <div key={p.id} className="w-[44%] shrink-0 sm:w-[31%] lg:w-[23%]"><ProductCard product={p} index={i} /></div>
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobile actions directly above MobileNav */}
      <div
        className="fixed inset-x-0 z-30 flex gap-3 border-t border-border bg-background/95 glass p-3 lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
        style={{ bottom: "calc(54px + max(0.25rem, env(safe-area-inset-bottom, 0px)))" }}
      >
        <Button
          type="button"
          onClick={(e) => handleAdd(false, e)}
          className="flex-1 min-h-[48px] rounded-full bg-foreground py-3 text-sm font-bold text-background transition-colors hover:bg-kinetic hover:text-white flex items-center justify-center border-none"
        >
          {added ? <span className="inline-flex items-center gap-2"><Check size={16} /> Added</span> : "Add to Cart"}
        </Button>
        <Button
          type="button"
          onClick={(e) => handleAdd(true, e)}
          className="flex-1 min-h-[48px] rounded-full bg-kinetic py-3 text-sm font-bold text-white flex items-center justify-center transition-opacity hover:opacity-90 shadow-sm border-none"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}