import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paragraph, Text, XStack, YStack } from 'tamagui';

import type { PokeResourceItem } from '@/api/poke-resource';
import { SEARCH_QUICK_LINKS, useGlobalSearch } from '@/api/use-global-search';
import { getBerrySpriteUrl, getItemSpriteUrl, getPokemonArtworkUrl } from '@/constants/sprites';
import { PokedexBrand, TAB_BAR_CLEARANCE } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const DEBOUNCE_MS = 300;
const THUMBNAIL_SIZE = 40;

const CATEGORY_IMAGE_RESOLVERS: Record<string, (item: PokeResourceItem) => string> = {
  Pokémon: (item) => getPokemonArtworkUrl(item.id),
  Items: (item) => getItemSpriteUrl(item.name),
  Berries: (item) => getBerrySpriteUrl(item.name),
};

const SearchScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const categories = useGlobalSearch(debouncedQuery);
  const hasQuery = debouncedQuery.trim().length > 0;
  const { bottom } = useSafeAreaInsets();

  return (
    <YStack flex={1} bg={PokedexBrand.cream}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <XStack bg="white" rounded="$10" px="$4" py="$2" items="center" gap="$2" m="$3">
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            tintColor="#999"
            size={16}
          />
          <TextInput
            style={{ flex: 1, fontSize: 16, paddingVertical: 8 }}
            value={query}
            onChangeText={setQuery}
            placeholder="Search everything"
            placeholderTextColor="#999"
            autoCapitalize="none"
            returnKeyType="search"
          />
        </XStack>

        {!hasQuery ? (
          <ScrollView
            contentContainerStyle={{
              padding: 24,
              paddingBottom: bottom + TAB_BAR_CLEARANCE,
              gap: 8,
            }}
          >
            <Text fontSize={13} color="#666" pb="$2">
              Browse a category
            </Text>
            {SEARCH_QUICK_LINKS.map((link) => (
              <Pressable key={link.href} onPress={() => router.push(link.href)}>
                {({ pressed }) => (
                  <XStack
                    bg="white"
                    rounded="$4"
                    p="$3"
                    justify="space-between"
                    items="center"
                    opacity={pressed ? 0.7 : 1}
                  >
                    <Text fontWeight="bold">{link.title}</Text>
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
                )}
              </Pressable>
            ))}
          </ScrollView>
        ) : categories.length === 0 ? (
          <YStack flex={1} items="center" justify="center" p="$4">
            <Paragraph color="#666">No results for &quot;{debouncedQuery}&quot;</Paragraph>
          </YStack>
        ) : (
          <ScrollView
            contentContainerStyle={{
              padding: 24,
              paddingBottom: bottom + TAB_BAR_CLEARANCE,
              gap: 8,
            }}
          >
            {categories.map((category) => {
              const getImageUrl = CATEGORY_IMAGE_RESOLVERS[category.title];

              return (
                <YStack key={category.title} gap="$2" pb="$4">
                  <Text fontSize={13} color="#666">
                    {category.title}
                  </Text>
                  {category.items.map((item) => (
                    <Pressable
                      key={item.id}
                      onPress={() =>
                        router.push({ pathname: category.pathname, params: { id: item.id } })
                      }
                    >
                      {({ pressed }) => (
                        <XStack
                          bg="white"
                          rounded="$4"
                          p="$3"
                          items="center"
                          gap="$3"
                          opacity={pressed ? 0.7 : 1}
                        >
                          {getImageUrl && (
                            <Image
                              source={{ uri: getImageUrl(item) }}
                              style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
                              contentFit="contain"
                            />
                          )}
                          <Text textTransform="capitalize">{item.name.replace(/-/g, ' ')}</Text>
                        </XStack>
                      )}
                    </Pressable>
                  ))}
                </YStack>
              );
            })}
          </ScrollView>
        )}
      </SafeAreaView>
    </YStack>
  );
};

export default SearchScreen;
