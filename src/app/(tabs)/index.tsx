import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Text, XStack, YStack } from 'tamagui';

import { usePokemonList } from '@/api/use-pokemon-list';
import type { PokemonListItem } from '@/api/pokemon';
import { PokedexBrand } from '@/constants/theme';

const HomeScreen = () => {
  const router = useRouter();
  const { data, isLoading, isError } = usePokemonList();

  return (
    <YStack flex={1} bg={PokedexBrand.cream}>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack bg={PokedexBrand.red} p="$4" items="center">
          <Text style={{ fontFamily: 'PressStart2P_400Regular' }} color="white" fontSize={18}>
            Pokédex
          </Text>
        </YStack>

        {isLoading ? (
          <YStack flex={1} items="center" justify="center">
            <ActivityIndicator color={PokedexBrand.red} />
          </YStack>
        ) : isError ? (
          <YStack flex={1} items="center" justify="center" p="$4">
            <Paragraph>Couldn&apos;t load Pokémon. Please try again shortly.</Paragraph>
          </YStack>
        ) : (
          <FlatList<PokemonListItem>
            data={data}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            renderItem={({ item }) => (
              <Pressable onPress={() => router.push(`/details/${item.id}`)}>
                {({ pressed }) => (
                  <XStack
                    bg="white"
                    rounded="$4"
                    p="$3"
                    items="center"
                    gap="$3"
                    opacity={pressed ? 0.7 : 1}
                  >
                    <Text fontWeight="bold" color={PokedexBrand.red}>
                      No. {String(item.id).padStart(3, '0')}
                    </Text>
                    <Text textTransform="capitalize">{item.name}</Text>
                  </XStack>
                )}
              </Pressable>
            )}
          />
        )}
      </SafeAreaView>
    </YStack>
  );
};

export default HomeScreen;
