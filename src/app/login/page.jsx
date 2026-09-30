"use client";

import React, { Suspense } from "react";
import Login from "@/pages/Login";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading login…</div>}>
      <Login />
    </Suspense>
  );
}
