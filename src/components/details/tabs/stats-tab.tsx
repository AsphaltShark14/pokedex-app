import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, XStack, YStack } from 'tamagui';

import type { PokemonStat } from '@/api/pokemon';
import { TAB_BAR_CLEARANCE } from '@/constants/theme';

const MAX_STAT_VALUE = 255;

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

type StatsTabProps = {
  stats: PokemonStat[];
  baseExperience: number;
  heroColor: string;
};

export const StatsTab = ({ stats, baseExperience, heroColor }: StatsTabProps) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: bottom + TAB_BAR_CLEARANCE, gap: 16 }}
    >
      {stats.map((stat) => (
        <StatBar key={stat.key} stat={stat} color={heroColor} />
      ))}

      <XStack justify="space-between" items="center" pt="$4">
        <Text fontSize={13} color="#666">
          Base Experience
        </Text>
        <Text fontWeight="bold" fontSize={14}>
          {baseExperience}
        </Text>
      </XStack>
    </ScrollView>
  );
};
