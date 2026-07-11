import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';

import type { PokeResourceItem } from '@/api/poke-resource';
import { useResourcePreview } from '@/api/use-resource-preview';
import { ExploreBubbleGrid } from '@/components/home/explore-bubble-grid';
import {
  HomeSectionRow,
  ROW_CARD_HEIGHT,
  ROW_CARD_WIDTH,
} from '@/components/home/home-section-row';
import { getBerrySpriteUrl, getItemSpriteUrl, getPokemonArtworkUrl } from '@/constants/sprites';
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
  onPress,
}: {
  item: PokeResourceItem;
  getImageUrl: (name: string) => string;
  onPress?: () => void;
}) => {
  const card = (
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

  if (!onPress) {
    return card;
  }

  return <Pressable onPress={onPress}>{card}</Pressable>;
};

const TextRowItem = ({ item, onPress }: { item: PokeResourceItem; onPress?: () => void }) => {
  const card = (
    <View style={[rowCardStyle, { padding: 12 }]}>
      <Text
        fontSize={13}
        fontWeight="bold"
        textTransform="capitalize"
        numberOfLines={3}
        text="center"
      >
        {item.name.replace(/-/g, ' ')}
      </Text>
    </View>
  );

  if (!onPress) {
    return card;
  }

  return <Pressable onPress={onPress}>{card}</Pressable>;
};

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

const ItemsSectionRow = () => {
  const router = useRouter();
  const { data, isLoading } = useResourcePreview('item', 10);

  return (
    <HomeSectionRow
      title="Items"
      items={data?.items}
      isLoading={isLoading}
      keyExtractor={(item) => String(item.id)}
      onSeeAll={() => router.push('/items')}
      renderItem={(item) => (
        <SpriteRowItem
          item={item}
          getImageUrl={getItemSpriteUrl}
          onPress={() => router.push(`/items/${item.id}`)}
        />
      )}
    />
  );
};

const BerriesSectionRow = () => {
  const router = useRouter();
  const { data, isLoading } = useResourcePreview('berry', 10);

  return (
    <HomeSectionRow
      title="Berries"
      items={data?.items}
      isLoading={isLoading}
      keyExtractor={(item) => String(item.id)}
      onSeeAll={() => router.push('/berries')}
      renderItem={(item) => (
        <SpriteRowItem
          item={item}
          getImageUrl={getBerrySpriteUrl}
          onPress={() => router.push(`/berries/${item.id}`)}
        />
      )}
    />
  );
};

const LocationsSectionRow = () => {
  const router = useRouter();
  const { data, isLoading } = useResourcePreview('location', 10);

  return (
    <HomeSectionRow
      title="Locations"
      items={data?.items}
      isLoading={isLoading}
      keyExtractor={(item) => String(item.id)}
      onSeeAll={() => router.push('/locations')}
      renderItem={(item) => (
        <TextRowItem item={item} onPress={() => router.push(`/locations/${item.id}`)} />
      )}
    />
  );
};

const HomeScreen = () => {
  return (
    <YStack flex={1} bg={PokedexBrand.cream}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <YStack bg={PokedexBrand.red} p="$4" items="center">
            <Text style={{ fontFamily: 'PressStart2P_400Regular' }} color="white" fontSize={18}>
              Pokédex
            </Text>
          </YStack>

          <PokemonSectionRow />
          <ItemsSectionRow />
          <BerriesSectionRow />
          <LocationsSectionRow />

          <YStack pt="$4" pb="$3" px="$4">
            <Text fontWeight="bold" fontSize={18}>
              Explore More
            </Text>
          </YStack>
          <ExploreBubbleGrid />
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
};

export default HomeScreen;
