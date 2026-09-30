import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, Package, Mail } from "lucide-react";

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const order = params.get("order");
  const total = params.get("total");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSent(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-24 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-kinetic/10 shadow-sm">
        <Check size={40} className="text-kinetic" />
      </div>
      <h1 className="mt-6 font-heading text-3xl sm:text-4xl font-bold tracking-tightest">
        Order confirmed
      </h1>
      <p className="mt-2 text-sm sm:text-base text-muted-foreground">
        Thank you for your purchase. We're getting your sneakers ready.
      </p>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-left shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Order number</span>
          <span className="font-mono font-semibold text-sm">{order}</span>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total paid</span>
          <span className="font-semibold text-base">${total}</span>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Status</span>
          <span className="font-semibold text-sm text-kinetic">Processing</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <Mail size={16} /> {sent ? "Confirmation email sent (simulated)" : "Sending confirmation…"}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
        <Link
          to="/account"
          className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
        >
          <Package size={16} /> Track order
        </Link>
        <Link
          to="/shop"
          className="min-h-[48px] inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-kinetic hover:text-white transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}