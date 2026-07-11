import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { useItemDetail } from '@/api/use-item-detail';
import { getItemSpriteUrl, getPokemonArtworkUrl } from '@/constants/sprites';
import { PokedexBrand } from '@/constants/theme';

const ITEM_IMAGE_SIZE = 120;
const POKEMON_CIRCLE_SIZE = 64;

const InfoRow = ({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) => {
  const row = (
    <XStack justify="space-between" items="center" py="$2">
      <Text fontSize={13} color="#666">
        {label}
      </Text>
      <Text
        fontWeight="bold"
        fontSize={14}
        textTransform="capitalize"
        color={onPress ? PokedexBrand.itemBlue : undefined}
      >
        {value}
      </Text>
    </XStack>
  );

  if (!onPress) {
    return row;
  }

  return <Pressable onPress={onPress}>{row}</Pressable>;
};

const ItemDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const itemId = Number(id);
  const { data, isLoading, isError } = useItemDetail(itemId);

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" bg={PokedexBrand.cream}>
        <Spinner color={PokedexBrand.itemBlue} />
      </YStack>
    );
  }

  if (isError || !data) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4" bg={PokedexBrand.cream}>
        <Paragraph>Couldn&apos;t load this item. Please try again shortly.</Paragraph>
      </YStack>
    );
  }

  return (
    <YStack flex={1} style={{ backgroundColor: PokedexBrand.itemBlue }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <XStack p="$3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            hitSlop={12}
          >
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              tintColor="white"
              size={24}
            />
          </Pressable>
        </XStack>

        <YStack items="center" gap="$2" px="$4">
          <Text fontWeight="bold" fontSize={14} color="rgba(255,255,255,0.8)">
            No. {String(data.id).padStart(3, '0')}
          </Text>
          <Text fontWeight="bold" fontSize={28} color="white" textTransform="capitalize">
            {data.name}
          </Text>
        </YStack>

        <Image
          source={{ uri: getItemSpriteUrl(data.name) }}
          style={{ width: '100%', height: ITEM_IMAGE_SIZE }}
          contentFit="contain"
        />

        <YStack
          flex={1}
          style={{
            backgroundColor: PokedexBrand.cream,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          }}
        >
          <YStack p="$5" gap="$1">
            <InfoRow
              label="Category"
              value={data.category.name}
              onPress={() => router.push(`/items?category=${data.category.id}`)}
            />
            <InfoRow label="Cost" value={`₽${data.cost}`} />
            {data.flingPower !== null && (
              <InfoRow label="Fling Power" value={String(data.flingPower)} />
            )}
            {data.flingEffect !== null && <InfoRow label="Fling Effect" value={data.flingEffect} />}

            {data.attributes.length > 0 && (
              <YStack gap="$2" pt="$3">
                <Text fontSize={13} color="#666">
                  Attributes
                </Text>
                <XStack gap="$2" style={{ flexWrap: 'wrap' }}>
                  {data.attributes.map((attribute) => (
                    <Pressable
                      key={attribute.id}
                      onPress={() => router.push(`/items?attribute=${attribute.id}`)}
                    >
                      <XStack bg={PokedexBrand.itemBlue} rounded="$10" px="$3" py="$2">
                        <Text
                          color="white"
                          fontSize={12}
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
                          {attribute.name.replace(/-/g, ' ')}
                        </Text>
                      </XStack>
                    </Pressable>
                  ))}
                </XStack>
              </YStack>
            )}

            {data.shortEffect.length > 0 && (
              <YStack gap="$2" pt="$3">
                <Text fontSize={13} color="#666">
                  Effect
                </Text>
                <Paragraph fontSize={14}>{data.shortEffect}</Paragraph>
              </YStack>
            )}

            {data.heldByPokemon.length > 0 && (
              <YStack gap="$2" pt="$3">
                <Text fontSize={13} color="#666">
                  Held By
                </Text>
                <XStack gap="$4" style={{ flexWrap: 'wrap' }}>
                  {data.heldByPokemon.map((pokemon) => (
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
            )}
          </YStack>
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};

export default ItemDetailScreen;
