import React from "react";
import { Link } from "react-router-dom";

export function Shipping() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tightest">Shipping & Returns</h1>
      <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8 text-foreground/80 leading-relaxed text-sm sm:text-base">
        <section>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Shipping</h2>
          <p className="mt-2">We offer free standard shipping on all orders over $100 within the United States. Standard delivery takes 3–5 business days. Express shipping (1–2 business days) is available for $25. International shipping is calculated at checkout and typically takes 7–14 business days depending on destination.</p>
        </section>
        <section>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Returns</h2>
          <p className="mt-2">We accept returns within 30 days of delivery. Items must be in original, unworn condition with all packaging intact. Returns are free for orders over $100; otherwise a $8 return fee applies. Refunds are processed within 5 business days of receiving your return.</p>
        </section>
        <section>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Exchanges</h2>
          <p className="mt-2">Need a different size? Start an exchange from your account page within 30 days. We'll ship your new size as soon as we receive the original pair.</p>
        </section>
      </div>
      <Link to="/contact" className="mt-8 min-h-[44px] inline-flex items-center text-kinetic font-medium hover:underline">
        Still have questions? Contact us →
      </Link>
    </div>
  );
}

export function SizeGuide() {
  const rows = [
    ["UK", "6", "7", "8", "9", "10", "11", "12", "13"],
    ["US", "7", "8", "9", "10", "11", "12", "13", "14"],
    ["EU", "40", "41", "42", "43", "44", "45", "46", "47"],
    ["CM", "24.5", "25.5", "26.5", "27.5", "28.5", "29.5", "30.5", "31.5"],
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tightest">Size Guide</h1>
      <p className="mt-3 text-sm sm:text-base text-muted-foreground">Find your perfect fit. Measure your foot from heel to longest toe and match to the chart below.</p>
      <div className="mt-6 sm:mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full border-collapse text-xs sm:text-sm whitespace-nowrap">
          <tbody>
            {rows.map((r, i) => (
              <tr key={r[0]} className={i % 2 ? "bg-secondary/40" : ""}>
                {r.map((c, j) => (
                  <td key={j} className={`border border-border/60 px-3 sm:px-4 py-3 ${j === 0 ? "font-bold bg-secondary" : "text-center"}`}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-5 text-xs sm:text-sm text-muted-foreground">Tip: If you're between sizes, size up for running shoes and stay true to size for lifestyle sneakers.</p>
    </div>
  );
}

export function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tightest">Privacy Policy</h1>
      <div className="mt-6 sm:mt-8 space-y-6 text-foreground/80 leading-relaxed text-sm sm:text-base">
        <p>AXIS respects your privacy. This policy explains how we collect, use, and protect your personal information.</p>
        <section>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">Information we collect</h2>
          <p className="mt-1">We collect your name, email, shipping address, and payment details when you place an order or create an account.</p>
        </section>
        <section>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">How we use it</h2>
          <p className="mt-1">To process orders, provide customer support, send order updates, and improve our store. We never sell your data.</p>
        </section>
        <section>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">Your rights</h2>
          <p className="mt-1">You can access, correct, or delete your personal data anytime from your account or by contacting us.</p>
        </section>
      </div>
    </div>
  );
}

export function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tightest">Terms of Service</h1>
      <div className="mt-6 sm:mt-8 space-y-6 text-foreground/80 leading-relaxed text-sm sm:text-base">
        <p>By using AXIS, you agree to these terms. This is a demo store for portfolio purposes — no real transactions are processed.</p>
        <section>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">Orders</h2>
          <p className="mt-1">All orders are subject to availability. We reserve the right to refuse or cancel any order.</p>
        </section>
        <section>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">Pricing</h2>
          <p className="mt-1">Prices are listed in USD and may change without notice. Sale prices are valid for a limited time.</p>
        </section>
        <section>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">Liability</h2>
          <p className="mt-1">AXIS is not liable for indirect damages arising from the use of this site.</p>
        </section>
      </div>
    </div>
  );
}

export default function ContentPages() {
  return <Shipping />;
}