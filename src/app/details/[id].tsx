import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import type { EvolutionNode, PokemonStat } from '@/api/pokemon';
import { useEvolutionChain } from '@/api/use-evolution-chain';
import { usePokemonDetail } from '@/api/use-pokemon-detail';
import { PokedexBrand } from '@/constants/theme';
import { getTypeColor } from '@/constants/pokemon-types';
import { useCompareStore } from '@/stores/use-compare-store';

const MAX_STAT_VALUE = 255;
const EVOLUTION_CIRCLE_SIZE = 64;

type StatBarProps = {
  stat: PokemonStat;
  color: string;
};

const StatBar = ({ stat, color }: StatBarProps) => {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(stat.value / MAX_STAT_VALUE, 1) * 100, { duration: 700 });
  }, [stat.value, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <XStack items="center" gap="$3">
      <Text width={64} fontSize={12} color="#666">
        {stat.label}
      </Text>
      <YStack flex={1} height={10} bg="#eee" rounded="$10" overflow="hidden">
        <Animated.View style={[{ height: '100%', backgroundColor: color }, animatedStyle]} />
      </YStack>
      <Text width={32} fontSize={13} fontWeight="bold" text="right">
        {stat.value}
      </Text>
    </XStack>
  );
};

type CompareToggleButtonProps = {
  isComparing: boolean;
  color: string;
  onPress: () => void;
};

const CompareToggleButton = ({ isComparing, color, onPress }: CompareToggleButtonProps) => {
  return (
    <Pressable onPress={onPress}>
      <XStack
        items="center"
        gap="$1"
        rounded="$10"
        px="$3"
        py="$1"
        style={{
          borderWidth: 1,
          borderColor: isComparing ? color : '#ccc',
          backgroundColor: isComparing ? color : 'transparent',
        }}
      >
        <SymbolView
          name={{
            ios: isComparing ? 'checkmark' : 'plus',
            android: isComparing ? 'check' : 'add',
            web: isComparing ? 'check' : 'add',
          }}
          tintColor={isComparing ? 'white' : '#666'}
          size={14}
        />
        <Text fontSize={12} fontWeight="bold" color={isComparing ? 'white' : '#666'}>
          Compare
        </Text>
      </XStack>
    </Pressable>
  );
};

type EvolutionNodeCircleProps = {
  id: number;
  name: string;
  isCurrent: boolean;
  onPress: () => void;
};

