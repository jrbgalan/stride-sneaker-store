import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import StarRating from "@/components/StarRating";
import { Empty } from "@/lib/adminUtils";
import { Check, EyeOff, Trash2, Star } from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    base44.entities.Review.list("-created_date", 200).then((r) => { setReviews(r); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const update = async (id, data) => {
    try { await base44.entities.Review.update(id, data); load(); } catch {}
  };
  const remove = async (id) => {
    try { await base44.entities.Review.delete(id); setReviews((prev) => prev.filter((r) => r.id !== id)); } catch {}
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-bold">Reviews</h1>
        <p className="text-sm text-muted-foreground">{reviews.length} total · {reviews.filter((r) => !r.hidden).length} visible</p>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 rounded-2xl shimmer" />)}</div>
      ) : reviews.length === 0 ? (
        <Empty text="No reviews yet" icon={Star} />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <StarRating rating={r.rating} size={14} />
                    <p className="font-semibold">{r.title || "Review"}</p>
                    {r.hidden && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Hidden</span>}
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">{r.user_name} · {r.product_name || "Product"}</p>
                  {r.body && <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => update(r.id, { hidden: false })} className="grid h-11 w-11 place-items-center rounded-xl border border-border hover:bg-green-500/10 hover:text-green-600" aria-label="Approve"><Check size={18} /></button>
                  <button onClick={() => update(r.id, { hidden: true })} className="grid h-11 w-11 place-items-center rounded-xl border border-border hover:bg-muted" aria-label="Hide"><EyeOff size={18} /></button>
                  <button onClick={() => remove(r.id)} className="grid h-11 w-11 place-items-center rounded-xl border border-border text-destructive hover:bg-destructive/10" aria-label="Delete"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}