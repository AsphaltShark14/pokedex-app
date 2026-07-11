import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, TextInput } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Text, XStack, YStack } from 'tamagui';

import type { PokeResourceItem } from '@/api/poke-resource';
import type { BerryCategoryKind } from '@/api/berries';
import { useBerryCategory, useBerryCategoryList } from '@/api/use-berry-category';
import { useBrowsableResourceList } from '@/api/use-browsable-resource-list';
import { getBerrySpriteUrl } from '@/constants/sprites';
import { PokedexBrand } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const DEBOUNCE_MS = 300;
const THUMBNAIL_SIZE = 48;

type ActiveFilter = { kind: BerryCategoryKind; id: number } | null;

const BerryListRow = ({ item, onPress }: { item: PokeResourceItem; onPress: () => void }) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => (
      <XStack bg="white" rounded="$4" p="$3" items="center" gap="$3" opacity={pressed ? 0.7 : 1}>
        <Image
          source={{ uri: getBerrySpriteUrl(item.name) }}
          style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
          contentFit="contain"
        />
        <Text fontWeight="bold" color={PokedexBrand.berryGreen}>
          No. {String(item.id).padStart(3, '0')}
        </Text>
        <Text textTransform="capitalize">{item.name}</Text>
      </XStack>
    )}
  </Pressable>
);

const FilterChip = ({
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
      style={{ backgroundColor: selected ? PokedexBrand.berryGreen : 'white' }}
    >
      <Text
        fontSize={12}
        fontWeight="bold"
        textTransform="capitalize"
        color={selected ? 'white' : '#666'}
      >
        {label.replace(/-/g, ' ')}
      </Text>
    </XStack>
  </Pressable>
);

const FilterChipRow = ({
  label,
  kind,
  active,
  onSelect,
}: {
  label: string;
  kind: BerryCategoryKind;
  active: ActiveFilter;
  onSelect: (filter: ActiveFilter) => void;
}) => {
  const { data } = useBerryCategoryList(kind);
  const isKindActive = active?.kind === kind;

  return (
    <YStack gap="$2" pb="$3">
      <Text fontSize={12} color="#666" px="$3">
        {label}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
      >
        <FilterChip label="All" selected={!isKindActive} onPress={() => onSelect(null)} />
        {data?.items.map((item) => (
          <FilterChip
            key={item.id}
            label={item.name}
            selected={isKindActive && active?.id === item.id}
            onPress={() => onSelect({ kind, id: item.id })}
          />
        ))}
      </ScrollView>
    </YStack>
  );
};

const BerriesScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ firmness?: string; flavor?: string }>();

  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(() => {
    if (params.firmness) return { kind: 'firmness', id: Number(params.firmness) };
    if (params.flavor) return { kind: 'flavor', id: Number(params.flavor) };
    return null;
  });

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);

  const browsable = useBrowsableResourceList('berry', activeFilter ? '' : debouncedQuery);
  const category = useBerryCategory(activeFilter?.kind ?? 'firmness', activeFilter?.id);

  const items = activeFilter ? (category.data?.berries ?? []) : browsable.items;
  const isLoading = activeFilter ? category.isLoading : browsable.isLoading;
  const isError = activeFilter ? category.isError : browsable.isError;

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
              tintColor={PokedexBrand.berryGreen}
              size={24}
            />
          </Pressable>
          <Text fontWeight="bold" fontSize={18}>
            Berries
          </Text>
        </XStack>

        {!activeFilter && (
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
                placeholder="Search Berries"
                placeholderTextColor="#999"
                autoCapitalize="none"
                returnKeyType="search"
              />
            </XStack>
          </Animated.View>
        )}

        <Animated.View layout={LinearTransition.duration(200)}>
          <FilterChipRow
            label="Firmness"
            kind="firmness"
            active={activeFilter}
            onSelect={setActiveFilter}
          />
        </Animated.View>
        <Animated.View layout={LinearTransition.duration(200)}>
          <FilterChipRow
            label="Flavor"
            kind="flavor"
            active={activeFilter}
            onSelect={setActiveFilter}
          />
        </Animated.View>

        <Animated.View style={{ flex: 1 }} layout={LinearTransition.duration(200)}>
          {isLoading ? (
            <YStack flex={1} items="center" justify="center">
              <ActivityIndicator color={PokedexBrand.berryGreen} />
            </YStack>
          ) : isError ? (
            <YStack flex={1} items="center" justify="center" p="$4">
              <Paragraph>Couldn&apos;t load Berries. Please try again shortly.</Paragraph>
            </YStack>
          ) : items.length === 0 ? (
            <YStack flex={1} items="center" justify="center" p="$4">
              <Paragraph color="#666">No berries found.</Paragraph>
            </YStack>
          ) : (
            <FlatList<PokeResourceItem>
              data={items}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{ padding: 16, gap: 12 }}
              renderItem={({ item }) => (
                <BerryListRow item={item} onPress={() => router.push(`/berries/${item.id}`)} />
              )}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (!activeFilter && browsable.hasNextPage && !browsable.isFetchingNextPage) {
                  browsable.fetchNextPage();
                }
              }}
              ListFooterComponent={
                !activeFilter && browsable.isFetchingNextPage ? (
                  <YStack py="$4">
                    <ActivityIndicator color={PokedexBrand.berryGreen} />
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

export default BerriesScreen;
