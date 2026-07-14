import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, TextInput } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paragraph, Text, XStack, YStack } from 'tamagui';

import type { ItemFilterKind } from '@/api/items';
import type { PokeResourceItem } from '@/api/poke-resource';
import { useBrowsableResourceList } from '@/api/use-browsable-resource-list';
import { useItemFilterCategory, useItemFilterOptions } from '@/api/use-item-filter';
import { FilterPickerModal } from '@/components/items/filter-picker-modal';
import { getItemSpriteUrl } from '@/constants/sprites';
import { PokedexBrand, TAB_BAR_CLEARANCE } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const DEBOUNCE_MS = 300;
const THUMBNAIL_SIZE = 48;

type ActiveFilter = { kind: ItemFilterKind; id: number } | null;

const ItemListRow = ({ item, onPress }: { item: PokeResourceItem; onPress: () => void }) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => (
      <XStack bg="white" rounded="$4" p="$3" items="center" gap="$3" opacity={pressed ? 0.7 : 1}>
        <Image
          source={{ uri: getItemSpriteUrl(item.name) }}
          style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
          contentFit="contain"
        />
        <Text fontWeight="bold" color={PokedexBrand.itemBlue}>
          No. {String(item.id).padStart(3, '0')}
        </Text>
        <Text textTransform="capitalize">{item.name}</Text>
      </XStack>
    )}
  </Pressable>
);

const DimensionChip = ({
  label,
  selectedName,
  onPress,
}: {
  label: string;
  selectedName: string | undefined;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress}>
    <XStack
      rounded="$10"
      px="$3"
      py="$2"
      gap="$1"
      items="center"
      style={{ backgroundColor: selectedName ? PokedexBrand.itemBlue : 'white' }}
    >
      <Text
        fontSize={12}
        fontWeight="bold"
        textTransform="capitalize"
        color={selectedName ? 'white' : '#666'}
      >
        {selectedName ? `${label}: ${selectedName.replace(/-/g, ' ')}` : label}
      </Text>
      <SymbolView
        name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
        tintColor={selectedName ? 'white' : '#666'}
        size={12}
      />
    </XStack>
  </Pressable>
);

const ItemsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string; attribute?: string }>();

  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(() => {
    if (params.category) return { kind: 'item-category', id: Number(params.category) };
    if (params.attribute) return { kind: 'item-attribute', id: Number(params.attribute) };
    return null;
  });
  const [openPicker, setOpenPicker] = useState<ItemFilterKind | null>(null);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const { bottom } = useSafeAreaInsets();

  const browsable = useBrowsableResourceList('item', activeFilter ? '' : debouncedQuery);
  const filterResult = useItemFilterCategory(
    activeFilter?.kind ?? 'item-category',
    activeFilter?.id,
  );

  const categoryOptions = useItemFilterOptions('item-category');
  const attributeOptions = useItemFilterOptions('item-attribute');

  const items = activeFilter ? (filterResult.data?.items ?? []) : browsable.items;
  const isLoading = activeFilter ? filterResult.isLoading : browsable.isLoading;
  const isError = activeFilter ? filterResult.isError : browsable.isError;

  const categoryName = activeFilter?.kind === 'item-category' ? filterResult.data?.name : undefined;
  const attributeName =
    activeFilter?.kind === 'item-attribute' ? filterResult.data?.name : undefined;

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
              tintColor={PokedexBrand.itemBlue}
              size={24}
            />
          </Pressable>
          <Text fontWeight="bold" fontSize={18}>
            Items
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
                placeholder="Search Items"
                placeholderTextColor="#999"
                autoCapitalize="none"
                returnKeyType="search"
              />
            </XStack>
          </Animated.View>
        )}

        <Animated.View layout={LinearTransition.duration(200)}>
          <XStack gap="$2" px="$3" pb="$3">
            <DimensionChip
              label="Category"
              selectedName={categoryName}
              onPress={() => setOpenPicker('item-category')}
            />
            <DimensionChip
              label="Attribute"
              selectedName={attributeName}
              onPress={() => setOpenPicker('item-attribute')}
            />
          </XStack>
        </Animated.View>

        <Animated.View style={{ flex: 1 }} layout={LinearTransition.duration(200)}>
          {isLoading ? (
            <YStack flex={1} items="center" justify="center">
              <ActivityIndicator color={PokedexBrand.itemBlue} />
            </YStack>
          ) : isError ? (
            <YStack flex={1} items="center" justify="center" p="$4">
              <Paragraph>Couldn&apos;t load Items. Please try again shortly.</Paragraph>
            </YStack>
          ) : items.length === 0 ? (
            <YStack flex={1} items="center" justify="center" p="$4">
              <Paragraph color="#666">No items found.</Paragraph>
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
                <ItemListRow item={item} onPress={() => router.push(`/items/${item.id}`)} />
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
                    <ActivityIndicator color={PokedexBrand.itemBlue} />
                  </YStack>
                ) : null
              }
            />
          )}
        </Animated.View>
      </SafeAreaView>

      <FilterPickerModal
        visible={openPicker === 'item-category'}
        title="Category"
        options={categoryOptions.data?.items ?? []}
        selectedId={activeFilter?.kind === 'item-category' ? activeFilter.id : undefined}
        onSelect={(id) => setActiveFilter(id === undefined ? null : { kind: 'item-category', id })}
        onClose={() => setOpenPicker(null)}
      />
      <FilterPickerModal
        visible={openPicker === 'item-attribute'}
        title="Attribute"
        options={attributeOptions.data?.items ?? []}
        selectedId={activeFilter?.kind === 'item-attribute' ? activeFilter.id : undefined}
        onSelect={(id) => setActiveFilter(id === undefined ? null : { kind: 'item-attribute', id })}
        onClose={() => setOpenPicker(null)}
      />
    </YStack>
  );
};

export default ItemsScreen;
