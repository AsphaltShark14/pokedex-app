import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import type { PokemonAbility } from '@/api/pokemon';
import { useAbilityDetail } from '@/api/use-ability-detail';
import { TAB_BAR_CLEARANCE } from '@/constants/theme';

const AbilityRow = ({ ability, heroColor }: { ability: PokemonAbility; heroColor: string }) => {
  const { data, isLoading } = useAbilityDetail(ability.id);

  return (
    <YStack bg="white" rounded="$4" p="$3" gap="$1">
      <XStack justify="space-between" items="center">
        <Text fontWeight="bold" fontSize={15}>
          {ability.name}
        </Text>
        {ability.isHidden && (
          <XStack rounded="$10" px="$2" py="$1" style={{ backgroundColor: heroColor }}>
            <Text color="white" fontSize={10} fontWeight="bold">
              HIDDEN
            </Text>
          </XStack>
        )}
      </XStack>

      {isLoading ? (
        <Spinner size="small" color={heroColor} />
      ) : (
        data?.shortEffect && (
          <Text fontSize={13} color="#666">
            {data.shortEffect}
          </Text>
        )
      )}
    </YStack>
  );
};

type AbilitiesTabProps = {
  abilities: PokemonAbility[];
  heroColor: string;
};

export const AbilitiesTab = ({ abilities, heroColor }: AbilitiesTabProps) => {
  const { bottom } = useSafeAreaInsets();

  if (abilities.length === 0) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4">
        <Paragraph color="#666">No known abilities.</Paragraph>
      </YStack>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: bottom + TAB_BAR_CLEARANCE, gap: 12 }}
    >
      {abilities.map((ability) => (
        <AbilityRow key={ability.id} ability={ability} heroColor={heroColor} />
      ))}
    </ScrollView>
  );
};
