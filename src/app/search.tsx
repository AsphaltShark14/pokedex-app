import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import type { PokemonListItem } from '@/api/pokemon';
import { usePokemonDetail } from '@/api/use-pokemon-detail';
import { usePokemonSearchIndex } from '@/api/use-pokemon-search-index';
import { getTypeColor } from '@/constants/pokemon-types';
import { PokedexBrand } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const MAX_RESULTS = 24;
const DEBOUNCE_MS = 300;
// react-navigation's push animation swallows a same-tick focus() call, so the
// input is focused just after the transition instead of relying on autoFocus.
const AUTOFOCUS_DELAY_MS = 350;

type SearchResultCardProps = {
  item: PokemonListItem;
  onPress: () => void;
};

const SearchResultCard = ({ item, onPress }: SearchResultCardProps) => {
  const { data } = usePokemonDetail(item.id);
  const borderColor = data ? getTypeColor(data.types[0]) : '#ddd';

  return (
    <Pressable onPress={onPress} style={{ flex: 1, margin: 6 }}>
      <YStack
        bg="white"
        rounded="$4"
        items="center"
        p="$3"
        gap="$2"
        style={{ borderWidth: 2, borderColor }}
      >
        {data?.imageUrl ? (
          <Image
            source={{ uri: data.imageUrl }}
            style={{ width: 72, height: 72 }}
            contentFit="contain"
            transition={200}
          />
        ) : (
          <YStack width={72} height={72} items="center" justify="center">
            <Spinner color={PokedexBrand.red} />
          </YStack>
        )}
        <Text fontSize={12} fontWeight="bold" textTransform="capitalize" numberOfLines={1}>
          {item.name}
        </Text>
      </YStack>
    </Pressable>
  );
};

const SearchScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const { data: searchIndex } = usePokemonSearchIndex();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timeout = setTimeout(() => inputRef.current?.focus(), AUTOFOCUS_DELAY_MS);
    return () => clearTimeout(timeout);
  }, []);

  const results = useMemo(() => {
    const trimmed = debouncedQuery.trim().toLowerCase();
    if (!trimmed || !searchIndex) return [];
    return searchIndex.filter((pokemon) => pokemon.name.includes(trimmed)).slice(0, MAX_RESULTS);
  }, [searchIndex, debouncedQuery]);

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
          <TextInput
            ref={inputRef}
            style={{ flex: 1, fontSize: 16, paddingVertical: 8 }}
            value={query}
            onChangeText={setQuery}
            placeholder="Search Pokémon"
            placeholderTextColor="#999"
            autoCapitalize="none"
            returnKeyType="search"
          />
        </XStack>

        {!debouncedQuery.trim() ? (
          <YStack flex={1} items="center" justify="center" p="$4">
            <Paragraph color="#666">Start typing to search</Paragraph>
          </YStack>
        ) : results.length === 0 ? (
          <YStack flex={1} items="center" justify="center" p="$4">
            <Paragraph color="#666">No Pokémon found for &quot;{debouncedQuery}&quot;</Paragraph>
          </YStack>
        ) : (
          <FlatList<PokemonListItem>
            data={results}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            contentContainerStyle={{ padding: 10 }}
            renderItem={({ item }) => (
              <SearchResultCard item={item} onPress={() => router.push(`/details/${item.id}`)} />
            )}
          />
        )}
      </SafeAreaView>
    </YStack>
  );
};

export default SearchScreen;
