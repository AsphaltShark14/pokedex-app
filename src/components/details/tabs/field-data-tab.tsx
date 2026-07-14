import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import type { PokemonHeldItem } from '@/api/pokemon';
import { usePokemonEncounters } from '@/api/use-pokemon-encounters';
import { getItemSpriteUrl } from '@/constants/sprites';
import { TAB_BAR_CLEARANCE } from '@/constants/theme';

const ITEM_SPRITE_SIZE = 40;

type FieldDataTabProps = {
  pokemonId: number;
  heldItems: PokemonHeldItem[];
  heroColor: string;
};

export const FieldDataTab = ({ pokemonId, heldItems, heroColor }: FieldDataTabProps) => {
  const router = useRouter();
  const { data: encounters, isLoading } = usePokemonEncounters(pokemonId);
  const { bottom } = useSafeAreaInsets();

  const hasHeldItems = heldItems.length > 0;
  const hasEncounters = (encounters?.length ?? 0) > 0;

  if (!isLoading && !hasHeldItems && !hasEncounters) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4">
        <Paragraph color="#666" text="center">
          Not yet documented holding items or appearing in the wild.
        </Paragraph>
      </YStack>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: bottom + TAB_BAR_CLEARANCE, gap: 8 }}
    >
      {hasHeldItems && (
        <YStack gap="$2" pb="$4">
          <Text fontSize={13} color="#666">
            Held Items
          </Text>
          {heldItems.map((held) => (
            <Pressable key={held.item.id} onPress={() => router.push(`/items/${held.item.id}`)}>
              {({ pressed }) => (
                <XStack
                  bg="white"
                  rounded="$4"
                  p="$3"
                  items="center"
                  gap="$3"
                  opacity={pressed ? 0.7 : 1}
                >
                  <Image
                    source={{ uri: getItemSpriteUrl(held.item.name) }}
                    style={{ width: ITEM_SPRITE_SIZE, height: ITEM_SPRITE_SIZE }}
                    contentFit="contain"
                  />
                  <Text textTransform="capitalize" flex={1}>
                    {held.item.name.replace(/-/g, ' ')}
                  </Text>
                  <Text fontSize={12} fontWeight="bold" style={{ color: heroColor }}>
                    {held.rarity}%
                  </Text>
                </XStack>
              )}
            </Pressable>
          ))}
        </YStack>
      )}

      <YStack gap="$2">
        <Text fontSize={13} color="#666">
          Where to Find
        </Text>
        {isLoading ? (
          <Spinner color={heroColor} />
        ) : hasEncounters ? (
          encounters?.map((area) => (
            <Pressable key={area.id} onPress={() => router.push(`/location-areas/${area.id}`)}>
              {({ pressed }) => (
                <XStack
                  bg="white"
                  rounded="$4"
                  p="$3"
                  justify="space-between"
                  items="center"
                  opacity={pressed ? 0.7 : 1}
                >
                  <Text textTransform="capitalize">{area.name.replace(/-/g, ' ')}</Text>
                </XStack>
              )}
            </Pressable>
          ))
        ) : (
          <Paragraph color="#666">Not documented in the wild.</Paragraph>
        )}
      </YStack>
    </ScrollView>
  );
};
