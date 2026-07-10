import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeStore } from '@/stores/use-theme-store';

export const useAppTheme = () => {
  const systemScheme = useColorScheme();
  const themeOverride = useThemeStore((state) => state.themeOverride);
  const setThemeOverride = useThemeStore((state) => state.setThemeOverride);

  const theme: 'light' | 'dark' = themeOverride ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = () => setThemeOverride(theme === 'dark' ? 'light' : 'dark');

  return { theme, toggleTheme };
};
