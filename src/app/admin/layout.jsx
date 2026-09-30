"use client";

import React from "react";
import AdminRoute from "@/components/admin/AdminRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminRootLayout({ children }) {
  return (
    <AdminRoute>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminRoute>
  );
}
