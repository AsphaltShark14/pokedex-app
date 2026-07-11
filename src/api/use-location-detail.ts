import { useQuery } from '@tanstack/react-query';

import { fetchLocationDetail } from '@/api/locations';

export const useLocationDetail = (id: number) => {
  return useQuery({
    queryKey: ['location-detail', id],
    queryFn: () => fetchLocationDetail(id),
  });
};
