import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paragraph, Text, XStack, YStack } from 'tamagui';

import type { PokeResourceItem } from '@/api/poke-resource';
import { useMachinesList } from '@/api/use-machines-list';
import { formatMachineLabel, isHiddenMachine, isTechnicalMachine } from '@/constants/machines';
import { PokedexBrand, TAB_BAR_CLEARANCE } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const DEBOUNCE_MS = 300;

type KindFilter = 'all' | 'tm' | 'hm';

const MachineListRow = ({ item, onPress }: { item: PokeResourceItem; onPress: () => void }) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => (
      <XStack bg="white" rounded="$4" p="$3" items="center" gap="$3" opacity={pressed ? 0.7 : 1}>
        <XStack
          bg={isHiddenMachine(item.name) ? PokedexBrand.encounterOrange : PokedexBrand.machineSteel}
          rounded="$4"
          px="$2"
          py="$1"
          items="center"
          justify="center"
        >
          <Text fontSize={11} fontWeight="bold" color="white">
            {isHiddenMachine(item.name) ? 'HM' : 'TM'}
          </Text>
        </XStack>
        <Text fontWeight="bold" color={PokedexBrand.machineSteel}>
          {formatMachineLabel(item.name)}
        </Text>
      </XStack>
    )}
  </Pressable>
);

const KindChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress}>
    <XStack
      rounded="$10"
      px="$3"
      py="$2"
      style={{ backgroundColor: active ? PokedexBrand.machineSteel : 'white' }}
    >
      <Text fontSize={12} fontWeight="bold" color={active ? 'white' : '#666'}>
        {label}
      </Text>
    </XStack>
  </Pressable>
);

const MachinesScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const [kindFilter, setKindFilter] = useState<KindFilter>('all');
  const { bottom } = useSafeAreaInsets();

  const { data, isLoading, isError } = useMachinesList();

  const items = useMemo(() => {
    const all = data?.items ?? [];
    const trimmed = debouncedQuery.trim().toLowerCase();

    return all.filter((item) => {
      if (kindFilter === 'tm' && !isTechnicalMachine(item.name)) {
        return false;
      }
      if (kindFilter === 'hm' && !isHiddenMachine(item.name)) {
        return false;
      }
      if (trimmed && !item.name.includes(trimmed)) {
        return false;
      }
      return true;
    });
  }, [data, debouncedQuery, kindFilter]);

  return (
    <YStack flex={1} bg={PokedexBrand.cream}>
      <SafeAreaView style={{ flex: 1 }}>
        <XStack items="center" gap="$2" p="$3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            hitSlop={12}
          >
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              tintColor={PokedexBrand.machineSteel}
              size={24}
            />
          </Pressable>
          <Text fontWeight="bold" fontSize={18}>
            Machines
          </Text>
        </XStack>

        <XStack bg="white" rounded="$10" px="$4" py="$2" items="center" gap="$2" mx="$3" mb="$3">
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            tintColor="#999"
            size={16}
          />
          <TextInput
            style={{ flex: 1, fontSize: 16, paddingVertical: 8 }}
            value={query}
            onChangeText={setQuery}
            placeholder="Search Machines"
            placeholderTextColor="#999"
            autoCapitalize="none"
            returnKeyType="search"
          />
        </XStack>

        <XStack gap="$2" px="$3" pb="$3">
          <KindChip
            label="All"
            active={kindFilter === 'all'}
            onPress={() => setKindFilter('all')}
          />
          <KindChip label="TMs" active={kindFilter === 'tm'} onPress={() => setKindFilter('tm')} />
          <KindChip label="HMs" active={kindFilter === 'hm'} onPress={() => setKindFilter('hm')} />
        </XStack>

        {isLoading ? (
          <YStack flex={1} items="center" justify="center">
            <ActivityIndicator color={PokedexBrand.machineSteel} />
          </YStack>
        ) : isError ? (
          <YStack flex={1} items="center" justify="center" p="$4">
            <Paragraph>Couldn&apos;t load Machines. Please try again shortly.</Paragraph>
          </YStack>
        ) : items.length === 0 ? (
          <YStack flex={1} items="center" justify="center" p="$4">
            <Paragraph color="#666">No machines found.</Paragraph>
          </YStack>
        ) : (
          <FlatList<PokeResourceItem>
            data={items}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: bottom + TAB_BAR_CLEARANCE,
              gap: 12,
            }}
            renderItem={({ item }) => (
              <MachineListRow item={item} onPress={() => router.push(`/machines/${item.id}`)} />
            )}
          />
        )}
      </SafeAreaView>
    </YStack>
  );
};

export default MachinesScreen;
