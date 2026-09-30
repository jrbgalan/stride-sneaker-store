"use client";

import React, { Suspense } from "react";
import AdminCustomers from "@/pages/admin/AdminCustomers";

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading customers…</div>}>
      <AdminCustomers />
    </Suspense>
  );
}
