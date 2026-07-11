import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { useContestTypeDetail } from '@/api/use-light-resource-detail';
import { PokedexBrand } from '@/constants/theme';

const CONTEST_COLOR_SWATCHES: Record<string, string> = {
  Red: '#E0524A',
  Blue: '#4A90D9',
  Pink: '#E88CB0',
  Green: '#5BA85A',
  Yellow: '#E0C13C',
  Black: '#3A3A3A',
  Purple: '#8E5A9E',
  Gray: '#9A9A9A',
  White: '#DDDDDD',
  Brown: '#8B6141',
};

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
          {data.color && (
            <XStack justify="space-between" items="center" py="$2">
              <Text fontSize={13} color="#666">
                Color
              </Text>
              <XStack items="center" gap="$2">
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: CONTEST_COLOR_SWATCHES[data.color] ?? '#999',
                    borderWidth: 1,
                    borderColor: '#ddd',
                  }}
                />
                <Text fontWeight="bold" fontSize={14}>
                  {data.color}
                </Text>
              </XStack>
            </XStack>
          )}

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
