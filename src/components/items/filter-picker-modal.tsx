import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, TextInput, View } from 'react-native';
import { Text, XStack } from 'tamagui';

import type { PokeResourceItem } from '@/api/poke-resource';
import { PokedexBrand } from '@/constants/theme';

const ALL_OPTION_ID = -1;

type FilterPickerModalProps = {
  visible: boolean;
  title: string;
  options: PokeResourceItem[];
  selectedId: number | undefined;
  onSelect: (id: number | undefined) => void;
  onClose: () => void;
};

export const FilterPickerModal = ({
  visible,
  title,
  options,
  selectedId,
  onSelect,
  onClose,
}: FilterPickerModalProps) => {
  const [query, setQuery] = useState('');

  const rows: PokeResourceItem[] = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const filtered = trimmed ? options.filter((option) => option.name.includes(trimmed)) : options;
    return [{ id: ALL_OPTION_ID, name: 'All' }, ...filtered];
  }, [options, query]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
        <Pressable
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={onClose}
        />
        <View
          style={{
            backgroundColor: PokedexBrand.cream,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: 520,
            padding: 16,
          }}
        >
          <XStack justify="space-between" items="center" pb="$3">
            <Text fontWeight="bold" fontSize={18} textTransform="capitalize">
              {title}
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <SymbolView
                name={{ ios: 'xmark', android: 'close', web: 'close' }}
                tintColor="#666"
                size={20}
              />
            </Pressable>
          </XStack>

          <XStack bg="white" rounded="$10" px="$4" py="$2" items="center" gap="$2" mb="$3">
            <SymbolView
              name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
              tintColor="#999"
              size={16}
            />
            <TextInput
              style={{ flex: 1, fontSize: 16, paddingVertical: 8 }}
              value={query}
              onChangeText={setQuery}
              placeholder={`Search ${title}`}
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </XStack>

          <FlatList<PokeResourceItem>
            data={rows}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const isAll = item.id === ALL_OPTION_ID;
              const selected = isAll ? selectedId === undefined : selectedId === item.id;

              return (
                <Pressable
                  onPress={() => {
                    onSelect(isAll ? undefined : item.id);
                    onClose();
                  }}
                >
                  <XStack
                    justify="space-between"
                    items="center"
                    py="$3"
                    style={{ borderBottomWidth: 1, borderBottomColor: '#eee' }}
                  >
                    <Text
                      fontSize={15}
                      fontWeight={selected ? 'bold' : 'normal'}
                      textTransform="capitalize"
                      color={selected ? PokedexBrand.itemBlue : '#333'}
                    >
                      {item.name.replace(/-/g, ' ')}
                    </Text>
                    {selected && (
                      <SymbolView
                        name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                        tintColor={PokedexBrand.itemBlue}
                        size={18}
                      />
                    )}
                  </XStack>
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};
