"use client";

import React, { Suspense } from "react";
import AdminPromos from "@/pages/admin/AdminPromos";

export default function AdminPromosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading promos…</div>}>
      <AdminPromos />
    </Suspense>
  );
}
