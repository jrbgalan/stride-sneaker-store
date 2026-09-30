import React, { useState } from "react";
import { Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("Enter a valid email address"); return; }
    setErr(""); setDone(true);
  };
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-16 text-center text-background sm:px-12">
        <div className="absolute inset-0 grid place-items-center opacity-5">
          <span className="font-heading text-[20vw] font-bold leading-none tracking-tightest lg:text-[12rem]">JOIN</span>
        </div>
        <div className="relative">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-background/60">Newsletter</p>
          <h2 className="font-heading text-3xl font-bold tracking-tightest sm:text-4xl">Step into the inner circle</h2>
          <p className="mx-auto mt-3 max-w-md text-background/70">Get early access to drops, members-only pricing, and 10% off your first order.</p>
          {done ? (
            <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-full bg-kinetic px-6 py-4 text-sm font-semibold">
              <Check size={18} /> You're in. Check your inbox for WELCOME10.
            </div>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                className="h-12 min-h-[48px] flex-1 rounded-full border border-background/20 bg-background/10 px-5 text-sm text-background placeholder:text-background/40 outline-none focus:border-kinetic"
              />
              <button type="submit" className="inline-flex h-12 min-h-[48px] items-center justify-center rounded-full bg-kinetic px-7 text-sm font-semibold text-white transition-opacity hover:opacity-90">Subscribe</button>
            </form>
          )}
          {err && <p className="mt-2 text-sm text-kinetic">{err}</p>}
        </div>
      </div>
    </section>
  );
}