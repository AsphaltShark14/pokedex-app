import { useQuery } from '@tanstack/react-query';

import type { ItemFilterKind } from '@/api/items';
import { fetchItemFilterCategory } from '@/api/items';
import { fetchResourceList } from '@/api/poke-resource';

export const useItemFilterCategory = (kind: ItemFilterKind, id: number | undefined) => {
  return useQuery({
    queryKey: ['item-filter', kind, id],
    queryFn: () => fetchItemFilterCategory(kind, id as number),
    enabled: id !== undefined,
  });
};

export const useItemFilterOptions = (kind: ItemFilterKind) => {
  return useQuery({
    queryKey: ['item-filter-options', kind],
    queryFn: () => fetchResourceList(kind, { limit: 100, offset: 0 }),
    staleTime: Infinity,
  });
};
