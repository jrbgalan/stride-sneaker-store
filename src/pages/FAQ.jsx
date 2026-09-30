import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "How long does shipping take?", a: "Standard shipping takes 3–5 business days. Express delivery (1–2 business days) is available at checkout for $25. Free standard shipping applies to all orders over $100." },
  { q: "What is your return policy?", a: "We accept returns within 30 days of delivery in original, unworn condition. Returns are free for orders over $100. Refunds are processed within 5 business days of receiving your return." },
  { q: "How do I find the right size?", a: "Check our Size Guide for UK, US, and EU conversions. If you're between sizes, we recommend sizing up for running shoes and staying true to size for lifestyle sneakers." },
  { q: "Are your products authentic?", a: "Every product on AXIS is 100% authentic, sourced directly from authorized brand distributors. Each pair ships with original packaging and tags." },
  { q: "Do you ship internationally?", a: "Yes — we ship to over 60 countries. International shipping costs and times are calculated at checkout based on your destination." },
  { q: "How can I track my order?", a: "Once your order ships, you'll receive a tracking number via email. You can also track your order anytime from the Account page." },
  { q: "Can I cancel or modify my order?", a: "Orders can be modified or cancelled within 1 hour of placing them. Contact us immediately and we'll do our best to help." },
  { q: "Do you offer student discounts?", a: "Yes — verified students receive 10% off. Use code STUDENT10 at checkout after verifying your status." },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-kinetic">Help Center</p>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tightest">
          Frequently asked questions
        </h1>
      </div>
      <div className="mt-8 sm:mt-12 space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full min-h-[48px] items-center justify-between gap-4 p-4 sm:p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic"
            >
              <span className="font-heading text-base sm:text-lg font-medium">{f.q}</span>
              <ChevronDown size={20} className={cn("shrink-0 transition-transform duration-200", open === i && "rotate-180 text-kinetic")} />
            </button>
            {open === i && <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-sm sm:text-base text-muted-foreground leading-relaxed animate-fade-up">{f.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}