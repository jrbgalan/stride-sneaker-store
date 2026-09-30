import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import Hero from "@/components/home/Hero";
import BrandStrip from "@/components/home/BrandStrip";
import { CategoryChipsLinks } from "@/components/home/CategoryChips";
import Features from "@/components/home/Features";
import FeaturedBanner from "@/components/home/FeaturedBanner";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import InstagramGallery from "@/components/home/InstagramGallery";
import SectionHeader from "@/components/SectionHeader";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";

function ProductRow({ title, subtitle, filter }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    base44.entities.Product.filter(filter, "-created_date", 12).then(setItems).catch(() => {});
  }, [JSON.stringify(filter)]);
  if (!items.length) return null;
  return (
    <ScrollReveal className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <SectionHeader title={title} subtitle={subtitle} to="/shop" />
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
        {items.map((p, i) => (
          <div key={p.id} className="w-[44%] shrink-0 sm:w-[31%] lg:w-[23%] xl:w-[19%]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}

export default function Home() {
  return (
    <div>
      <Hero />
      <BrandStrip />
      <CategoryChipsLinks />
      <ProductRow title="New Arrivals" subtitle="Just landed" filter={{ new_arrival: true }} />
      <FeaturedBanner />
      <ProductRow title="Best Sellers" subtitle="Most wanted" filter={{ best_seller: true }} />
      <ProductRow title="On Sale" subtitle="Final markdowns" filter={{ on_sale: true }} />
      <Features />
      <ProductRow title="Trending Now" subtitle="What everyone's wearing" filter={{ trending: true }} />
      <InstagramGallery />
      <Testimonials />
      <Newsletter />
    </div>
  );
}