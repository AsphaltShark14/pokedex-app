import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, TextInput } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paragraph, Text, XStack, YStack } from 'tamagui';

import type { PokeResourceItem } from '@/api/poke-resource';
import { useBrowsableResourceList } from '@/api/use-browsable-resource-list';
import { useRegionList, useRegionLocations } from '@/api/use-region-filter';
import { PokedexBrand, TAB_BAR_CLEARANCE } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const DEBOUNCE_MS = 300;

const LocationListRow = ({ item, onPress }: { item: PokeResourceItem; onPress: () => void }) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => (
      <XStack bg="white" rounded="$4" p="$3" items="center" gap="$3" opacity={pressed ? 0.7 : 1}>
        <Text fontWeight="bold" color={PokedexBrand.locationTeal}>
          No. {String(item.id).padStart(3, '0')}
        </Text>
        <Text textTransform="capitalize">{item.name.replace(/-/g, ' ')}</Text>
      </XStack>
    )}
  </Pressable>
);

const RegionChip = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress}>
    <XStack
      rounded="$10"
      px="$3"
      py="$2"
      style={{ backgroundColor: selected ? PokedexBrand.locationTeal : 'white' }}
    >
      <Text
        fontSize={12}
        fontWeight="bold"
        textTransform="capitalize"
        color={selected ? 'white' : '#666'}
      >
        {label}
      </Text>
    </XStack>
  </Pressable>
);

const LocationsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ region?: string }>();

  const [regionId, setRegionId] = useState<number | undefined>(() =>
    params.region ? Number(params.region) : undefined,
  );

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const { bottom } = useSafeAreaInsets();

  const browsable = useBrowsableResourceList(
    'location',
    regionId !== undefined ? '' : debouncedQuery,
  );
  const regionList = useRegionList();
  const regionLocations = useRegionLocations(regionId);

  const items = regionId !== undefined ? (regionLocations.data?.locations ?? []) : browsable.items;
  const isLoading = regionId !== undefined ? regionLocations.isLoading : browsable.isLoading;
  const isError = regionId !== undefined ? regionLocations.isError : browsable.isError;

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
              tintColor={PokedexBrand.locationTeal}
              size={24}
            />
          </Pressable>
          <Text fontWeight="bold" fontSize={18}>
            Locations
          </Text>
        </XStack>

        {regionId === undefined && (
          <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
            <XStack
              bg="white"
              rounded="$10"
              px="$4"
              py="$2"
              items="center"
              gap="$2"
              mx="$3"
              mb="$3"
            >
              <SymbolView
                name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                tintColor="#999"
                size={16}
              />
              <TextInput
                style={{ flex: 1, fontSize: 16, paddingVertical: 8 }}
                value={query}
                onChangeText={setQuery}
                placeholder="Search Locations"
                placeholderTextColor="#999"
                autoCapitalize="none"
                returnKeyType="search"
              />
            </XStack>
          </Animated.View>
        )}

        <Animated.View layout={LinearTransition.duration(200)}>
          <YStack gap="$2" pb="$3">
            <Text fontSize={12} color="#666" px="$3">
              Region
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
            >
              <RegionChip
                label="All"
                selected={regionId === undefined}
                onPress={() => setRegionId(undefined)}
              />
              {regionList.data?.items.map((item) => (
                <RegionChip
                  key={item.id}
                  label={item.name}
                  selected={regionId === item.id}
                  onPress={() => setRegionId(item.id)}
                />
              ))}
            </ScrollView>
          </YStack>
        </Animated.View>

        <Animated.View style={{ flex: 1 }} layout={LinearTransition.duration(200)}>
          {isLoading ? (
            <YStack flex={1} items="center" justify="center">
              <ActivityIndicator color={PokedexBrand.locationTeal} />
            </YStack>
          ) : isError ? (
            <YStack flex={1} items="center" justify="center" p="$4">
              <Paragraph>Couldn&apos;t load Locations. Please try again shortly.</Paragraph>
            </YStack>
          ) : items.length === 0 ? (
            <YStack flex={1} items="center" justify="center" p="$4">
              <Paragraph color="#666">No locations found.</Paragraph>
            </YStack>
          ) : (
            <FlatList<PokeResourceItem>
              data={items}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{
                padding: 16,
                paddingBottom: bottom + TAB_BAR_CLEARANCE,
                gap: 12,
              }}
              renderItem={({ item }) => (
                <LocationListRow item={item} onPress={() => router.push(`/locations/${item.id}`)} />
              )}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (
                  regionId === undefined &&
                  browsable.hasNextPage &&
                  !browsable.isFetchingNextPage
                ) {
                  browsable.fetchNextPage();
                }
              }}
              ListFooterComponent={
                regionId === undefined && browsable.isFetchingNextPage ? (
                  <YStack py="$4">
                    <ActivityIndicator color={PokedexBrand.locationTeal} />
                  </YStack>
                ) : null
              }
            />
          )}
        </Animated.View>
      </SafeAreaView>
    </YStack>
  );
};

export default LocationsScreen;
