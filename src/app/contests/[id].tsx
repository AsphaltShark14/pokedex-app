import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { useContestTypeDetail } from '@/api/use-light-resource-detail';
import { PokedexBrand } from '@/constants/theme';

const ContestDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const contestId = Number(id);
  const { data, isLoading, isError } = useContestTypeDetail(contestId);

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" bg={PokedexBrand.cream}>
        <Spinner color={PokedexBrand.contestPurple} />
      </YStack>
    );
  }

  if (isError || !data) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4" bg={PokedexBrand.cream}>
        <Paragraph>Couldn&apos;t load this contest type. Please try again shortly.</Paragraph>
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
              tintColor={PokedexBrand.contestPurple}
              size={24}
            />
          </Pressable>
          <Text fontWeight="bold" fontSize={18} textTransform="capitalize">
            {data.name}
          </Text>
        </XStack>

        <YStack p="$5" gap="$1">
          {data.berryFlavor ? (
            <Pressable onPress={() => router.push(`/berries?flavor=${data.berryFlavor?.id}`)}>
              <XStack justify="space-between" items="center" py="$2">
                <Text fontSize={13} color="#666">
                  Berry Flavor
                </Text>
                <Text
                  fontWeight="bold"
                  fontSize={14}
                  textTransform="capitalize"
                  color={PokedexBrand.contestPurple}
                >
                  {data.berryFlavor.name}
                </Text>
              </XStack>
            </Pressable>
          ) : (
            <Paragraph color="#666">No associated berry flavor.</Paragraph>
          )}
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};

export default ContestDetailScreen;
