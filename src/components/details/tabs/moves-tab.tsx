import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Paragraph, Text, XStack, YStack } from 'tamagui';

import type { PokemonMove } from '@/api/pokemon';

const LEVEL_UP_METHOD = 'Level Up';

type MovesTabProps = {
  moves: PokemonMove[];
  heroColor: string;
};

export const MovesTab = ({ moves, heroColor }: MovesTabProps) => {
  const router = useRouter();

  const groups = useMemo(() => {
    const byMethod = new Map<string, PokemonMove[]>();
    for (const move of moves) {
      const group = byMethod.get(move.method) ?? [];
      group.push(move);
      byMethod.set(move.method, group);
    }

    for (const [method, group] of byMethod) {
      if (method === LEVEL_UP_METHOD) {
        group.sort((a, b) => a.levelLearnedAt - b.levelLearnedAt);
      } else {
        group.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return [...byMethod.entries()].sort(([a], [b]) => {
      if (a === LEVEL_UP_METHOD) return -1;
      if (b === LEVEL_UP_METHOD) return 1;
      return a.localeCompare(b);
    });
  }, [moves]);

  if (moves.length === 0) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4">
        <Paragraph color="#666">No known moves.</Paragraph>
      </YStack>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 8 }}>
      {groups.map(([method, group]) => (
        <YStack key={method} gap="$2" pb="$3">
          <Text fontSize={13} color="#666">
            {method}
          </Text>
          {group.map((move) => (
            <Pressable key={move.id} onPress={() => router.push(`/moves/${move.id}`)}>
              {({ pressed }) => (
                <XStack
                  bg="white"
                  rounded="$4"
                  p="$3"
                  justify="space-between"
                  items="center"
                  opacity={pressed ? 0.7 : 1}
                >
                  <Text textTransform="capitalize">{move.name}</Text>
                  {method === LEVEL_UP_METHOD && (
                    <Text fontSize={12} fontWeight="bold" style={{ color: heroColor }}>
                      Lv. {move.levelLearnedAt}
                    </Text>
                  )}
                </XStack>
              )}
            </Pressable>
          ))}
        </YStack>
      ))}
    </ScrollView>
  );
};
