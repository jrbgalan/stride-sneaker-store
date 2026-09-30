import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  const cols = [
    {
      title: "Shop",
      links: [
        ["All Products", "/shop"],
        ["New Arrivals", "/shop?sort=new"],
        ["Best Sellers", "/shop?sort=rating"],
        ["On Sale", "/shop?sale=true"],
        ["Wishlist", "/wishlist"],
      ],
    },
    {
      title: "Company",
      links: [
        ["About Us", "/about"],
        ["Contact", "/contact"],
        ["FAQ", "/faq"],
        ["Shipping & Returns", "/shipping"],
      ],
    },
    {
      title: "Help",
      links: [
        ["Size Guide", "/size-guide"],
        ["Track Order", "/account"],
        ["Privacy Policy", "/privacy"],
        ["Terms of Service", "/terms"],
      ],
    },
  ];

  return (
    <footer className="mt-16 sm:mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 sm:gap-10 lg:gap-12">
          {/* Brand info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="font-heading text-3xl font-bold tracking-tightest select-none inline-block"
            >
              AXIS
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
              A high-velocity visual ecosystem for elite footwear. Technical performance meets editorial luxury.
            </p>
            {/* Social Icons with minimum 44px tap targets */}
            <div className="mt-5 flex gap-2.5">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card/60 transition-colors hover:border-kinetic hover:text-kinetic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {cols.map((c) => (
            <div key={c.title}>
              <p className="mb-3.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                {c.title}
              </p>
              <ul className="space-y-1">
                {c.links.map(([label, to]) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="inline-flex items-center min-h-[36px] py-1 text-sm text-foreground/80 transition-colors hover:text-kinetic"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright and payment badges */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row text-center sm:text-left">
          <div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} AXIS. Demo store for portfolio purposes.
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground/80">
              Product photography sourced from creators on{" "}
              <a
                href="https://unsplash.com?utm_source=axis_store&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Unsplash
              </a>
              .
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="rounded border border-border bg-card px-2.5 py-1">VISA</span>
            <span className="rounded border border-border bg-card px-2.5 py-1">MASTERCARD</span>
            <span className="rounded border border-border bg-card px-2.5 py-1">PAYPAL</span>
            <span className="rounded border border-border bg-card px-2.5 py-1">APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}