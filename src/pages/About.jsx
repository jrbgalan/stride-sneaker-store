import React from "react";
import { Image } from "@/components/ui/image";
import { Link } from "react-router-dom";
import Features from "@/components/home/Features";

const LIFE = "https://media.base44.com/images/public/6abc61b8495468ff0f72fffb/ab3c335df_generated_891e5faa.jpg";

export default function About() {
  return (
    <div>
      <section className="mx-auto max-w-[1600px] px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-kinetic">Our Story</p>
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tightest">
            Built for those<br />who refuse to stand still.
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
            AXIS is a high-velocity visual ecosystem for elite footwear. We treat every sneaker as a masterwork of industrial design — curating the world's best brands into a single, frictionless flagship where technical performance meets editorial luxury.
          </p>
        </div>
        <div className="mt-8 sm:mt-12 overflow-hidden rounded-3xl">
          <Image
            src={LIFE}
            alt="AXIS lifestyle"
            fittingType="fill"
            className="h-[240px] sm:h-[400px] w-full object-cover"
          />
        </div>
      </section>

      <Features />

      <section className="mx-auto max-w-[1600px] px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:gap-8 sm:grid-cols-3">
          {[
            ["2019", "Founded in a garage with a single pair of Jordans"],
            ["1M+", "Pairs shipped to sneakerheads worldwide"],
            ["98%", "Customer satisfaction rate"],
          ].map(([n, d]) => (
            <div key={n} className="rounded-2xl border border-border bg-card p-6 sm:p-8 text-center">
              <p className="font-heading text-4xl sm:text-5xl font-bold text-kinetic">{n}</p>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 pb-16 sm:pb-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tightest">Join the movement</h2>
        <Link
          to="/shop"
          className="mt-5 min-h-[48px] inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background hover:bg-kinetic hover:text-white transition-colors"
        >
          Shop the collection
        </Link>
      </section>
    </div>
  );
}