import { act, renderHook } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { useAppTheme } from '@/hooks/use-app-theme';
import { useThemeStore } from '@/stores/use-theme-store';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'dark',
}));

describe('useAppTheme', () => {
  beforeEach(() => {
    useThemeStore.setState({ themeOverride: null });
  });

  it('follows the system color scheme when there is no override', () => {
    const { result } = renderHook(() => useAppTheme());

    expect(result.current.theme).toBe('dark');
  });

  it('toggles away from the current effective theme, even when it came from the system scheme', () => {
    const { result } = renderHook(() => useAppTheme());

    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
  });
});
