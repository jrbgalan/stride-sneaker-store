"use client";

import React, { Suspense } from "react";
import Layout from "@/components/layout/Layout";
import Search from "@/pages/Search";

export default function SearchPage() {
  return (
    <Layout>
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Searching…</div>}>
        <Search />
      </Suspense>
    </Layout>
  );
}
