import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  ZoomIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useAppTheme } from '@/hooks/use-app-theme';
import { PokedexBrand } from '@/constants/theme';
import { queryClient } from '@/lib/query-client';
import { useCompareStore } from '@/stores/use-compare-store';
import { tamaguiConfig } from '../../tamagui.config';

SplashScreen.preventAutoHideAsync();

const CompareFab = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const compareIds = useCompareStore((state) => state.compareIds);
  const scale = useSharedValue(1);
  const previousCount = useRef(compareIds.length);

  useEffect(() => {
    if (compareIds.length > 0 && compareIds.length > previousCount.current) {
      scale.value = withSequence(withSpring(1.15), withSpring(1));
    }
    previousCount.current = compareIds.length;
  }, [compareIds.length, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (compareIds.length === 0) {
    return null;
  }

  return (
    <Animated.View
      entering={ZoomIn.duration(250)}
      style={[
        { position: 'absolute', right: 24, bottom: insets.bottom + 24, zIndex: 500 },
        animatedStyle,
      ]}
    >
      <Pressable onPress={() => router.push('/compare')}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: 'white',
            backgroundColor: 'white',
          }}
        >
          <SymbolView
            name={{
              ios: 'arrow.left.arrow.right',
              android: 'compare_arrows',
              web: 'compare_arrows',
            }}
            tintColor={PokedexBrand.red}
            size={26}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            minWidth: 20,
            height: 20,
            borderRadius: 10,
            paddingHorizontal: 4,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: PokedexBrand.red,
            borderWidth: 2,
            borderColor: 'white',
          }}
        >
          <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
            {compareIds.length}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const RootLayout = () => {
  const { theme } = useAppTheme();
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
          <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="details/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="search" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal', headerShown: true, title: 'Modal' }}
              />
              <Stack.Screen
                name="compare"
                options={{ presentation: 'modal', headerShown: false }}
              />
            </Stack>
            <CompareFab />
          </ThemeProvider>
        </TamaguiProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
