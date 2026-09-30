import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Theme = "light" | "dark";

export interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const applyThemeToDOM = (theme: Theme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",

      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        applyThemeToDOM(next);
        set({ theme: next });
      },

      setTheme: (theme) => {
        applyThemeToDOM(theme);
        set({ theme });
      },
    }),
    {
      name: "axis-theme-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDOM(state.theme);
        }
      },
    }
  )
);
