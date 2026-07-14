import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';
import { Spinner, Text } from 'tamagui';

import { usePokemonDetail } from '@/api/use-pokemon-detail';
import { getTypeColor } from '@/constants/pokemon-types';
import { PokedexBrand } from '@/constants/theme';

type EvolutionNodeCircleProps = {
  id: number;
  name: string;
  isCurrent: boolean;
  onPress: () => void;
  size?: number;
};

export const EvolutionNodeCircle = ({
  id,
  name,
  isCurrent,
  onPress,
  size = 64,
}: EvolutionNodeCircleProps) => {
  const { data } = usePokemonDetail(id);
  const borderColor = data ? getTypeColor(data.types[0]) : '#ddd';

  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', width: size + 16 }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderWidth: isCurrent ? 3 : 2,
          borderColor: isCurrent ? PokedexBrand.red : borderColor,
        }}
      >
        {data?.imageUrl ? (
          <Image
            source={{ uri: data.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
            transition={200}
          />
        ) : (
          <Spinner color={PokedexBrand.red} />
        )}
      </View>
      <Text fontSize={11} fontWeight="bold" textTransform="capitalize" numberOfLines={1} mt="$1">
        {name}
      </Text>
    </Pressable>
  );
};
