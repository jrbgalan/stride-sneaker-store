import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <p className="font-heading text-[20vw] font-bold leading-none tracking-tightest text-foreground/10 sm:text-[12rem]">404</p>
        <h1 className="-mt-8 font-heading text-3xl font-bold tracking-tightest sm:text-4xl">Page not found</h1>
        <p className="mt-3 text-muted-foreground">The page you're looking for took off without you.</p>
        <Link to="/" className="mt-8 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background hover:bg-kinetic hover:text-white"><Home size={16} /> Back home</Link>
      </div>
    </div>
  );
}