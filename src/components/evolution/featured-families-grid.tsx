import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

import { getPokemonArtworkUrl } from '@/constants/sprites';

type FeaturedFamily = {
  id: number;
  name: string;
};

const FEATURED_FAMILIES: FeaturedFamily[] = [
  { id: 1, name: 'Bulbasaur' },
  { id: 4, name: 'Charmander' },
  { id: 7, name: 'Squirtle' },
  { id: 172, name: 'Pichu' },
  { id: 133, name: 'Eevee' },
  { id: 265, name: 'Wurmple' },
  { id: 123, name: 'Scyther' },
  { id: 840, name: 'Applin' },
];

const FeaturedFamilyBubble = ({ family }: { family: FeaturedFamily }) => {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(`/evolution/${family.id}`)}>
      <YStack items="center" gap="$1" width={84}>
        <YStack
          width={72}
          height={72}
          rounded={36}
          bg="white"
          items="center"
          justify="center"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 2,
          }}
        >
          <Image
            source={{ uri: getPokemonArtworkUrl(family.id) }}
            style={{ width: 56, height: 56 }}
            contentFit="contain"
          />
        </YStack>
        <Text fontSize={12} fontWeight="bold" text="center">
          {family.name}
        </Text>
      </YStack>
    </Pressable>
  );
};

export const FeaturedFamiliesGrid = () => (
  <XStack gap="$3" style={{ flexWrap: 'wrap' }} justify="center">
    {FEATURED_FAMILIES.map((family) => (
      <FeaturedFamilyBubble key={family.id} family={family} />
    ))}
  </XStack>
);
