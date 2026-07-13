import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, View } from 'react-native';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import type { EvolutionNode } from '@/api/pokemon';
import { usePokemonDetail } from '@/api/use-pokemon-detail';
import { useEvolutionChain } from '@/api/use-evolution-chain';
import { getTypeColor } from '@/constants/pokemon-types';
import { PokedexBrand } from '@/constants/theme';

const EVOLUTION_CIRCLE_SIZE = 64;

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

type EvolutionTabProps = {
  pokemonId: number;
  heroColor: string;
};

export const EvolutionTab = ({ pokemonId, heroColor }: EvolutionTabProps) => {
  const router = useRouter();
  const { data: evolutionChain, isLoading } = useEvolutionChain(pokemonId);

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center">
        <Spinner color={heroColor} />
      </YStack>
    );
  }

  if (!evolutionChain) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4">
        <Paragraph color="#666">No evolution data available.</Paragraph>
      </YStack>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
      <EvolutionBranch
        node={evolutionChain}
        currentId={pokemonId}
        onSelect={(nextId) => {
          if (nextId !== pokemonId) {
            router.push(`/details/${nextId}`);
          }
        }}
      />
    </ScrollView>
  );
};
