import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

import type { EvolutionCondition, EvolutionNode } from '@/api/pokemon';
import { EvolutionNodeCircle } from '@/components/evolution/evolution-node-circle';
import {
  conditionSetsEqual,
  describeEvolutionTrigger,
  getPrimaryConditionLabel,
} from '@/constants/evolution-conditions';
import { PokedexBrand } from '@/constants/theme';

const NODE_SIZE = 96;

type ConditionChipProps = {
  conditions: EvolutionCondition[];
  onPress: () => void;
};

const ConditionConnector = ({ conditions, onPress }: ConditionChipProps) => {
  const primary = conditions[0];

  if (!primary) {
    return (
      <SymbolView
        name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
        tintColor="#999"
        size={18}
      />
    );
  }

  const trigger = describeEvolutionTrigger(primary.trigger);
  const label = getPrimaryConditionLabel(primary);
  const extraCount = conditions.length - 1;

  return (
    <Pressable onPress={onPress}>
      <YStack items="center" gap="$1">
        <SymbolView
          name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
          tintColor="#999"
          size={18}
        />
        <XStack
          items="center"
          gap="$1"
          bg="white"
          px="$2"
          py="$1"
          rounded="$10"
          style={{
            borderWidth: 1,
            borderColor: '#eee',
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
          }}
        >
          <SymbolView name={trigger.icon} tintColor={PokedexBrand.red} size={13} />
          <Text fontSize={11} fontWeight="bold" color="#333">
            {label}
            {extraCount > 0 ? ` (+${extraCount})` : ''}
          </Text>
        </XStack>
      </YStack>
    </Pressable>
  );
};

export type EvolutionConditionSelection = {
  fromName: string;
  toName: string;
  conditions: EvolutionCondition[];
  isAmbiguousSplit: boolean;
};

type EvolutionTreeBranchProps = {
  node: EvolutionNode;
  currentId?: number;
  onSelectPokemon: (id: number) => void;
  onSelectCondition: (payload: EvolutionConditionSelection) => void;
};

const EvolutionTreeBranch = ({
  node,
  currentId,
  onSelectPokemon,
  onSelectCondition,
}: EvolutionTreeBranchProps) => (
  <YStack items="center" gap="$2">
    <EvolutionNodeCircle
      id={node.id}
      name={node.name}
      isCurrent={node.id === currentId}
      onPress={() => onSelectPokemon(node.id)}
      size={NODE_SIZE}
    />
    {node.children.length > 0 && (
      <XStack gap="$5" justify="center" style={{ flexWrap: 'wrap' }}>
        {node.children.map((child) => {
          const isAmbiguousSplit =
            node.children.length > 1 &&
            node.children.some(
              (sibling) =>
                sibling.id !== child.id &&
                conditionSetsEqual(sibling.evolutionDetails, child.evolutionDetails),
            );

          return (
            <YStack key={child.id} items="center" gap="$2">
              <ConditionConnector
                conditions={child.evolutionDetails}
                onPress={() =>
                  onSelectCondition({
                    fromName: node.name,
                    toName: child.name,
                    conditions: child.evolutionDetails,
                    isAmbiguousSplit,
                  })
                }
              />
              <EvolutionTreeBranch
                node={child}
                currentId={currentId}
                onSelectPokemon={onSelectPokemon}
                onSelectCondition={onSelectCondition}
              />
            </YStack>
          );
        })}
      </XStack>
    )}
  </YStack>
);

type EvolutionTreeDiagramProps = {
  chain: EvolutionNode;
  currentId?: number;
  onSelectPokemon: (id: number) => void;
  onSelectCondition: (selection: EvolutionConditionSelection) => void;
};

export const EvolutionTreeDiagram = ({
  chain,
  currentId,
  onSelectPokemon,
  onSelectCondition,
}: EvolutionTreeDiagramProps) => (
  <YStack items="center" gap="$4" p="$4">
    <EvolutionTreeBranch
      node={chain}
      currentId={currentId}
      onSelectPokemon={onSelectPokemon}
      onSelectCondition={onSelectCondition}
    />
  </YStack>
);
