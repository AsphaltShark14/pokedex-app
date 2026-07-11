import { useQuery } from '@tanstack/react-query';

import type { BerryCategoryKind } from '@/api/berries';
import { fetchBerryCategory } from '@/api/berries';
import { fetchResourceList } from '@/api/poke-resource';

export const useBerryCategory = (kind: BerryCategoryKind, id: number | undefined) => {
  return useQuery({
    queryKey: ['berry-category', kind, id],
    queryFn: () => fetchBerryCategory(kind, id as number),
    enabled: id !== undefined,
  });
};

export const useBerryCategoryList = (kind: BerryCategoryKind) => {
  const resource = kind === 'firmness' ? 'berry-firmness' : 'berry-flavor';

  return useQuery({
    queryKey: ['berry-category-list', kind],
    queryFn: () => fetchResourceList(resource, { limit: 5, offset: 0 }),
    staleTime: Infinity,
  });
};
