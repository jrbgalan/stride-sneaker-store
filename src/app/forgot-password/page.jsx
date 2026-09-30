"use client";

import React, { Suspense } from "react";
import ForgotPassword from "@/pages/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>}>
      <ForgotPassword />
    </Suspense>
  );
}
