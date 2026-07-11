import { useQuery } from '@tanstack/react-query';

import { fetchLocationAreaDetail } from '@/api/locations';

export const useLocationAreaDetail = (id: number) => {
  return useQuery({
    queryKey: ['location-area-detail', id],
    queryFn: () => fetchLocationAreaDetail(id),
  });
};
