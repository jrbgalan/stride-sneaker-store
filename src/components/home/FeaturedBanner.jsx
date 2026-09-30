import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { ArrowUpRight } from "lucide-react";

const LIFE = "https://media.base44.com/images/public/6abc61b8495468ff0f72fffb/ab3c335df_generated_891e5faa.jpg";

export default function FeaturedBanner() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-foreground text-background">
        <div className="grid items-center lg:grid-cols-2">
          <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:h-[480px] overflow-hidden">
            <Image
              src={LIFE}
              alt="Run faster lifestyle"
              fittingType="fill"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6 sm:p-10 lg:p-16">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-kinetic">
              Featured Collection
            </p>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tightest">
              Run faster.<br />Recover smarter.
            </h2>
            <p className="mt-3 max-w-sm text-sm sm:text-base text-background/70 leading-relaxed">
              Engineered for the long haul. Our performance running collection blends responsive foam with featherweight uppers.
            </p>
            <Link
              to="/shop?category=Running"
              className="group mt-6 sm:mt-8 min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-kinetic hover:text-white"
            >
              Explore the collection{" "}
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}