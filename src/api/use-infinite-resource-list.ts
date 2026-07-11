import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchResourceList } from '@/api/poke-resource';

const PAGE_SIZE = 20;

export const useInfiniteResourceList = (resource: string, pageSize = PAGE_SIZE) => {
  return useInfiniteQuery({
    queryKey: ['resource-infinite', resource, pageSize],
    queryFn: ({ pageParam }) => fetchResourceList(resource, { limit: pageSize, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length * pageSize : undefined,
  });
};
