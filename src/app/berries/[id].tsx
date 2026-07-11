import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { useBerryDetail } from '@/api/use-berry-detail';
import { getBerrySpriteUrl } from '@/constants/sprites';
import { PokedexBrand } from '@/constants/theme';

const BERRY_IMAGE_SIZE = 140;

const InfoRow = ({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) => {
  const row = (
    <XStack justify="space-between" items="center" py="$2">
      <Text fontSize={13} color="#666">
        {label}
      </Text>
      <Text
        fontWeight="bold"
        fontSize={14}
        textTransform="capitalize"
        color={onPress ? PokedexBrand.berryGreen : undefined}
      >
        {value}
      </Text>
    </XStack>
  );

  if (!onPress) {
    return row;
  }

  return <Pressable onPress={onPress}>{row}</Pressable>;
};

const BerryDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const berryId = Number(id);
  const { data, isLoading, isError } = useBerryDetail(berryId);

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" bg={PokedexBrand.cream}>
        <Spinner color={PokedexBrand.berryGreen} />
      </YStack>
    );
  }

  if (isError || !data) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4" bg={PokedexBrand.cream}>
        <Paragraph>Couldn&apos;t load this berry. Please try again shortly.</Paragraph>
      </YStack>
    );
  }

  return (
    <YStack flex={1} style={{ backgroundColor: PokedexBrand.berryGreen }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <XStack p="$3">
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              tintColor="white"
              size={24}
            />
          </Pressable>
        </XStack>

        <YStack items="center" gap="$2" px="$4">
          <Text fontWeight="bold" fontSize={14} color="rgba(255,255,255,0.8)">
            No. {String(data.id).padStart(3, '0')}
          </Text>
          <Text fontWeight="bold" fontSize={28} color="white" textTransform="capitalize">
            {data.name}
          </Text>
        </YStack>

        <Image
          source={{ uri: getBerrySpriteUrl(data.name) }}
          style={{ width: '100%', height: BERRY_IMAGE_SIZE }}
          contentFit="contain"
        />

        <YStack
          flex={1}
          style={{
            backgroundColor: PokedexBrand.cream,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          }}
        >
          <YStack p="$5" gap="$1">
            <InfoRow
              label="Firmness"
              value={data.firmness.name}
              onPress={() => router.push(`/berries?firmness=${data.firmness.id}`)}
            />
            <InfoRow label="Growth Time" value={`${data.growthTime} hrs/stage`} />
            <InfoRow label="Max Harvest" value={String(data.maxHarvest)} />
            <InfoRow label="Size" value={`${data.size} mm`} />
            <InfoRow label="Smoothness" value={String(data.smoothness)} />
            <InfoRow label="Soil Dryness" value={String(data.soilDryness)} />
            <InfoRow label="Natural Gift Power" value={String(data.naturalGiftPower)} />
            <InfoRow label="Natural Gift Type" value={data.naturalGiftType} />

            <YStack gap="$2" pt="$3">
              <Text fontSize={13} color="#666">
                Flavors
              </Text>
              <XStack gap="$2" style={{ flexWrap: 'wrap' }}>
                {data.flavors
                  .filter((flavor) => flavor.potency > 0)
                  .map((flavor) => (
                    <Pressable
                      key={flavor.id}
                      onPress={() => router.push(`/berries?flavor=${flavor.id}`)}
                    >
                      <XStack bg={PokedexBrand.berryGreen} rounded="$10" px="$3" py="$2" gap="$1">
                        <Text
                          color="white"
                          fontSize={12}
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
                          {flavor.name}
                        </Text>
                        <Text color="rgba(255,255,255,0.8)" fontSize={12} fontWeight="bold">
                          · {flavor.potency}
                        </Text>
                      </XStack>
                    </Pressable>
                  ))}
              </XStack>
            </YStack>
          </YStack>
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};

export default BerryDetailScreen;
