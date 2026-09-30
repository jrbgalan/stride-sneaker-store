import { useThemeStore } from "@/lib/stores/themeStore";

export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return {
    theme,
    toggle: toggleTheme,
    toggleTheme,
    setTheme,
  };
}
