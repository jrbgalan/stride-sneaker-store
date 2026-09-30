"use client";

import React, { Suspense } from "react";
import AdminOrders from "@/pages/admin/AdminOrders";

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading orders…</div>}>
      <AdminOrders />
    </Suspense>
  );
}
