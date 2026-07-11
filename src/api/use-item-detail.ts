import { useQuery } from '@tanstack/react-query';

import { fetchItemDetail } from '@/api/items';

export const useItemDetail = (id: number) => {
  return useQuery({
    queryKey: ['item-detail', id],
    queryFn: () => fetchItemDetail(id),
  });
};
