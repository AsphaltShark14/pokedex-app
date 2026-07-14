import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { useItemDetail } from '@/api/use-item-detail';
import { useMachineMoveHistory } from '@/api/use-machine-move-history';
import { useMoveDetail } from '@/api/use-move-detail';
import { formatMachineLabel, HM_BLURB, isHiddenMachine, TM_BLURB } from '@/constants/machines';
import { getPokemonArtworkUrl } from '@/constants/sprites';
import { PokedexBrand, TAB_BAR_CLEARANCE } from '@/constants/theme';

const ITEM_IMAGE_SIZE = 120;
const POKEMON_CIRCLE_SIZE = 64;

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <XStack justify="space-between" items="center" py="$2">
    <Text fontSize={13} color="#666">
      {label}
    </Text>
    <Text fontWeight="bold" fontSize={14}>
      {value}
    </Text>
  </XStack>
);

const MachineDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const itemId = Number(id);
  const { data, isLoading, isError } = useItemDetail(itemId);
  const { bottom } = useSafeAreaInsets();

  const { groups, isLoading: isHistoryLoading } = useMachineMoveHistory(data?.machineHistory ?? []);
  const latestGroup = groups[groups.length - 1];
  const { data: latestMove } = useMoveDetail(latestGroup?.moveId ?? 0, {
    enabled: latestGroup !== undefined,
  });

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" bg={PokedexBrand.cream}>
        <Spinner color={PokedexBrand.machineSteel} />
      </YStack>
    );
  }

  if (isError || !data) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4" bg={PokedexBrand.cream}>
        <Paragraph>Couldn&apos;t load this machine. Please try again shortly.</Paragraph>
      </YStack>
    );
  }

  const isHm = isHiddenMachine(data.name);

  return (
    <YStack flex={1} style={{ backgroundColor: PokedexBrand.machineSteel }}>
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
          <Text fontWeight="bold" fontSize={28} color="white">
            {formatMachineLabel(data.name)}
          </Text>
          <XStack bg="rgba(255,255,255,0.25)" rounded="$10" px="$3" py="$1">
            <Text color="white" fontSize={12} fontWeight="bold">
              {isHm ? 'Hidden Machine' : 'Technical Machine'}
            </Text>
          </XStack>
        </YStack>

        {data.imageUrl && (
          <Image
            source={{ uri: data.imageUrl }}
            style={{ width: '100%', height: ITEM_IMAGE_SIZE }}
            contentFit="contain"
          />
        )}

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
            <Paragraph fontSize={13} color="#666">
              {isHm ? HM_BLURB : TM_BLURB}
            </Paragraph>

            {data.cost > 0 && (
              <YStack pt="$3">
                <InfoRow label="Cost" value={`₽${data.cost}`} />
              </YStack>
            )}

            <YStack gap="$2" pt="$3">
              <Text fontSize={13} color="#666">
                Move History
              </Text>
              {isHistoryLoading ? (
                <Spinner color={PokedexBrand.machineSteel} />
              ) : (
                groups.map((group) => (
                  <Pressable
                    key={`${group.moveId}-${group.versionGroups[0]}`}
                    onPress={() => router.push(`/moves/${group.moveId}`)}
                  >
                    <XStack
                      justify="space-between"
                      items="center"
                      py="$2"
                      style={{ borderBottomWidth: 1, borderBottomColor: '#eee' }}
                    >
                      <YStack style={{ flex: 1 }}>
                        <Text fontWeight="bold" fontSize={14}>
                          {group.moveName}
                        </Text>
                        <Text fontSize={11} color="#999">
                          {group.versionGroups.join(', ')}
                        </Text>
                      </YStack>
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
                  </Pressable>
                ))
              )}
            </YStack>

            {latestMove && latestMove.learnedByPokemon.length > 0 && (
              <YStack gap="$2" pt="$3">
                <Text fontSize={13} color="#666">
                  Learned By
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 16 }}
                >
                  {latestMove.learnedByPokemon.map((pokemon) => (
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

export default MachineDetailScreen;
