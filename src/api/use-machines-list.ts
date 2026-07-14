import { useQuery } from '@tanstack/react-query';

import { fetchItemFilterCategory } from '@/api/items';
import { ALL_MACHINES_CATEGORY_ID } from '@/constants/machines';

export const useMachinesList = () => {
  return useQuery({
    queryKey: ['item-filter', 'item-category', ALL_MACHINES_CATEGORY_ID],
    queryFn: () => fetchItemFilterCategory('item-category', ALL_MACHINES_CATEGORY_ID),
    staleTime: Infinity,
  });
};
