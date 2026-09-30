"use client";

import React, { Suspense } from "react";
import Layout from "@/components/layout/Layout";
import Checkout from "@/pages/Checkout";

export default function CheckoutPage() {
  return (
    <Layout>
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading checkout…</div>}>
        <Checkout />
      </Suspense>
    </Layout>
  );
}
