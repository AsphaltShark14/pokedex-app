import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from 'tamagui';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useAppTheme } from '@/hooks/use-app-theme';
import { queryClient } from '@/lib/query-client';
import { tamaguiConfig } from '../../tamagui.config';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme } = useAppTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
          <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="details/[id]" options={{ headerShown: true, title: 'Details' }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal', headerShown: true, title: 'Modal' }}
              />
            </Stack>
          </ThemeProvider>
        </TamaguiProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
