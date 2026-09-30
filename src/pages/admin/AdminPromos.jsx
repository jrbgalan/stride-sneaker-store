import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Empty } from "@/lib/adminUtils";
import { cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Ticket } from "lucide-react";

export default function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    base44.entities.PromoCode.list("-created_date", 100).then((p) => { setPromos(p); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    try { await base44.entities.PromoCode.delete(id); setPromos((prev) => prev.filter((p) => p.id !== id)); } catch {}
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Promo Codes</h1>
          <p className="text-sm text-muted-foreground">{promos.length} codes</p>
        </div>
        <button onClick={() => setEditing("new")} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-kinetic hover:text-white">
          <Plus size={16} /> Add Code
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 rounded-2xl shimmer" />)}</div>
      ) : promos.length === 0 ? (
        <Empty text="No promo codes yet" icon={Ticket} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-lg font-bold">{p.code}</p>
                  <p className="text-sm text-muted-foreground">{p.type === "percent" ? `${p.value}% off` : `$${p.value} off`}</p>
                </div>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", p.active ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-secondary text-muted-foreground")}>{p.active ? "Active" : "Inactive"}</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button onClick={() => setEditing(p)} className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"><Pencil size={13} /> Edit</button>
                <button onClick={() => remove(p.id)} className="grid h-11 w-11 place-items-center rounded-full border border-border text-destructive hover:bg-destructive/10" aria-label="Delete promo"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <PromoEditor promo={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}

function PromoEditor({ promo, onClose, onSaved }) {
  const [form, setForm] = useState(promo ? { ...promo } : { code: "", type: "percent", value: 10, active: true });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    const payload = { ...form, code: form.code.toUpperCase().trim() };
    try {
      if (promo?.id) await base44.entities.PromoCode.update(promo.id, payload);
      else await base44.entities.PromoCode.create(payload);
      onSaved(); onClose();
    } catch { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[calc(100%-2rem)] max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold">{promo ? "Edit Code" : "Add Code"}</h2>
          <button onClick={onClose} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-full hover:bg-muted"><X size={22} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Code</label>
            <input value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="WELCOME10" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm uppercase outline-none focus:border-kinetic" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Type</label>
            <div className="flex gap-2">
              {[{ v: "percent", l: "Percentage" }, { v: "fixed", l: "Fixed amount" }].map((t) => (
                <button key={t.v} onClick={() => set("type", t.v)} className={cn("flex min-h-[44px] flex-1 items-center justify-center rounded-xl border py-2.5 text-sm font-medium", form.type === t.v ? "border-kinetic bg-kinetic/5" : "border-border")}>{t.l}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{form.type === "percent" ? "Percentage (%)" : "Amount ($)"}</label>
            <input type="number" value={form.value} onChange={(e) => set("value", Number(e.target.value))} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-kinetic" />
          </div>
          <label className="flex min-h-[44px] items-center gap-2 text-sm font-medium"><input type="checkbox" checked={!!form.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 accent-kinetic" /> Active</label>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="min-h-[44px] flex-1 rounded-full border border-border py-2.5 text-sm font-semibold hover:bg-muted">Cancel</button>
          <button onClick={save} disabled={saving || !form.code} className="min-h-[44px] flex-1 rounded-full bg-foreground py-2.5 text-sm font-semibold text-background hover:bg-kinetic hover:text-white disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}