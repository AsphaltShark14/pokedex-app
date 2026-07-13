import { useQuery } from '@tanstack/react-query';

import { fetchAbilityDetail } from '@/api/abilities';

export const useAbilityDetail = (id: number) => {
  return useQuery({
    queryKey: ['ability-detail', id],
    queryFn: () => fetchAbilityDetail(id),
  });
};
