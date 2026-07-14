import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paragraph, Text, XStack, YStack } from 'tamagui';

import type { PokeResourceItem } from '@/api/poke-resource';
import { useBrowsableResourceList } from '@/api/use-browsable-resource-list';
import { getPokemonArtworkUrl } from '@/constants/sprites';
import { PokedexBrand, TAB_BAR_CLEARANCE } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const THUMBNAIL_SIZE = 48;
const DEBOUNCE_MS = 300;

const PokemonListRow = ({ item, onPress }: { item: PokeResourceItem; onPress: () => void }) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => (
      <XStack bg="white" rounded="$4" p="$3" items="center" gap="$3" opacity={pressed ? 0.7 : 1}>
        <Image
          source={{ uri: getPokemonArtworkUrl(item.id) }}
          style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
          contentFit="contain"
        />
        <Text fontWeight="bold" color={PokedexBrand.red}>
          No. {String(item.id).padStart(3, '0')}
        </Text>
        <Text textTransform="capitalize">{item.name}</Text>
      </XStack>
    )}
  </Pressable>
);

const PokemonListScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const { bottom } = useSafeAreaInsets();

  const { items, isLoading, isError, hasQuery, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBrowsableResourceList('pokemon', debouncedQuery);

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
            Pokémon
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
            placeholder="Search Pokémon"
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
            <Paragraph>Couldn&apos;t load Pokémon. Please try again shortly.</Paragraph>
          </YStack>
        ) : items.length === 0 ? (
          <YStack flex={1} items="center" justify="center" p="$4">
            <Paragraph color="#666">No Pokémon found for &quot;{debouncedQuery}&quot;</Paragraph>
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
              <PokemonListRow item={item} onPress={() => router.push(`/details/${item.id}`)} />
            )}
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

export default PokemonListScreen;
