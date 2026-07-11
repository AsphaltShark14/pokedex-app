import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { useVersionDetail } from '@/api/use-light-resource-detail';
import { PokedexBrand } from '@/constants/theme';

const GameDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const versionId = Number(id);
  const { data, isLoading, isError } = useVersionDetail(versionId);

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" bg={PokedexBrand.cream}>
        <Spinner color={PokedexBrand.gameGold} />
      </YStack>
    );
  }

  if (isError || !data) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4" bg={PokedexBrand.cream}>
        <Paragraph>Couldn&apos;t load this game. Please try again shortly.</Paragraph>
      </YStack>
    );
  }

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
              tintColor={PokedexBrand.gameGold}
              size={24}
            />
          </Pressable>
          <Text fontWeight="bold" fontSize={18} textTransform="capitalize">
            {data.name.replace(/-/g, ' ')}
          </Text>
        </XStack>

        <YStack p="$5" gap="$1">
          <XStack justify="space-between" items="center" py="$2">
            <Text fontSize={13} color="#666">
              Version Group
            </Text>
            <Text fontWeight="bold" fontSize={14} textTransform="capitalize">
              {data.versionGroupName.replace(/-/g, ' ')}
            </Text>
          </XStack>
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};

export default GameDetailScreen;
