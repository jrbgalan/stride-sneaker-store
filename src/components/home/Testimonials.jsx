import React from "react";
import StarRating from "@/components/StarRating";

const testimonials = [
  { name: "Marcus T.", role: "Verified Buyer", text: "The curation here is unmatched. My Jordans arrived in two days, packaging was immaculate. This is how sneaker shopping should feel.", rating: 5 },
  { name: "Priya K.", role: "Verified Buyer", text: "Beautiful site, even better service. The size guide was spot on and returns were painless. AXIS is my go-to now.", rating: 5 },
  { name: "Daniel R.", role: "Verified Buyer", text: "Editorial-level presentation but it actually works. Found a pair I'd been hunting for months at a great price.", rating: 5 },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Customer Voices</p>
        <h2 className="font-heading text-3xl font-bold tracking-tightest sm:text-4xl">Worn by the obsessed</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border bg-card p-8">
            <StarRating rating={t.rating} size={16} />
            <p className="mt-4 text-foreground/80 leading-relaxed">"{t.text}"</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-secondary font-heading font-bold">{t.name[0]}</div>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}