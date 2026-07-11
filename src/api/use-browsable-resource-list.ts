import { useMemo } from 'react';

import { useInfiniteResourceList } from '@/api/use-infinite-resource-list';
import { useResourceSearchIndex } from '@/api/use-resource-search-index';

const MAX_SEARCH_RESULTS = 50;

export const useBrowsableResourceList = (resource: string, debouncedQuery: string) => {
  const hasQuery = debouncedQuery.trim().length > 0;

  const infinite = useInfiniteResourceList(resource);
  const search = useResourceSearchIndex(resource, hasQuery);

  const pagedItems = useMemo(
    () => infinite.data?.pages.flatMap((page) => page.items) ?? [],
    [infinite.data],
  );

  const searchResults = useMemo(() => {
    if (!hasQuery || !search.data) return [];
    const trimmed = debouncedQuery.trim().toLowerCase();
    return search.data.items
      .filter((item) => item.name.includes(trimmed))
      .slice(0, MAX_SEARCH_RESULTS);
  }, [search.data, debouncedQuery, hasQuery]);

  return {
    items: hasQuery ? searchResults : pagedItems,
    isLoading: hasQuery ? search.isLoading : infinite.isLoading,
    isError: hasQuery ? search.isError : infinite.isError,
    hasQuery,
    fetchNextPage: infinite.fetchNextPage,
    hasNextPage: !hasQuery && infinite.hasNextPage,
    isFetchingNextPage: infinite.isFetchingNextPage,
  };
};
