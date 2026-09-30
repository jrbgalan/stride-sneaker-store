"use client";

import React, { Suspense } from "react";
import AdminOverview from "@/pages/admin/AdminOverview";

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading admin…</div>}>
      <AdminOverview />
    </Suspense>
  );
}
