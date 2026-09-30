"use client";

import React, { Suspense } from "react";
import Register from "@/pages/Register";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading registration…</div>}>
      <Register />
    </Suspense>
  );
}
