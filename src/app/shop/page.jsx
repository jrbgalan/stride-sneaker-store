"use client";

import React, { Suspense } from "react";
import Layout from "@/components/layout/Layout";
import Shop from "@/pages/Shop";

export default function ShopPage() {
  return (
    <Layout>
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading catalog…</div>}>
        <Shop />
      </Suspense>
    </Layout>
  );
}
