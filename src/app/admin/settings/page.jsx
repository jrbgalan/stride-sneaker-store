"use client";

import React, { Suspense } from "react";
import AdminSettings from "@/pages/admin/AdminSettings";

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading settings…</div>}>
      <AdminSettings />
    </Suspense>
  );
}
