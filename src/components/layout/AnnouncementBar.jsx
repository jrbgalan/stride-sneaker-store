import React, { useEffect, useState } from "react";
import { Truck } from "lucide-react";

const messages = [
  "Free shipping on orders over $100",
  "Up to 70% Off — Final Markdowns",
  "New Arrivals dropping weekly",
  "Use code WELCOME10 for 10% off your first order",
];

export default function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-foreground text-background">
      <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-center gap-2 px-4 text-center text-xs font-medium tracking-wide">
        <Truck size={14} className="hidden sm:block" />
        <span key={i} className="animate-fade-up">{messages[i]}</span>
      </div>
    </div>
  );
}