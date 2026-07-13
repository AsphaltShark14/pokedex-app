import type { ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { FlatList, View, useWindowDimensions } from 'react-native';

export type TabPage = {
  key: string;
  content: ReactNode;
};

type TabCarouselProps = {
  pages: TabPage[];
  accentColor: string;
};

// Infinite-loop trick: clone the last page in front and the first page behind,
// start scrolled to the real first page, then silently snap back to the
// matching real page whenever the user lands on a clone.
export const TabCarousel = ({ pages, accentColor }: TabCarouselProps) => {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<TabPage>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const extendedPages = [pages[pages.length - 1], ...pages, pages[0]];

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const extendedIndex = Math.round(event.nativeEvent.contentOffset.x / width);

      if (extendedIndex === 0) {
        listRef.current?.scrollToOffset({ offset: pages.length * width, animated: false });
        setActiveIndex(pages.length - 1);
      } else if (extendedIndex === pages.length + 1) {
        listRef.current?.scrollToOffset({ offset: width, animated: false });
        setActiveIndex(0);
      } else {
        setActiveIndex(extendedIndex - 1);
      }
    },
    [pages.length, width],
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 6,
          paddingVertical: 10,
        }}
      >
        {pages.map((page, index) => (
          <View
            key={page.key}
            style={{
              width: index === activeIndex ? 20 : 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: index === activeIndex ? accentColor : '#ddd',
            }}
          />
        ))}
      </View>

      <FlatList<TabPage>
        ref={listRef}
        data={extendedPages}
        keyExtractor={(page, index) => `${page.key}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={1}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onScrollToIndexFailed={() => {}}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item }) => <View style={{ width, flex: 1 }}>{item.content}</View>}
      />
    </View>
  );
};
