import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { useLocationDetail } from '@/api/use-location-detail';
import { PokedexBrand } from '@/constants/theme';

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
        color={onPress ? PokedexBrand.locationTeal : undefined}
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

const LocationDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const locationId = Number(id);
  const { data, isLoading, isError } = useLocationDetail(locationId);

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" bg={PokedexBrand.cream}>
        <Spinner color={PokedexBrand.locationTeal} />
      </YStack>
    );
  }

  if (isError || !data) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4" bg={PokedexBrand.cream}>
        <Paragraph>Couldn&apos;t load this location. Please try again shortly.</Paragraph>
      </YStack>
    );
  }

  return (
    <YStack flex={1} style={{ backgroundColor: PokedexBrand.locationTeal }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <XStack p="$3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            hitSlop={12}
          >
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              tintColor="white"
              size={24}
            />
          </Pressable>
        </XStack>

        <YStack items="center" gap="$2" px="$4" pb="$5">
          <Text fontWeight="bold" fontSize={14} color="rgba(255,255,255,0.8)">
            No. {String(data.id).padStart(3, '0')}
          </Text>
          <Text fontWeight="bold" fontSize={28} color="white" textTransform="capitalize">
            {data.name.replace(/-/g, ' ')}
          </Text>
        </YStack>

        <YStack
          flex={1}
          style={{
            backgroundColor: PokedexBrand.cream,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          }}
        >
          <ScrollView contentContainerStyle={{ padding: 24, gap: 4 }}>
            <InfoRow
              label="Region"
              value={data.region.name}
              onPress={() => router.push(`/locations?region=${data.region.id}`)}
            />

            {data.areas.length > 0 && (
              <YStack gap="$2" pt="$3">
                <Text fontSize={13} color="#666">
                  Areas
                </Text>
                <YStack gap="$2">
                  {data.areas.map((area) => (
                    <Pressable
                      key={area.id}
                      onPress={() => router.push(`/location-areas/${area.id}`)}
                    >
                      <XStack bg="white" rounded="$4" p="$3" justify="space-between" items="center">
                        <Text textTransform="capitalize">{area.name.replace(/-/g, ' ')}</Text>
                        <SymbolView
                          name={{
                            ios: 'chevron.right',
                            android: 'chevron_right',
                            web: 'chevron_right',
                          }}
                          tintColor="#999"
                          size={16}
                        />
                      </XStack>
                    </Pressable>
                  ))}
                </YStack>
              </YStack>
            )}
          </ScrollView>
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};

export default LocationDetailScreen;
