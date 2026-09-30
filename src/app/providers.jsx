"use client";

import React from "react";
import { ThemeProvider } from "@/lib/theme";
import { StoreProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <ThemeProvider>
        <StoreProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </StoreProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default Providers;
