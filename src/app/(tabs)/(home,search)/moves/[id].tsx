import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { useMoveDetail } from '@/api/use-move-detail';
import { getTypeColor } from '@/constants/pokemon-types';
import { getPokemonArtworkUrl } from '@/constants/sprites';
import { PokedexBrand, TAB_BAR_CLEARANCE } from '@/constants/theme';

const POKEMON_CIRCLE_SIZE = 64;

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <XStack justify="space-between" items="center" py="$2">
    <Text fontSize={13} color="#666">
      {label}
    </Text>
    <Text fontWeight="bold" fontSize={14} textTransform="capitalize">
      {value}
    </Text>
  </XStack>
);

const MoveDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const moveId = Number(id);
  const { data, isLoading, isError } = useMoveDetail(moveId);
  const { bottom } = useSafeAreaInsets();

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" bg={PokedexBrand.cream}>
        <Spinner color={PokedexBrand.red} />
      </YStack>
    );
  }

  if (isError || !data) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4" bg={PokedexBrand.cream}>
        <Paragraph>Couldn&apos;t load this move. Please try again shortly.</Paragraph>
      </YStack>
    );
  }

  const heroColor = getTypeColor(data.type);

  return (
    <YStack flex={1} style={{ backgroundColor: heroColor }}>
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

        <YStack items="center" gap="$2" px="$4" pb="$5">
          <Text fontWeight="bold" fontSize={14} color="rgba(255,255,255,0.8)">
            No. {String(data.id).padStart(3, '0')}
          </Text>
          <Text fontWeight="bold" fontSize={28} color="white" textTransform="capitalize">
            {data.name.replace(/-/g, ' ')}
          </Text>
          <XStack bg="rgba(255,255,255,0.25)" rounded="$10" px="$3" py="$1">
            <Text color="white" fontSize={12} fontWeight="bold" textTransform="capitalize">
              {data.type}
            </Text>
          </XStack>
        </YStack>

        <YStack
          flex={1}
          style={{
            backgroundColor: PokedexBrand.cream,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              padding: 24,
              paddingBottom: bottom + TAB_BAR_CLEARANCE,
              gap: 4,
            }}
          >
            {data.power !== null && <InfoRow label="Power" value={String(data.power)} />}
            {data.pp !== null && <InfoRow label="PP" value={String(data.pp)} />}
            {data.accuracy !== null && <InfoRow label="Accuracy" value={`${data.accuracy}%`} />}
            <InfoRow label="Priority" value={String(data.priority)} />
            <InfoRow label="Damage Class" value={data.damageClass} />
            <InfoRow label="Target" value={data.target.replace(/-/g, ' ')} />
            <InfoRow label="Generation" value={data.generation.replace(/-/g, ' ')} />

            {data.shortEffect.length > 0 && (
              <YStack gap="$2" pt="$3">
                <Text fontSize={13} color="#666">
                  Effect
                </Text>
                <Paragraph fontSize={14}>{data.shortEffect}</Paragraph>
              </YStack>
            )}

            {data.learnedByPokemon.length > 0 && (
              <YStack gap="$2" pt="$3">
                <Text fontSize={13} color="#666">
                  Learned By
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 16 }}
                >
                  {data.learnedByPokemon.map((pokemon) => (
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
                </ScrollView>
              </YStack>
            )}
          </ScrollView>
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};

export default MoveDetailScreen;
