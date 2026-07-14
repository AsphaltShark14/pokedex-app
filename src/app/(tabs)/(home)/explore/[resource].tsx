import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Text, XStack, YStack } from 'tamagui';

import { PokedexBrand } from '@/constants/theme';

const PLACEHOLDER_TITLES: Record<string, string> = {
  machine: 'Machines',
};

const ExplorePlaceholderScreen = () => {
  const router = useRouter();
  const { resource } = useLocalSearchParams<{ resource: string }>();
  const title = PLACEHOLDER_TITLES[resource] ?? resource;

  return (
    <YStack flex={1} bg={PokedexBrand.cream}>
      <SafeAreaView style={{ flex: 1 }}>
        <XStack items="center" gap="$2" p="$3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            hitSlop={12}
          >
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              tintColor={PokedexBrand.red}
              size={24}
            />
          </Pressable>
          <Text fontWeight="bold" fontSize={18}>
            {title}
          </Text>
        </XStack>

        <YStack flex={1} items="center" justify="center" gap="$3" p="$5">
          <SymbolView
            name={{ ios: 'hammer', android: 'construction', web: 'construction' }}
            tintColor="#999"
            size={40}
          />
          <Text fontWeight="bold" fontSize={16} text="center">
            {title} is coming soon
          </Text>
          <Paragraph color="#666" text="center">
            This category doesn&apos;t have friendly names in the PokéAPI list yet, so we&apos;re
            still working out the best way to browse it.
          </Paragraph>
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};

export default ExplorePlaceholderScreen;