const EvolutionNodeCircle = ({ id, name, isCurrent, onPress }: EvolutionNodeCircleProps) => {
  const { data } = usePokemonDetail(id);
  const borderColor = data ? getTypeColor(data.types[0]) : '#ddd';

  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', width: 80 }}>
      <View
        style={{
          width: EVOLUTION_CIRCLE_SIZE,
          height: EVOLUTION_CIRCLE_SIZE,
          borderRadius: EVOLUTION_CIRCLE_SIZE / 2,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderWidth: isCurrent ? 3 : 2,
          borderColor: isCurrent ? PokedexBrand.red : borderColor,
        }}
      >
        {data?.imageUrl ? (
          <Image
            source={{ uri: data.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
            transition={200}
          />
        ) : (
          <Spinner color={PokedexBrand.red} />
        )}
      </View>
      <Text fontSize={11} fontWeight="bold" textTransform="capitalize" numberOfLines={1} mt="$1">
        {name}
      </Text>
    </Pressable>
  );
};

type EvolutionBranchProps = {
  node: EvolutionNode;
  currentId: number;
  onSelect: (id: number) => void;
};

const EvolutionBranch = ({ node, currentId, onSelect }: EvolutionBranchProps) => {
  return (
    <YStack items="center" gap="$2">
      <EvolutionNodeCircle
        id={node.id}
        name={node.name}
        isCurrent={node.id === currentId}
        onPress={() => onSelect(node.id)}
      />
      {node.children.length > 0 && (
        <>
          <SymbolView
            name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
            tintColor="#999"
            size={16}
          />
          <XStack gap="$4" justify="center" style={{ flexWrap: 'wrap' }}>
            {node.children.map((child) => (
              <EvolutionBranch
                key={child.id}
                node={child}
                currentId={currentId}
                onSelect={onSelect}
              />
            ))}
          </XStack>
        </>
      )}
    </YStack>
  );
};

const DetailsScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pokemonId = Number(id);
  const { data, isLoading, isError } = usePokemonDetail(pokemonId);
  const { data: evolutionChain } = useEvolutionChain(pokemonId);
  const isComparing = useCompareStore((state) => state.compareIds.includes(pokemonId));
  const toggleCompare = useCompareStore((state) => state.toggleCompare);

  const heroColor = data ? getTypeColor(data.types[0]) : PokedexBrand.red;
  const hasEvolutions = evolutionChain
    ? evolutionChain.id !== pokemonId || evolutionChain.children.length > 0
    : false;

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
        <Paragraph>Couldn&apos;t load this Pokémon. Please try again shortly.</Paragraph>
      </YStack>
    );
  }

  return (
    <YStack flex={1} style={{ backgroundColor: heroColor }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <XStack p="$3">
          <Pressable onPress={() => router.back()} hitSlop={12}>
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
          <Text fontWeight="bold" fontSize={28} color="white">
            {data.name}
          </Text>
          <XStack gap="$2">
            {data.types.map((type) => (
              <XStack key={type} bg="rgba(255,255,255,0.25)" rounded="$10" px="$3" py="$1">
                <Text color="white" fontSize={12} fontWeight="bold">
                  {type}
                </Text>
              </XStack>
            ))}
          </XStack>
        </YStack>

        {data.imageUrl && (
          <Image
            source={{ uri: data.imageUrl }}
            style={{ width: '100%', height: 200 }}
            contentFit="contain"
            transition={300}
          />
        )}

        <Animated.View
          entering={FadeInDown.duration(300)}
          style={{
            flex: 1,
            backgroundColor: PokedexBrand.cream,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          }}
        >
          <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
            <XStack justify="space-around">
              <YStack items="center" gap="$1">
                <Text fontSize={12} color="#666">
                  Height
                </Text>
                <Text fontWeight="bold" fontSize={16}>
                  {(data.height / 10).toFixed(1)} m
                </Text>
              </YStack>
              <YStack items="center" gap="$1">
                <Text fontSize={12} color="#666">
                  Weight
                </Text>
                <Text fontWeight="bold" fontSize={16}>
                  {(data.weight / 10).toFixed(1)} kg
                </Text>
              </YStack>
            </XStack>

            <YStack gap="$1">
              <Text fontSize={12} color="#666">
                Abilities
              </Text>
              <Text fontWeight="bold" fontSize={14}>
                {data.abilities.join(', ')}
              </Text>
            </YStack>

            <YStack gap="$3">
              <XStack justify="space-between" items="center">
                <Text fontSize={12} color="#666">
                  Base Stats
                </Text>
                <CompareToggleButton
                  isComparing={isComparing}
                  color={heroColor}
                  onPress={() => toggleCompare(pokemonId)}
                />
              </XStack>
              {data.stats.map((stat) => (
                <StatBar key={stat.key} stat={stat} color={heroColor} />
              ))}
            </YStack>

            {hasEvolutions && evolutionChain && (
              <YStack gap="$3">
                <Text fontSize={12} color="#666">
                  Evolution
                </Text>
                <EvolutionBranch
                  node={evolutionChain}
                  currentId={pokemonId}
                  onSelect={(nextId) => {
                    if (nextId !== pokemonId) {
                      router.push(`/details/${nextId}`);
                    }
                  }}
                />
              </YStack>
            )}
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </YStack>
  );
};

export default DetailsScreen;
