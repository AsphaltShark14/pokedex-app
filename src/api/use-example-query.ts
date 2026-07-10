import { useQuery } from '@tanstack/react-query';

import { fetchExampleItems } from '@/api/example';

export const useExampleQuery = () => {
  return useQuery({
    queryKey: ['example-items'],
    queryFn: fetchExampleItems,
  });
};
