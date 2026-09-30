import React, { useEffect } from "react";
import { useTheme } from "@/lib/hooks/useTheme";

export function ThemeProvider({ children }) {
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
}

export { useTheme } from "@/lib/hooks/useTheme";