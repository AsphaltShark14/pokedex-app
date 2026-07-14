import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import type { EvolutionNode } from '@/api/pokemon';
import { useEvolutionChain } from '@/api/use-evolution-chain';
import { EvolutionNodeCircle } from '@/components/evolution/evolution-node-circle';
import { PokedexBrand, TAB_BAR_CLEARANCE } from '@/constants/theme';

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
  const { bottom } = useSafeAreaInsets();

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
    <ScrollView
      contentContainerStyle={{
        padding: 24,
        paddingBottom: bottom + TAB_BAR_CLEARANCE,
        alignItems: 'center',
      }}
    >
      <EvolutionBranch
        node={evolutionChain}
        currentId={pokemonId}
        onSelect={(nextId) => {
          if (nextId !== pokemonId) {
            router.push(`/details/${nextId}`);
          }
        }}
      />
      <Pressable onPress={() => router.push(`/evolution/${pokemonId}`)} style={{ marginTop: 24 }}>
        <XStack items="center" gap="$2">
          <Text fontWeight="bold" color={PokedexBrand.red}>
            See Full Evolution Family
          </Text>
          <SymbolView
            name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
            tintColor={PokedexBrand.red}
            size={16}
          />
        </XStack>
      </Pressable>
    </ScrollView>
  );
};
