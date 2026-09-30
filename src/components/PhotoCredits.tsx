"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoCreditsProps {
  photographer?: string;
  photographerUrl?: string;
  sourceLink?: string;
  className?: string;
}

export default function PhotoCredits({
  photographer,
  photographerUrl,
  sourceLink,
  className,
}: PhotoCreditsProps) {
  if (!photographer) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors",
        className
      )}
    >
      <span>Photo by</span>
      <a
        href={photographerUrl || "https://unsplash.com"}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium underline decoration-muted-foreground/40 underline-offset-2 hover:text-foreground hover:decoration-foreground"
      >
        {photographer}
      </a>
      <span>on</span>
      <a
        href={sourceLink || "https://unsplash.com"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-0.5 underline decoration-muted-foreground/40 underline-offset-2 hover:text-foreground hover:decoration-foreground"
      >
        Unsplash
        <ExternalLink size={10} className="ml-0.5 inline opacity-70" />
      </a>
    </div>
  );
}

