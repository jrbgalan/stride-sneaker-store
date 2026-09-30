import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function MagneticCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 1024) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let rx = 0, ry = 0, dx = 0, dy = 0, raf;
    const move = (e) => {
      dx = e.clientX; dy = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${dx}px,${dy}px)`;
    };
    const loop = () => {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e) => { if (e.target.closest("a,button,[role=button],.group,input,select,textarea")) setHovering(true); };
    const out = (e) => { if (e.target.closest("a,button,[role=button],.group,input,select,textarea")) setHovering(false); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={dotRef} className="pointer-events-none fixed left-0 top-0 z-[9998] -ml-1 -mt-1 h-2 w-2 rounded-full bg-kinetic" />
      <div ref={ringRef} className={cn("pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-kinetic/50 transition-all duration-200", hovering ? "h-12 w-12 -ml-6 -mt-6 opacity-100" : "h-8 w-8 -ml-4 -mt-4 opacity-50")} />
    </>
  );
}