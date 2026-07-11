import { useQuery } from '@tanstack/react-query';

import { fetchResourceList } from '@/api/poke-resource';

const SEARCH_INDEX_LIMIT = 3000;

export const useResourceSearchIndex = (resource: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['resource-search-index', resource],
    queryFn: () => fetchResourceList(resource, { limit: SEARCH_INDEX_LIMIT, offset: 0 }),
    staleTime: Infinity,
    enabled,
  });
};
