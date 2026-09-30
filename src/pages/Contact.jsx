import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const e2 = {};
    Object.keys(form).forEach((k) => {
      if (!form[k].trim()) e2[k] = "Required";
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e2.email = "Invalid email";
    setErr(e2);
    if (Object.keys(e2).length === 0) setSent(true);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-kinetic">Get in touch</p>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tightest">Contact us</h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Questions about an order, a product, or anything else? We typically reply within 24 hours.
        </p>
      </div>

      <div className="mt-8 sm:mt-12 grid gap-8 sm:gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          {sent ? (
            <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-kinetic/10 text-kinetic mb-4">
                <Check size={36} />
              </div>
              <h2 className="font-heading text-2xl font-bold">Message sent</h2>
              <p className="mt-2 text-muted-foreground">Thanks {form.name}. We'll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full min-h-[44px] rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-kinetic"
                  />
                  {err.name && <p className="mt-1 text-xs text-destructive">{err.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    type="email"
                    className="w-full min-h-[44px] rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-kinetic"
                  />
                  {err.email && <p className="mt-1 text-xs text-destructive">{err.email}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Subject</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full min-h-[44px] rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-kinetic"
                />
                {err.subject && <p className="mt-1 text-xs text-destructive">{err.subject}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-kinetic"
                />
                {err.message && <p className="mt-1 text-xs text-destructive">{err.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background hover:bg-kinetic hover:text-white transition-colors"
              >
                <Send size={16} /> Send message
              </button>
            </form>
          )}
        </div>

        <aside className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <Mail size={20} className="text-kinetic" />
            <p className="mt-2.5 font-semibold text-sm">Email</p>
            <p className="text-sm text-muted-foreground">hello@axis.store</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <Phone size={20} className="text-kinetic" />
            <p className="mt-2.5 font-semibold text-sm">Phone</p>
            <p className="text-sm text-muted-foreground">+1 (555) 012-3456</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <MapPin size={20} className="text-kinetic" />
            <p className="mt-2.5 font-semibold text-sm">Showroom</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              123 Design District<br />New York, NY 10001
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}