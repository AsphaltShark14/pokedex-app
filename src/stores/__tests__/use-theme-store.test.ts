import { beforeEach, describe, expect, it } from '@jest/globals';

import { useThemeStore } from '@/stores/use-theme-store';

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ themeOverride: null });
  });

  it('defaults to following the system color scheme', () => {
    expect(useThemeStore.getState().themeOverride).toBeNull();
  });

  it('sets an explicit override', () => {
    useThemeStore.getState().setThemeOverride('dark');
    expect(useThemeStore.getState().themeOverride).toBe('dark');

    useThemeStore.getState().setThemeOverride('light');
    expect(useThemeStore.getState().themeOverride).toBe('light');
  });
});
