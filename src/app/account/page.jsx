"use client";

import React, { Suspense } from "react";
import Layout from "@/components/layout/Layout";
import Account from "@/pages/Account";

export default function AccountPage() {
  return (
    <Layout>
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading account…</div>}>
        <Account />
      </Suspense>
    </Layout>
  );
}
