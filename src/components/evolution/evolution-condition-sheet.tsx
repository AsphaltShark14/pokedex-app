import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Modal, Pressable, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

import type { EvolutionCondition } from '@/api/pokemon';
import { useResourceSearchIndex } from '@/api/use-resource-search-index';
import type { EvolutionConditionSelection } from '@/components/evolution/evolution-tree-diagram';
import { buildConditionChips, describeEvolutionTrigger } from '@/constants/evolution-conditions';
import { PokedexBrand } from '@/constants/theme';

type EvolutionConditionSheetProps = {
  selection: EvolutionConditionSelection | null;
  onClose: () => void;
};

type ConditionStepProps = {
  condition: EvolutionCondition;
  onClose: () => void;
};

const ConditionStep = ({ condition, onClose }: ConditionStepProps) => {
  const trigger = describeEvolutionTrigger(condition.trigger);
  const chips = buildConditionChips(condition);
  const itemSearch = useResourceSearchIndex('item', Boolean(condition.item));
  const router = useRouter();

  const itemId = condition.item
    ? itemSearch.data?.items.find((entry) => entry.name === condition.item?.name)?.id
    : undefined;

  return (
    <YStack bg="white" rounded="$6" p="$3" gap="$2" style={{ borderWidth: 1, borderColor: '#eee' }}>
      <XStack items="center" gap="$2">
        <SymbolView name={trigger.icon} tintColor={PokedexBrand.red} size={18} />
        <Text fontWeight="bold" fontSize={15}>
          {trigger.label}
        </Text>
      </XStack>

      <XStack gap="$2" style={{ flexWrap: 'wrap' }}>
        {chips.map((chip) => (
          <XStack
            key={chip.label}
            items="center"
            gap="$1"
            bg={PokedexBrand.cream}
            px="$2"
            py="$1"
            rounded="$10"
          >
            <SymbolView name={chip.icon} tintColor="#666" size={12} />
            <Text fontSize={12} fontWeight="bold" color="#444">
              {chip.label}
            </Text>
          </XStack>
        ))}
        {chips.length === 0 && (
          <Text fontSize={12} color="#666">
            No additional conditions.
          </Text>
        )}
      </XStack>

      {condition.item && itemId !== undefined && (
        <Pressable
          onPress={() => {
            onClose();
            router.push(`/items/${itemId}`);
          }}
        >
          <XStack items="center" gap="$1">
            <Text fontSize={13} fontWeight="bold" color={PokedexBrand.itemBlue}>
              View {condition.item.formattedName}
            </Text>
            <SymbolView
              name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
              tintColor={PokedexBrand.itemBlue}
              size={12}
            />
          </XStack>
        </Pressable>
      )}
    </YStack>
  );
};

export const EvolutionConditionSheet = ({ selection, onClose }: EvolutionConditionSheetProps) => {
  const visible = selection !== null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
        <Pressable
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={onClose}
        />
        <View
          style={{
            backgroundColor: PokedexBrand.cream,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '70%',
            padding: 16,
          }}
        >
          <XStack justify="space-between" items="center" pb="$3">
            <Text fontWeight="bold" fontSize={18}>
              {selection ? `${selection.fromName} → ${selection.toName}` : ''}
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <SymbolView
                name={{ ios: 'xmark', android: 'close', web: 'close' }}
                tintColor="#666"
                size={20}
              />
            </Pressable>
          </XStack>

          {selection?.isAmbiguousSplit && (
            <XStack bg="#FFF3CD" rounded="$4" p="$2" mb="$3" items="center" gap="$2">
              <SymbolView
                name={{ ios: 'questionmark.circle.fill', android: 'help', web: 'help' }}
                tintColor="#8A6D00"
                size={16}
              />
              <Text fontSize={12} color="#8A6D00" style={{ flex: 1 }}>
                Which form appears is decided randomly — the game doesn&apos;t expose a rule to tell
                these apart in advance.
              </Text>
            </XStack>
          )}

          <YStack gap="$3">
            {selection?.conditions.length ? (
              selection.conditions.map((condition, index) => (
                <ConditionStep key={index} condition={condition} onClose={onClose} />
              ))
            ) : (
              <Text color="#666">No evolution condition data available.</Text>
            )}
          </YStack>
        </View>
      </View>
    </Modal>
  );
};
