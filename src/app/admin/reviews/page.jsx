"use client";

import React, { Suspense } from "react";
import AdminReviews from "@/pages/admin/AdminReviews";

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading reviews…</div>}>
      <AdminReviews />
    </Suspense>
  );
}
