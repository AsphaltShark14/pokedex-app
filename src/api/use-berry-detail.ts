import { useQuery } from '@tanstack/react-query';

import { fetchBerryDetail } from '@/api/berries';

export const useBerryDetail = (id: number) => {
  return useQuery({
    queryKey: ['berry-detail', id],
    queryFn: () => fetchBerryDetail(id),
  });
};
