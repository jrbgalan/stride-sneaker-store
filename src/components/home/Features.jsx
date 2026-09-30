import React from "react";
import { Truck, RefreshCw, ShieldCheck, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $100" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day free returns" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "Encrypted checkout" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

export default function Features() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-px px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-3 px-2 py-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-background">
              <f.icon size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}