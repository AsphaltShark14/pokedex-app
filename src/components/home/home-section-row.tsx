import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

import { PokedexBrand } from '@/constants/theme';

export const ROW_CARD_WIDTH = 88;
export const ROW_CARD_HEIGHT = 116;

type HomeSectionRowProps<T> = {
  title: string;
  items: T[] | undefined;
  isLoading: boolean;
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  onSeeAll: () => void;
};

export const HomeSectionRow = <T,>({
  title,
  items,
  isLoading,
  keyExtractor,
  renderItem,
  onSeeAll,
}: HomeSectionRowProps<T>) => {
  return (
    <YStack gap="$2" py="$2">
      <Text fontWeight="bold" fontSize={16} px="$4">
        {title}
      </Text>

      {isLoading ? (
        <XStack px="$4" py="$5">
          <ActivityIndicator color={PokedexBrand.red} />
        </XStack>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={items ?? []}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12, alignItems: 'center' }}
          renderItem={({ item }) => <>{renderItem(item)}</>}
          ListFooterComponent={
            <Pressable onPress={onSeeAll}>
              <View
                style={{
                  width: ROW_CARD_WIDTH,
                  height: ROW_CARD_HEIGHT,
                  backgroundColor: 'white',
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <SymbolView
                  name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                  tintColor={PokedexBrand.red}
                  size={20}
                />
                <Text fontSize={12} fontWeight="bold" color={PokedexBrand.red}>
                  See all
                </Text>
              </View>
            </Pressable>
          }
        />
      )}
    </YStack>
  );
};
