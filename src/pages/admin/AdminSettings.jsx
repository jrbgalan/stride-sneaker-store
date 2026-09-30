import React, { useState } from "react";
import { getSettings, saveSettings, DEFAULT_SETTINGS } from "@/lib/storeSettings";
import { Check } from "lucide-react";

export default function AdminSettings() {
  const [form, setForm] = useState(getSettings());
  const [saved, setSaved] = useState(false);
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setSaved(false); };

  const save = () => {
    saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls = "h-11 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:border-kinetic";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Store configuration applied across the storefront</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Store Info</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Store Name</label>
            <input value={form.store_name} onChange={(e) => set("store_name", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Contact Email</label>
            <input value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Shipping & Tax</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Shipping Fee ($)</label>
            <input type="number" value={form.shipping_fee} onChange={(e) => set("shipping_fee", Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Free Shipping Threshold ($)</label>
            <input type="number" value={form.free_shipping_threshold} onChange={(e) => set("free_shipping_threshold", Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Tax Rate (%)</label>
            <input type="number" step="0.01" value={form.tax_rate * 100} onChange={(e) => set("tax_rate", Number(e.target.value) / 100)} className={inputCls} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition-colors hover:bg-kinetic hover:text-white">Save Settings</button>
        {saved && <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400"><Check size={16} /> Saved</span>}
      </div>
      <button onClick={() => setForm(DEFAULT_SETTINGS)} className="inline-flex min-h-[44px] items-center text-sm text-muted-foreground hover:text-foreground">Reset to defaults</button>
    </div>
  );
}