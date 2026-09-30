"use client";

import React, { Suspense } from "react";
import AdminProducts from "@/pages/admin/AdminProducts";

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading products…</div>}>
      <AdminProducts />
    </Suspense>
  );
}
