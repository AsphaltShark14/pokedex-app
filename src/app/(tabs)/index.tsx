import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';

import type { PokeResourceItem } from '@/api/poke-resource';
import { useResourcePreview } from '@/api/use-resource-preview';
import {
  HomeSectionRow,
  ROW_CARD_HEIGHT,
  ROW_CARD_WIDTH,
} from '@/components/home/home-section-row';
import { BROWSE_RESOURCES } from '@/constants/browse-resources';
import { getPokemonArtworkUrl } from '@/constants/sprites';
import { PokedexBrand } from '@/constants/theme';

const ROW_IMAGE_SIZE = 72;

const rowCardStyle = {
  width: ROW_CARD_WIDTH,
  height: ROW_CARD_HEIGHT,
  backgroundColor: 'white',
  borderRadius: 16,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  padding: 8,
  gap: 4,
};

const PokemonRowItem = ({ item, onPress }: { item: PokeResourceItem; onPress: () => void }) => (
  <Pressable onPress={onPress}>
    <View style={rowCardStyle}>
      <Image
        source={{ uri: getPokemonArtworkUrl(item.id) }}
        style={{ width: ROW_IMAGE_SIZE, height: ROW_IMAGE_SIZE }}
        contentFit="contain"
      />
      <Text fontSize={12} fontWeight="bold" textTransform="capitalize" numberOfLines={1}>
        {item.name}
      </Text>
    </View>
  </Pressable>
);

const SpriteRowItem = ({
  item,
  getImageUrl,
}: {
  item: PokeResourceItem;
  getImageUrl: (name: string) => string;
}) => (
  <View style={rowCardStyle}>
    <Image
      source={{ uri: getImageUrl(item.name) }}
      style={{ width: ROW_IMAGE_SIZE, height: ROW_IMAGE_SIZE }}
      contentFit="contain"
    />
    <Text fontSize={12} fontWeight="bold" textTransform="capitalize" numberOfLines={1}>
      {item.name}
    </Text>
  </View>
);

const TextRowItem = ({ item }: { item: PokeResourceItem }) => (
  <View style={[rowCardStyle, { padding: 12 }]}>
    <Text
      fontSize={13}
      fontWeight="bold"
      textTransform="capitalize"
      numberOfLines={3}
      text="center"
    >
      {item.name}
    </Text>
  </View>
);

const PokemonSectionRow = () => {
  const router = useRouter();
  const { data, isLoading } = useResourcePreview('pokemon', 10);

  return (
    <HomeSectionRow
      title="Pokémon"
      items={data?.items}
      isLoading={isLoading}
      keyExtractor={(item) => String(item.id)}
      onSeeAll={() => router.push('/pokemon-list')}
      renderItem={(item) => (
        <PokemonRowItem item={item} onPress={() => router.push(`/details/${item.id}`)} />
      )}
    />
  );
};

const BrowseSectionRow = ({ resource, title, getImageUrl }: (typeof BROWSE_RESOURCES)[number]) => {
  const router = useRouter();
  const { data, isLoading } = useResourcePreview(resource, 10);

  return (
    <HomeSectionRow
      title={title}
      items={data?.items}
      isLoading={isLoading}
      keyExtractor={(item) => String(item.id)}
      onSeeAll={() => router.push(`/browse/${resource}`)}
      renderItem={(item) =>
        getImageUrl ? (
          <SpriteRowItem item={item} getImageUrl={getImageUrl} />
        ) : (
          <TextRowItem item={item} />
        )
      }
    />
  );
};

const HomeScreen = () => {
  return (
    <YStack flex={1} bg={PokedexBrand.cream}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <YStack bg={PokedexBrand.red} p="$4" items="center">
            <Text style={{ fontFamily: 'PressStart2P_400Regular' }} color="white" fontSize={18}>
              Pokédex
            </Text>
          </YStack>

          <PokemonSectionRow />
          {BROWSE_RESOURCES.map((config) => (
            <BrowseSectionRow key={config.resource} {...config} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
};

export default HomeScreen;
