import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Text, XStack, YStack } from 'tamagui';

import type { PokeResourceItem } from '@/api/poke-resource';
import { useBrowsableResourceList } from '@/api/use-browsable-resource-list';
import { BROWSE_RESOURCES } from '@/constants/browse-resources';
import { PokedexBrand } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const DEBOUNCE_MS = 300;

const formatResourceTitle = (resource: string): string =>
  resource
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const BrowseListRow = ({ item }: { item: PokeResourceItem }) => (
  <XStack bg="white" rounded="$4" p="$3" items="center" gap="$3">
    <Text fontWeight="bold" color={PokedexBrand.red}>
      No. {String(item.id).padStart(3, '0')}
    </Text>
    <Text textTransform="capitalize">{item.name}</Text>
  </XStack>
);

const BrowseResourceScreen = () => {
  const router = useRouter();
  const { resource } = useLocalSearchParams<{ resource: string }>();
  const title =
    BROWSE_RESOURCES.find((config) => config.resource === resource)?.title ??
    formatResourceTitle(resource);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);

  const { items, isLoading, isError, hasQuery, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBrowsableResourceList(resource, debouncedQuery);

  return (
    <YStack flex={1} bg={PokedexBrand.cream}>
      <SafeAreaView style={{ flex: 1 }}>
        <XStack items="center" gap="$2" p="$3">
          <Pressable onPress={() => router.back()} hitSlop={12}>
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

        <XStack bg="white" rounded="$10" px="$4" py="$2" items="center" gap="$2" mx="$3" mb="$3">
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            tintColor="#999"
            size={16}
          />
          <TextInput
            style={{ flex: 1, fontSize: 16, paddingVertical: 8 }}
            value={query}
            onChangeText={setQuery}
            placeholder={`Search ${title}`}
            placeholderTextColor="#999"
            autoCapitalize="none"
            returnKeyType="search"
          />
        </XStack>

        {isLoading ? (
          <YStack flex={1} items="center" justify="center">
            <ActivityIndicator color={PokedexBrand.red} />
          </YStack>
        ) : isError ? (
          <YStack flex={1} items="center" justify="center" p="$4">
            <Paragraph>Couldn&apos;t load {title}. Please try again shortly.</Paragraph>
          </YStack>
        ) : items.length === 0 ? (
          <YStack flex={1} items="center" justify="center" p="$4">
            <Paragraph color="#666">No results for &quot;{debouncedQuery}&quot;</Paragraph>
          </YStack>
        ) : (
          <FlatList<PokeResourceItem>
            data={items}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            renderItem={({ item }) => <BrowseListRow item={item} />}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (!hasQuery && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            ListFooterComponent={
              isFetchingNextPage ? (
                <YStack py="$4">
                  <ActivityIndicator color={PokedexBrand.red} />
                </YStack>
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </YStack>
  );
};

export default BrowseResourceScreen;
