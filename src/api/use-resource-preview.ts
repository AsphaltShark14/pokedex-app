import { useQuery } from '@tanstack/react-query';

import { fetchResourceList } from '@/api/poke-resource';

export const useResourcePreview = (resource: string, limit = 10) => {
  return useQuery({
    queryKey: ['resource-preview', resource, limit],
    queryFn: () => fetchResourceList(resource, { limit, offset: 0 }),
  });
};
