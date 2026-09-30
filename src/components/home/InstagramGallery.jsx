import React, { useState, useEffect, useCallback } from "react";
import { Image } from "@/components/ui/image";
import { Instagram, Heart, MessageCircle, X, ChevronLeft, ChevronRight } from "lucide-react";

const IMAGES = [
  "https://images.unsplash.com/photo-1542291026-7eec264c35ff?w=600&q=80",
  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd14eda8?w=600&q=80",
  "https://images.unsplash.com/photo-1552346153-21d028f89f56?w=600&q=80",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80",
];

const META = [
  { likes: "2.4k", comments: 128 },
  { likes: "1.8k", comments: 94 },
  { likes: "3.1k", comments: 201 },
  { likes: "982", comments: 56 },
  { likes: "4.2k", comments: 312 },
  { likes: "1.5k", comments: 77 },
];

export default function InstagramGallery() {
  const [lightbox, setLightbox] = useState(null);
  const close = useCallback(() => setLightbox(null), []);
  const next = useCallback(() => setLightbox((i) => (i === null ? i : (i + 1) % IMAGES.length)), []);
  const prev = useCallback(() => setLightbox((i) => (i === null ? i : (i - 1 + IMAGES.length) % IMAGES.length)), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") next(); if (e.key === "ArrowLeft") prev(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, next, prev]);

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-kinetic">Follow us @stride</p>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tightest sm:text-4xl">From the community</h2>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-5 min-h-[44px] inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-semibold transition-colors hover:border-kinetic hover:text-kinetic">
          <Instagram size={16} /> Follow on Instagram
        </a>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible">
        {IMAGES.map((img, i) => (
          <button key={i} onClick={() => setLightbox(i)} className="group relative aspect-square w-[78vw] shrink-0 snap-center overflow-hidden rounded-2xl bg-secondary sm:w-[42vw] lg:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic">
            <Image src={img} alt={`Community post ${i + 1}`} fittingType="fill" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 flex items-center justify-center gap-4 bg-foreground/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-white"><Heart size={18} /> {META[i].likes}</span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-white"><MessageCircle size={18} /> {META[i].comments}</span>
            </div>
            <Instagram size={20} className="absolute right-3 top-3 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        ))}
      </div>
      {lightbox !== null && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/90 backdrop-blur-sm p-4" onClick={close}>
          <button className="absolute right-4 top-4 z-10 min-h-[44px] min-w-[44px] grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors" onClick={close} aria-label="Close"><X size={24} /></button>
          <button className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 min-h-[44px] min-w-[44px] grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous"><ChevronLeft size={28} /></button>
          <img src={IMAGES[lightbox]} alt="" className="max-h-[80vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 min-h-[44px] min-w-[44px] grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next"><ChevronRight size={28} /></button>
        </div>
      )}
    </section>
  );
}