import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { useEncounterMethodDetail } from '@/api/use-light-resource-detail';
import { PokedexBrand } from '@/constants/theme';

const EncounterDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const encounterId = Number(id);
  const { data, isLoading, isError } = useEncounterMethodDetail(encounterId);

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" bg={PokedexBrand.cream}>
        <Spinner color={PokedexBrand.encounterOrange} />
      </YStack>
    );
  }

  if (isError || !data) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4" bg={PokedexBrand.cream}>
        <Paragraph>Couldn&apos;t load this encounter method. Please try again shortly.</Paragraph>
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
              tintColor={PokedexBrand.encounterOrange}
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
              Order
            </Text>
            <Text fontWeight="bold" fontSize={14}>
              {data.order}
            </Text>
          </XStack>

          {data.description.length > 0 && (
            <YStack gap="$2" pt="$3">
              <Text fontSize={13} color="#666">
                Description
              </Text>
              <Paragraph fontSize={14}>{data.description}</Paragraph>
            </YStack>
          )}
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};

export default EncounterDetailScreen;
