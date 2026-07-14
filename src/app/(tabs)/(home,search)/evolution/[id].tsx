import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { useEvolutionChain } from '@/api/use-evolution-chain';
import { usePokemonDetail } from '@/api/use-pokemon-detail';
import { EvolutionConditionSheet } from '@/components/evolution/evolution-condition-sheet';
import type { EvolutionConditionSelection } from '@/components/evolution/evolution-tree-diagram';
import { EvolutionTreeDiagram } from '@/components/evolution/evolution-tree-diagram';
import { getTypeColor } from '@/constants/pokemon-types';
import { PokedexBrand, TAB_BAR_CLEARANCE } from '@/constants/theme';

const EvolutionFamilyScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pokemonId = Number(id);
  const { data: chain, isLoading, isError } = useEvolutionChain(pokemonId);
  const { data: rootDetail } = usePokemonDetail(chain?.id ?? pokemonId, {
    enabled: Boolean(chain),
  });
  const [selection, setSelection] = useState<EvolutionConditionSelection | null>(null);
  const { bottom } = useSafeAreaInsets();

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" bg={PokedexBrand.cream}>
        <Spinner color={PokedexBrand.red} />
      </YStack>
    );
  }

  if (isError || !chain) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4" bg={PokedexBrand.cream}>
        <Paragraph>Couldn&apos;t load this evolution family. Please try again shortly.</Paragraph>
      </YStack>
    );
  }

  const heroColor = rootDetail ? getTypeColor(rootDetail.types[0]) : PokedexBrand.red;

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
          <Text fontWeight="bold" fontSize={28} color="white" textTransform="capitalize">
            {chain.name} Family
          </Text>
          <XStack bg="rgba(255,255,255,0.25)" rounded="$10" px="$3" py="$1">
            <Text color="white" fontSize={12} fontWeight="bold">
              Tap a Pokémon to view it, tap a condition to see how it evolves
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
            contentContainerStyle={{ flexGrow: 1, paddingBottom: bottom + TAB_BAR_CLEARANCE }}
          >
            <EvolutionTreeDiagram
              chain={chain}
              currentId={pokemonId}
              onSelectPokemon={(nextId) => router.push(`/details/${nextId}`)}
              onSelectCondition={setSelection}
            />
          </ScrollView>
        </YStack>
      </SafeAreaView>

      <EvolutionConditionSheet selection={selection} onClose={() => setSelection(null)} />
    </YStack>
  );
};

export default EvolutionFamilyScreen;
