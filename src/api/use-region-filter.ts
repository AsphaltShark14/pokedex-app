import { useQuery } from '@tanstack/react-query';

import { fetchRegionLocations } from '@/api/locations';
import { fetchResourceList } from '@/api/poke-resource';

export const useRegionList = () => {
  return useQuery({
    queryKey: ['region-list'],
    queryFn: () => fetchResourceList('region', { limit: 20, offset: 0 }),
    staleTime: Infinity,
  });
};

export const useRegionLocations = (id: number | undefined) => {
  return useQuery({
    queryKey: ['region-locations', id],
    queryFn: () => fetchRegionLocations(id as number),
    enabled: id !== undefined,
  });
};
