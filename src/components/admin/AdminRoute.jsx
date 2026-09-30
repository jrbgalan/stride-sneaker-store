import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  if (isLoadingAuth) {
    return <div className="grid place-items-center py-40"><div className="h-8 w-8 animate-spin rounded-full border-2 border-secondary border-t-kinetic" /></div>;
  }
  if (!isAuthenticated || user?.role !== "admin") return <AccessDenied />;
  return children;
}

function AccessDenied() {
  return (
    <div className="mx-auto max-w-md px-4 py-32 text-center">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-destructive/10">
        <Lock size={28} className="text-destructive" />
      </div>
      <h1 className="font-heading text-3xl font-bold">Access denied</h1>
      <p className="mt-3 text-muted-foreground">You need admin privileges to view this page.</p>
      <Link to="/" className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-kinetic hover:text-white">
        Back to store
      </Link>
    </div>
  );
}