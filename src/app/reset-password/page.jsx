"use client";

import React, { Suspense } from "react";
import ResetPassword from "@/pages/ResetPassword";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>}>
      <ResetPassword />
    </Suspense>
  );
}
