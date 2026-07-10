import { create } from 'zustand';

type ThemeOverride = 'light' | 'dark' | null;

type ThemeState = {
  /** null means "follow system color scheme" */
  themeOverride: ThemeOverride;
  setThemeOverride: (themeOverride: ThemeOverride) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  themeOverride: null,
  setThemeOverride: (themeOverride) => set({ themeOverride }),
}));
