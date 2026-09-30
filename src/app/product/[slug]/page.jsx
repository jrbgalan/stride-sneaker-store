"use client";

import React, { Suspense } from "react";
import Layout from "@/components/layout/Layout";
import ProductDetail from "@/pages/ProductDetail";

export default function ProductDetailPage() {
  return (
    <Layout>
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading product…</div>}>
        <ProductDetail />
      </Suspense>
    </Layout>
  );
}
