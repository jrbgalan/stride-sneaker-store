import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/lib/hooks/useCart";
import { base44 } from "@/api/base44Client";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";
import { Check, CreditCard, Wallet, Banknote, Truck, Zap } from "lucide-react";
import { getSettings } from "@/lib/storeSettings";

const steps = ["Shipping", "Delivery", "Payment", "Review"];

export default function Checkout() {
  const { cart, subtotal, discount, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", zip: "", country: "United States" });
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("card");
  const [errors, setErrors] = useState({});

  const settings = getSettings();
  const shipping = delivery === "express" ? 25 : (subtotal >= settings.free_shipping_threshold || subtotal === 0 ? 0 : settings.shipping_fee);
  const tax = Math.round((subtotal - discount) * settings.tax_rate * 100) / 100;
  const total = subtotal - discount + shipping + tax;

  if (cart.length === 0 && step < 3) {
    return <div className="mx-auto max-w-[1600px] px-4 py-24 text-center"><h1 className="font-heading text-3xl font-bold">Your cart is empty</h1><Link to="/shop" className="mt-6 inline-block text-kinetic">Continue shopping</Link></div>;
  }

  const validateShipping = () => {
    const e = {};
    ["name","email","address","city","state","zip"].forEach((k) => { if (!form[k].trim()) e[k] = "Required"; });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    const orderNumber = "AX" + Date.now().toString().slice(-8);
    try {
      await base44.entities.Order.create({
        order_number: orderNumber,
        items: cart.map((i) => ({ product_id: i.product_id, name: i.name, image: i.image, size: i.size, color: i.color, quantity: i.quantity, price: i.price })),
        subtotal, shipping, tax, discount, total,
        status: "Processing",
        shipping_address: form, delivery_method: delivery, payment_method: payment,
      });
    } catch {}
    clearCart();
    navigate(`/order-confirmation?order=${orderNumber}&total=${total.toFixed(2)}`);
  };

  const next = () => { if (step === 0 && !validateShipping()) return; setStep((s) => Math.min(3, s + 1)); };

  const Input = ({ name, label, ...props }) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} className={cn("w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:border-kinetic", errors[name] ? "border-destructive" : "border-border")} {...props} />
      {errors[name] && <p className="mt-1 text-xs text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-4xl font-bold tracking-tightest">Checkout</h1>
      <div className="mb-8 sm:mb-10 flex items-center justify-center max-w-full overflow-hidden">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1 sm:gap-2 shrink-0">
              <div
                className={cn(
                  "grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full text-xs sm:text-sm font-semibold transition-colors",
                  i <= step
                    ? "bg-kinetic text-white"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {i < step ? <Check size={15} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-medium",
                  i <= step ? "text-foreground font-semibold" : "text-muted-foreground"
                )}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-1 sm:mx-2.5 h-0.5 w-5 sm:w-16 lg:w-24 shrink transition-all",
                  i < step ? "bg-kinetic" : "bg-secondary"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold">Shipping Address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input name="name" label="Full name" />
                <Input name="email" label="Email" type="email" />
                <Input name="phone" label="Phone" />
                <Input name="address" label="Street address" className="sm:col-span-2" />
                <Input name="city" label="City" />
                <Input name="state" label="State / Province" />
                <Input name="zip" label="ZIP / Postal code" />
                <Input name="country" label="Country" />
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold">Delivery Method</h2>
              {[{ id: "standard", icon: Truck, name: "Standard", desc: "3–5 business days", price: subtotal >= 100 ? "Free" : "$12" }, { id: "express", icon: Zap, name: "Express", desc: "1–2 business days", price: "$25" }].map((o) => (
                <button key={o.id} onClick={() => setDelivery(o.id)} className={cn("flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all", delivery === o.id ? "border-kinetic bg-kinetic/5" : "border-border hover:border-foreground")}>
                  <o.icon size={24} />
                  <div className="flex-1"><p className="font-semibold">{o.name}</p><p className="text-sm text-muted-foreground">{o.desc}</p></div>
                  <span className="font-semibold">{o.price}</span>
                </button>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold">Payment Method</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {[{ id: "card", icon: CreditCard, name: "Card" }, { id: "paypal", icon: Wallet, name: "PayPal" }, { id: "cod", icon: Banknote, name: "Cash on Delivery" }].map((o) => (
                  <button key={o.id} onClick={() => setPayment(o.id)} className={cn("flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all", payment === o.id ? "border-kinetic bg-kinetic/5" : "border-border hover:border-foreground")}>
                    <o.icon size={24} /><span className="text-sm font-medium">{o.name}</span>
                  </button>
                ))}
              </div>
              {payment === "card" && (
                <div className="mt-4 space-y-4 rounded-2xl border border-border p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Demo mode — no real charges</p>
                  <input placeholder="Card number" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-kinetic" />
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="MM / YY" className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-kinetic" />
                    <input placeholder="CVC" className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-kinetic" />
                  </div>
                </div>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold">Review Your Order</h2>
              <div className="rounded-2xl border border-border p-5">
                <p className="mb-2 font-semibold">Shipping to</p>
                <p className="text-sm text-muted-foreground">{form.name}<br />{form.address}, {form.city}, {form.state} {form.zip}<br />{form.country}</p>
              </div>
              <div className="rounded-2xl border border-border p-5">
                <p className="mb-2 font-semibold">Delivery</p>
                <p className="text-sm text-muted-foreground capitalize">{delivery === "express" ? "Express (1–2 days)" : "Standard (3–5 days)"}</p>
              </div>
              <div className="rounded-2xl border border-border p-5">
                <p className="mb-2 font-semibold">Payment</p>
                <p className="text-sm text-muted-foreground capitalize">{payment === "cod" ? "Cash on Delivery" : payment}</p>
              </div>
              <div className="rounded-2xl border border-border p-5">
                <p className="mb-3 font-semibold">Items ({cart.length})</p>
                <ul className="space-y-3">
                  {cart.map((i) => (
                    <li key={i.key} className="flex justify-between text-sm"><span className="text-muted-foreground">{i.name} × {i.quantity}</span><span>{formatPrice(i.price * i.quantity)}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="rounded-full border border-border px-6 py-3.5 text-sm font-semibold hover:bg-muted">Back</button>}
            {step < 3 ? (
              <button onClick={next} className="flex-1 rounded-full bg-foreground py-3.5 text-sm font-semibold text-background hover:bg-kinetic hover:text-white transition-colors">Continue</button>
            ) : (
              <button onClick={placeOrder} className="flex-1 rounded-full bg-kinetic py-3.5 text-sm font-semibold text-white hover:opacity-90">Place Order · {formatPrice(total)}</button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-heading text-xl font-bold">Order Summary</h2>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto">
            {cart.map((i) => (
              <li key={i.key} className="flex gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary"><img src={i.image} alt={i.name} className="h-full w-full object-contain p-1" /></div>
                <div className="flex-1 text-sm"><p className="font-medium leading-tight">{i.name}</p><p className="text-xs text-muted-foreground">Size {i.size} · ×{i.quantity}</p></div>
                <span className="text-sm font-semibold">{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-kinetic"><span>Discount</span><span>−{formatPrice(discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(tax)}</span></div>
            <div className="border-t border-border pt-2 flex justify-between font-semibold"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}