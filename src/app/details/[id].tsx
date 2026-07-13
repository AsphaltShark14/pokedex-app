import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { usePokemonDetail } from '@/api/use-pokemon-detail';
import { AboutTab } from '@/components/details/tabs/about-tab';
import { AbilitiesTab } from '@/components/details/tabs/abilities-tab';
import { EvolutionTab } from '@/components/details/tabs/evolution-tab';
import { FieldDataTab } from '@/components/details/tabs/field-data-tab';
import { MovesTab } from '@/components/details/tabs/moves-tab';
import { StatsTab } from '@/components/details/tabs/stats-tab';
import { TabCarousel } from '@/components/details/tab-carousel';
import { PokedexBrand } from '@/constants/theme';
import { getTypeColor } from '@/constants/pokemon-types';
import { useCompareStore } from '@/stores/use-compare-store';

type CompareToggleButtonProps = {
  isComparing: boolean;
  color: string;
  onPress: () => void;
};

const CompareToggleButton = ({ isComparing, color, onPress }: CompareToggleButtonProps) => {
  return (
    <Pressable onPress={onPress}>
      <XStack
        items="center"
        gap="$1"
        rounded="$10"
        px="$3"
        py="$1"
        style={{
          borderWidth: 1,
          borderColor: isComparing ? 'white' : 'rgba(255,255,255,0.6)',
          backgroundColor: isComparing ? 'rgba(255,255,255,0.9)' : 'transparent',
        }}
      >
        <SymbolView
          name={{
            ios: isComparing ? 'checkmark' : 'plus',
            android: isComparing ? 'check' : 'add',
            web: isComparing ? 'check' : 'add',
          }}
          tintColor={isComparing ? color : 'white'}
          size={14}
        />
        <Text fontSize={12} fontWeight="bold" style={{ color: isComparing ? color : 'white' }}>
          Compare
        </Text>
      </XStack>
    </Pressable>
  );
};

const DetailsScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pokemonId = Number(id);
  const { data, isLoading, isError } = usePokemonDetail(pokemonId);
  const isComparing = useCompareStore((state) => state.compareIds.includes(pokemonId));
  const toggleCompare = useCompareStore((state) => state.toggleCompare);

  const heroColor = data ? getTypeColor(data.types[0]) : PokedexBrand.red;

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" bg={PokedexBrand.cream}>
        <Spinner color={PokedexBrand.red} />
      </YStack>
    );
  }

  if (isError || !data) {
    return (
      <YStack flex={1} items="center" justify="center" p="$4" bg={PokedexBrand.cream}>
        <Paragraph>Couldn&apos;t load this Pokémon. Please try again shortly.</Paragraph>
      </YStack>
    );
  }

  const pages = [
    { key: 'about', content: <AboutTab pokemonId={pokemonId} heroColor={heroColor} /> },
    {
      key: 'stats',
      content: (
        <StatsTab stats={data.stats} baseExperience={data.baseExperience} heroColor={heroColor} />
      ),
    },
    {
      key: 'abilities',
      content: <AbilitiesTab abilities={data.abilities} heroColor={heroColor} />,
    },
    { key: 'moves', content: <MovesTab moves={data.moves} heroColor={heroColor} /> },
    { key: 'evolution', content: <EvolutionTab pokemonId={pokemonId} heroColor={heroColor} /> },
    {
      key: 'field-data',
      content: (
        <FieldDataTab pokemonId={pokemonId} heldItems={data.heldItems} heroColor={heroColor} />
      ),
    },
  ];

  return (
    <YStack flex={1} style={{ backgroundColor: heroColor }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <XStack justify="space-between" items="center" p="$3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            hitSlop={12}
          >
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              tintColor="white"
              size={24}
            />
          </Pressable>
          <CompareToggleButton
            isComparing={isComparing}
            color={heroColor}
            onPress={() => toggleCompare(pokemonId)}
          />
        </XStack>

        <YStack items="center" gap="$2" px="$4">
          <Text fontWeight="bold" fontSize={14} color="rgba(255,255,255,0.8)">
            No. {String(data.id).padStart(3, '0')}
          </Text>
          <Text fontWeight="bold" fontSize={28} color="white">
            {data.name}
          </Text>
          <XStack gap="$2">
            {data.types.map((type) => (
              <XStack key={type} bg="rgba(255,255,255,0.25)" rounded="$10" px="$3" py="$1">
                <Text color="white" fontSize={12} fontWeight="bold">
                  {type}
                </Text>
              </XStack>
            ))}
          </XStack>
        </YStack>

        {data.imageUrl && (
          <Image
            source={{ uri: data.imageUrl }}
            style={{ width: '100%', height: 160 }}
            contentFit="contain"
            transition={300}
          />
        )}

        <YStack
          flex={1}
          style={{
            backgroundColor: PokedexBrand.cream,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          }}
        >
          <TabCarousel pages={pages} accentColor={heroColor} />
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};

export default DetailsScreen;
