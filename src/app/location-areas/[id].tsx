import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { useLocationAreaDetail } from '@/api/use-location-area-detail';
import { getPokemonArtworkUrl } from '@/constants/sprites';
import { PokedexBrand } from '@/constants/theme';

const POKEMON_CIRCLE_SIZE = 64;

const LocationAreaDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const areaId = Number(id);
  const { data, isLoading, isError } = useLocationAreaDetail(areaId);

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
        <Paragraph>Couldn&apos;t load this area. Please try again shortly.</Paragraph>
      </YStack>
    );
  }

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
          <Text fontWeight="bold" fontSize={18} textTransform="capitalize">
            {data.name.replace(/-/g, ' ')}
          </Text>
        </XStack>

        <ScrollView contentContainerStyle={{ padding: 24, gap: 4 }}>
          <Pressable onPress={() => router.push(`/locations/${data.location.id}`)}>
            <XStack justify="space-between" items="center" py="$2">
              <Text fontSize={13} color="#666">
                Location
              </Text>
              <Text
                fontWeight="bold"
                fontSize={14}
                textTransform="capitalize"
                color={PokedexBrand.locationTeal}
              >
                {data.location.name.replace(/-/g, ' ')}
              </Text>
            </XStack>
          </Pressable>

          {data.pokemonEncounters.length > 0 ? (
            <YStack gap="$2" pt="$3">
              <Text fontSize={13} color="#666">
                Pokémon Encounters
              </Text>
              <XStack gap="$4" style={{ flexWrap: 'wrap' }}>
                {data.pokemonEncounters.map((pokemon) => (
                  <Pressable
                    key={pokemon.id}
                    onPress={() => router.push(`/details/${pokemon.id}`)}
                    style={{ alignItems: 'center', width: 80 }}
                  >
                    <View
                      style={{
                        width: POKEMON_CIRCLE_SIZE,
                        height: POKEMON_CIRCLE_SIZE,
                        borderRadius: POKEMON_CIRCLE_SIZE / 2,
                        backgroundColor: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        borderWidth: 2,
                        borderColor: '#ddd',
                      }}
                    >
                      <Image
                        source={{ uri: getPokemonArtworkUrl(pokemon.id) }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="contain"
                      />
                    </View>
                    <Text
                      fontSize={11}
                      fontWeight="bold"
                      textTransform="capitalize"
                      numberOfLines={1}
                      mt="$1"
                    >
                      {pokemon.name}
                    </Text>
                  </Pressable>
                ))}
              </XStack>
            </YStack>
          ) : (
            <YStack pt="$5" items="center">
              <Paragraph color="#666">No known Pokémon encounters here.</Paragraph>
            </YStack>
          )}
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
};

export default LocationAreaDetailScreen;
