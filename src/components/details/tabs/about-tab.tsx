import { ScrollView } from 'react-native';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { usePokemonSpecies } from '@/api/use-pokemon-species';

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

const formatGenderRate = (genderRate: number): string => {
  if (genderRate === -1) {
    return 'Genderless';
  }
  const femalePercent = (genderRate / 8) * 100;
  return `${100 - femalePercent}% ♂ · ${femalePercent}% ♀`;
};

type AboutTabProps = {
  pokemonId: number;
  heroColor: string;
};

export const AboutTab = ({ pokemonId, heroColor }: AboutTabProps) => {
  const { data, isLoading, isError } = usePokemonSpecies(pokemonId);

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center">
        <Spinner color={heroColor} />
      </YStack>
    );
  }

  if (isError || !data) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4">
        <Paragraph>Couldn&apos;t load this Pokémon&apos;s bio.</Paragraph>
      </YStack>
    );
  }

  const badges = [
    data.isLegendary && 'Legendary',
    data.isMythical && 'Mythical',
    data.isBaby && 'Baby',
  ].filter((label): label is string => Boolean(label));

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 4 }}>
      {data.genus.length > 0 && (
        <Text fontSize={13} color="#666" pb="$2">
          {data.genus}
        </Text>
      )}

      {data.flavorText.length > 0 && (
        <Paragraph fontSize={14} pb="$3">
          {data.flavorText}
        </Paragraph>
      )}

      {badges.length > 0 && (
        <XStack gap="$2" pb="$3" style={{ flexWrap: 'wrap' }}>
          {badges.map((label) => (
            <XStack
              key={label}
              rounded="$10"
              px="$3"
              py="$1"
              style={{ backgroundColor: heroColor }}
            >
              <Text color="white" fontSize={12} fontWeight="bold">
                {label}
              </Text>
            </XStack>
          ))}
        </XStack>
      )}

      <InfoRow label="Color" value={data.color} />
      <InfoRow label="Shape" value={data.shape.replace(/-/g, ' ')} />
      {data.habitat && <InfoRow label="Habitat" value={data.habitat.replace(/-/g, ' ')} />}
      <InfoRow label="Capture Rate" value={String(data.captureRate)} />
      <InfoRow label="Base Happiness" value={String(data.baseHappiness)} />
      <InfoRow label="Growth Rate" value={data.growthRate.replace(/-/g, ' ')} />
      <InfoRow label="Gender" value={formatGenderRate(data.genderRate)} />
      <InfoRow label="Hatch Cycles" value={String(data.hatchCounter)} />
    </ScrollView>
  );
};
