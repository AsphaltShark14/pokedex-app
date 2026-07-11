import { useRouter } from 'expo-router';
import type { AndroidSymbol, SFSymbol } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { Pressable, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

import { PokedexBrand } from '@/constants/theme';

const BUBBLE_SIZE = 72;
const COLUMN_OFFSET = BUBBLE_SIZE / 2 + 8;

type ExploreHref =
  | '/contests'
  | '/games'
  | '/encounters'
  | '/explore/machine'
  | '/moves'
  | '/explore/evolution-chain';

type ExploreCategory = {
  label: string;
  href: ExploreHref;
  icon: { ios: SFSymbol; android: AndroidSymbol; web: AndroidSymbol };
};

const EXPLORE_CATEGORIES: ExploreCategory[] = [
  {
    label: 'Contests',
    href: '/contests',
    icon: { ios: 'trophy.fill', android: 'emoji_events', web: 'emoji_events' },
  },
  {
    label: 'Games',
    href: '/games',
    icon: { ios: 'gamecontroller.fill', android: 'sports_esports', web: 'sports_esports' },
  },
  {
    label: 'Encounters',
    href: '/encounters',
    icon: { ios: 'pawprint.fill', android: 'pets', web: 'pets' },
  },
  {
    label: 'Machines',
    href: '/explore/machine',
    icon: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  },
  { label: 'Moves', href: '/moves', icon: { ios: 'bolt.fill', android: 'bolt', web: 'bolt' } },
  {
    label: 'Evolution',
    href: '/explore/evolution-chain',
    icon: { ios: 'arrow.triangle.2.circlepath', android: 'autorenew', web: 'autorenew' },
  },
];

const ExploreBubble = ({ category }: { category: ExploreCategory }) => {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(category.href)}>
      <YStack items="center" gap="$2" width={BUBBLE_SIZE + 16}>
        <View
          style={{
            width: BUBBLE_SIZE,
            height: BUBBLE_SIZE,
            borderRadius: BUBBLE_SIZE / 2,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 2,
          }}
        >
          <SymbolView name={category.icon} tintColor={PokedexBrand.red} size={30} />
        </View>
        <Text fontSize={12} fontWeight="bold" text="center">
          {category.label}
        </Text>
      </YStack>
    </Pressable>
  );
};

export const ExploreBubbleGrid = () => {
  const columnA = EXPLORE_CATEGORIES.filter((_, index) => index % 2 === 0);
  const columnB = EXPLORE_CATEGORIES.filter((_, index) => index % 2 === 1);

  return (
    <XStack justify="space-around" px="$4">
      <YStack gap="$5">
        {columnA.map((category) => (
          <ExploreBubble key={category.label} category={category} />
        ))}
      </YStack>
      <YStack gap="$5" style={{ marginTop: COLUMN_OFFSET }}>
        {columnB.map((category) => (
          <ExploreBubble key={category.label} category={category} />
        ))}
      </YStack>
    </XStack>
  );
};
