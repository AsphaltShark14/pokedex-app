import { useQuery } from '@tanstack/react-query';

import { fetchMoveDetail } from '@/api/moves';

export const useMoveDetail = (id: number) => {
  return useQuery({
    queryKey: ['move-detail', id],
    queryFn: () => fetchMoveDetail(id),
  });
};
