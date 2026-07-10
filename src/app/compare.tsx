import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, XStack, YStack, Spinner } from 'tamagui';

import type { PokemonDetail } from '@/api/pokemon';
import { usePokemonDetail } from '@/api/use-pokemon-detail';
import { getTypeColor } from '@/constants/pokemon-types';
import { PokedexBrand } from '@/constants/theme';
import { useCompareStore } from '@/stores/use-compare-store';

const MAX_STAT_VALUE = 255;
const CARD_IMAGE_SIZE = 96;

const ComparePlaceholder = () => (
  <YStack flex={1} items="center" justify="center" gap="$2" p="$3">
    <View
      style={{
        width: CARD_IMAGE_SIZE,
        height: CARD_IMAGE_SIZE,
        borderRadius: CARD_IMAGE_SIZE / 2,
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} tintColor="#ccc" size={28} />
    </View>
    <Text fontSize={12} color="#999" text="center">
      Pick another Pokémon to compare
    </Text>
  </YStack>
);

type ComparePokemonCardProps = {
  id: number | undefined;
  data: PokemonDetail | undefined;
  isLoading: boolean;
  onRemove: () => void;
};

const ComparePokemonCard = ({ id, data, isLoading, onRemove }: ComparePokemonCardProps) => {
  if (id === undefined) {
    return <ComparePlaceholder />;
  }

  if (isLoading || !data) {
    return (
      <YStack flex={1} items="center" justify="center">
        <Spinner color={PokedexBrand.red} />
      </YStack>
    );
  }

  const color = getTypeColor(data.types[0]);

  return (
    <YStack flex={1} items="center" gap="$2" p="$3">
      <View>
        <View
          style={{
            width: CARD_IMAGE_SIZE,
            height: CARD_IMAGE_SIZE,
            borderRadius: CARD_IMAGE_SIZE / 2,
            borderWidth: 3,
            borderColor: color,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {data.imageUrl && (
            <Image
              source={{ uri: data.imageUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
            />
          )}
        </View>
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 24,
            height: 24,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#ddd',
          }}
        >
          <SymbolView
            name={{ ios: 'xmark', android: 'close', web: 'close' }}
            tintColor="#666"
            size={12}
          />
        </Pressable>
      </View>
      <Text fontWeight="bold" fontSize={16} text="center">
        {data.name}
      </Text>
      <XStack gap="$1" justify="center" style={{ flexWrap: 'wrap' }}>
        {data.types.map((type) => (
          <XStack
            key={type}
            rounded="$10"
            px="$2"
            py="$1"
            style={{ backgroundColor: getTypeColor(type) }}
          >
            <Text color="white" fontSize={10} fontWeight="bold">
              {type}
            </Text>
          </XStack>
        ))}
      </XStack>
    </YStack>
  );
};

type CompareStatRowProps = {
  label: string;
  valueA: number;
  valueB: number;
  colorA: string;
  colorB: string;
};

const CompareStatRow = ({ label, valueA, valueB, colorA, colorB }: CompareStatRowProps) => {
  const widthA = useSharedValue(0);
  const widthB = useSharedValue(0);

  useEffect(() => {
    widthA.value = withTiming(Math.min(valueA / MAX_STAT_VALUE, 1) * 100, { duration: 700 });
    widthB.value = withTiming(Math.min(valueB / MAX_STAT_VALUE, 1) * 100, { duration: 700 });
  }, [valueA, valueB, widthA, widthB]);

  const styleA = useAnimatedStyle(() => ({ width: `${widthA.value}%` }));
  const styleB = useAnimatedStyle(() => ({ width: `${widthB.value}%` }));

  const aWins = valueA > valueB;
  const bWins = valueB > valueA;

  return (
    <YStack gap="$1">
      <Text fontSize={11} color="#666" text="center">
        {label}
      </Text>
      <XStack items="center" gap="$2">
        <Text width={32} fontSize={13} fontWeight={aWins ? 'bold' : 'normal'} text="right">
          {valueA}
        </Text>
        <View
          style={{
            flex: 1,
            height: 8,
            backgroundColor: '#eee',
            flexDirection: 'row-reverse',
            overflow: 'hidden',
          }}
        >
          <Animated.View style={[{ height: '100%', backgroundColor: colorA }, styleA]} />
        </View>
        <View style={{ width: 2, height: 16, backgroundColor: '#ccc' }} />
        <View style={{ flex: 1, height: 8, backgroundColor: '#eee', overflow: 'hidden' }}>
          <Animated.View style={[{ height: '100%', backgroundColor: colorB }, styleB]} />
        </View>
        <Text width={32} fontSize={13} fontWeight={bWins ? 'bold' : 'normal'}>
          {valueB}
        </Text>
      </XStack>
    </YStack>
  );
};

const CompareScreen = () => {
  const router = useRouter();
  const compareIds = useCompareStore((state) => state.compareIds);
  const toggleCompare = useCompareStore((state) => state.toggleCompare);
  const clearCompare = useCompareStore((state) => state.clearCompare);

  const [idA, idB] = compareIds;
  const queryA = usePokemonDetail(idA ?? 0, { enabled: idA !== undefined });
  const queryB = usePokemonDetail(idB ?? 0, { enabled: idB !== undefined });

  return (
    <YStack flex={1} bg={PokedexBrand.cream}>
      <SafeAreaView style={{ flex: 1 }}>
        <XStack justify="space-between" items="center" p="$3">
          <Text fontWeight="bold" fontSize={18}>
            Compare
          </Text>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <SymbolView
              name={{ ios: 'xmark', android: 'close', web: 'close' }}
              tintColor="#666"
              size={22}
            />
          </Pressable>
        </XStack>

        <XStack items="center">
          <ComparePokemonCard
            id={idA}
            data={queryA.data}
            isLoading={queryA.isLoading}
            onRemove={() => idA !== undefined && toggleCompare(idA)}
          />

          <Text fontSize={12} fontWeight="bold" color="#999">
            VS
          </Text>

          <ComparePokemonCard
            id={idB}
            data={queryB.data}
            isLoading={queryB.isLoading}
            onRemove={() => idB !== undefined && toggleCompare(idB)}
          />
        </XStack>

        {queryA.data && queryB.data && (
          <YStack gap="$4" p="$5">
            {queryA.data.stats.map((stat, index) => {
              const statB = queryB.data?.stats[index];
              if (!statB) {
                return null;
              }
              return (
                <CompareStatRow
                  key={stat.key}
                  label={stat.label}
                  valueA={stat.value}
                  valueB={statB.value}
                  colorA={getTypeColor(queryA.data.types[0])}
                  colorB={getTypeColor(queryB.data.types[0])}
                />
              );
            })}
          </YStack>
        )}

        <XStack justify="center" p="$4">
          <Pressable
            onPress={() => {
              clearCompare();
              router.back();
            }}
          >
            <Text color={PokedexBrand.red} fontWeight="bold" fontSize={14}>
              Clear comparison
            </Text>
          </Pressable>
        </XStack>
      </SafeAreaView>
    </YStack>
  );
};

export default CompareScreen;
