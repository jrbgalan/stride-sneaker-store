"use client";

import React, { Suspense } from "react";
import Layout from "@/components/layout/Layout";
import OrderConfirmation from "@/pages/OrderConfirmation";

export default function OrderConfirmationPage() {
  return (
    <Layout>
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading order…</div>}>
        <OrderConfirmation />
      </Suspense>
    </Layout>
  );
}
