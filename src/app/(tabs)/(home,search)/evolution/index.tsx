import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paragraph, Text, XStack, YStack } from 'tamagui';

import type { PokeResourceItem } from '@/api/poke-resource';
import { useResourceSearchIndex } from '@/api/use-resource-search-index';
import { FeaturedFamiliesGrid } from '@/components/evolution/featured-families-grid';
import { getPokemonArtworkUrl } from '@/constants/sprites';
import { PokedexBrand, TAB_BAR_CLEARANCE } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const THUMBNAIL_SIZE = 48;
const DEBOUNCE_MS = 300;
const MAX_SEARCH_RESULTS = 30;

const PokemonSearchRow = ({ item, onPress }: { item: PokeResourceItem; onPress: () => void }) => (
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
        <Text textTransform="capitalize">{item.name.replace(/-/g, ' ')}</Text>
      </XStack>
    )}
  </Pressable>
);

const EvolutionLandingScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const hasQuery = debouncedQuery.trim().length > 0;
  const { bottom } = useSafeAreaInsets();

  const search = useResourceSearchIndex('pokemon', hasQuery);

  const results = useMemo(() => {
    if (!hasQuery || !search.data) {
      return [];
    }
    const trimmed = debouncedQuery.trim().toLowerCase();
    return search.data.items
      .filter((item) => item.name.includes(trimmed))
      .slice(0, MAX_SEARCH_RESULTS);
  }, [search.data, debouncedQuery, hasQuery]);

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
              tintColor={PokedexBrand.red}
              size={24}
            />
          </Pressable>
          <Text fontWeight="bold" fontSize={18}>
            Evolution
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
            placeholder="Search a Pokémon's evolution family"
            placeholderTextColor="#999"
            autoCapitalize="none"
            returnKeyType="search"
          />
        </XStack>

        {hasQuery ? (
          search.isLoading ? (
            <YStack flex={1} items="center" justify="center">
              <ActivityIndicator color={PokedexBrand.red} />
            </YStack>
          ) : results.length === 0 ? (
            <YStack flex={1} items="center" justify="center" p="$4">
              <Paragraph color="#666">No Pokémon found for &quot;{debouncedQuery}&quot;</Paragraph>
            </YStack>
          ) : (
            <FlatList<PokeResourceItem>
              data={results}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{
                padding: 16,
                paddingBottom: bottom + TAB_BAR_CLEARANCE,
                gap: 12,
              }}
              renderItem={({ item }) => (
                <PokemonSearchRow
                  item={item}
                  onPress={() => router.push(`/evolution/${item.id}`)}
                />
              )}
            />
          )
        ) : (
          <YStack flex={1} p="$4" gap="$4">
            <Paragraph color="#666" fontSize={13}>
              Search any Pokémon to see its full evolution family, or jump into one of these
              well-known ones.
            </Paragraph>
            <Text fontSize={13} fontWeight="bold" color="#666">
              Featured Families
            </Text>
            <FeaturedFamiliesGrid />
          </YStack>
        )}
      </SafeAreaView>
    </YStack>
  );
};

export default EvolutionLandingScreen;
